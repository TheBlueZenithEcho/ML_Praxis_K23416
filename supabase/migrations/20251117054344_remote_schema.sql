set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_products_by_image(p_query_embedding public.vector, p_match_threshold double precision, p_match_count integer)
 RETURNS SETOF jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    -- !!! THAY THẾ URL NÀY !!!
    r2_public_url TEXT := 'https://pub-015964f37f3f4529a8e04997ed43d343.r2.dev/';
BEGIN
    RETURN QUERY
    WITH
    -- 1. TÌM KIẾM VECTOR (Giữ nguyên)
    matching_files AS (
        SELECT
            f.id AS file_id,
            1 - (f.embedding <#> p_query_embedding) AS similarity
        FROM
            public.files f 
        WHERE
            f.is_searchable = true 
            AND f.embedding IS NOT NULL
            AND 1 - (f.embedding <#> p_query_embedding) > p_match_threshold
        ORDER BY
            similarity DESC
        LIMIT
            p_match_count
    ),
    
    -- 2. Lấy variant_id (Giữ nguyên)
    matching_variants AS (
        SELECT
            pi.variant_id,
            mf.similarity
        FROM
            public.product_images pi
        JOIN
            matching_files mf ON pi.file_id = mf.file_id
    ),
    
    -- 3. Tổng hợp ảnh cho các biến thể đã lọc (SỬA LỖI URL ENCODING TẠI ĐÂY)
    product_images_agg AS (
        SELECT
            pi.variant_id,
            -- Dùng REPLACE để thay thế khoảng trắng bằng %20
            jsonb_agg((r2_public_url || REPLACE(f.path_key, ' ', '%20')) ORDER BY pi.sort_order ASC) AS images,
            -- Dùng REPLACE để thay thế khoảng trắng bằng %20 cho thumbnail
            (array_agg((r2_public_url || REPLACE(f.path_key, ' ', '%20')) ORDER BY pi.is_primary DESC, pi.sort_order ASC))[1] AS thumbnail_image
        FROM
            public.product_images pi
        JOIN
            public.files f ON pi.file_id = f.id
        WHERE pi.variant_id IN (SELECT variant_id FROM matching_variants)
        GROUP BY
            pi.variant_id
    )
    
    -- 4. Query chính: Xây dựng JSON (Giữ nguyên)
    SELECT
        jsonb_build_object(
            'id', pv.id,
            'sku', pv.sku,
            'name', COALESCE(pv.name, p.name),
            'description', p.description,
            'images', COALESCE(pia.images, '[]'::jsonb),
            'thumbnailImage', pia.thumbnail_image,
            'category', cat.name,
            'price', pv.price,
            'currency', pv.currency,
            'stock', pv.stock_qty,
            'isAvailable', (pv.stock_qty > 0),
            'views', 0,
            'createdAt', pv.created_at,
            'updatedAt', pv.updated_at,
            'similarity', mv.similarity 
        )
    FROM
        public.product_variants pv
    JOIN
        public.products p ON pv.product_id = p.id
    JOIN
        matching_variants mv ON pv.id = mv.variant_id
    LEFT JOIN
        public.categories cat ON p.category_id = cat.id
    LEFT JOIN
        product_images_agg pia ON pv.id = pia.variant_id
    ORDER BY
        mv.similarity DESC;
END;$function$
;


