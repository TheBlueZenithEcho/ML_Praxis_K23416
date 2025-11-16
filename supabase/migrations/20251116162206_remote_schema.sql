alter table "public"."files" add column "embedding" public.vector(384);

alter table "public"."files" add column "is_searchable" boolean default false;

CREATE UNIQUE INDEX categories_name_type_key ON public.categories USING btree (name, type);

CREATE UNIQUE INDEX design_authors_pkey ON public.design_authors USING btree (design_id, author_profile_id);

CREATE UNIQUE INDEX design_categories_pkey ON public.design_categories USING btree (design_id, category_id);

CREATE UNIQUE INDEX design_product_variants_pkey ON public.design_product_variants USING btree (design_id, variant_id);

CREATE UNIQUE INDEX files_bucket_id_path_key_key ON public.files USING btree (bucket_id, path_key);

alter table "public"."design_authors" add constraint "design_authors_pkey" PRIMARY KEY using index "design_authors_pkey";

alter table "public"."design_categories" add constraint "design_categories_pkey" PRIMARY KEY using index "design_categories_pkey";

alter table "public"."design_product_variants" add constraint "design_product_variants_pkey" PRIMARY KEY using index "design_product_variants_pkey";

alter table "public"."categories" add constraint "categories_name_type_key" UNIQUE using index "categories_name_type_key";

alter table "public"."categories" add constraint "categories_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE SET NULL not valid;

alter table "public"."categories" validate constraint "categories_parent_id_fkey";

alter table "public"."design_authors" add constraint "design_authors_author_profile_id_fkey" FOREIGN KEY (author_profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."design_authors" validate constraint "design_authors_author_profile_id_fkey";

alter table "public"."design_authors" add constraint "design_authors_design_id_fkey" FOREIGN KEY (design_id) REFERENCES public.designs(id) ON DELETE CASCADE not valid;

alter table "public"."design_authors" validate constraint "design_authors_design_id_fkey";

alter table "public"."design_categories" add constraint "design_categories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE not valid;

alter table "public"."design_categories" validate constraint "design_categories_category_id_fkey";

alter table "public"."design_categories" add constraint "design_categories_design_id_fkey" FOREIGN KEY (design_id) REFERENCES public.designs(id) ON DELETE CASCADE not valid;

alter table "public"."design_categories" validate constraint "design_categories_design_id_fkey";

alter table "public"."design_images" add constraint "design_images_design_id_fkey" FOREIGN KEY (design_id) REFERENCES public.designs(id) ON DELETE CASCADE not valid;

alter table "public"."design_images" validate constraint "design_images_design_id_fkey";

alter table "public"."design_images" add constraint "design_images_file_id_fkey" FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE not valid;

alter table "public"."design_images" validate constraint "design_images_file_id_fkey";

alter table "public"."design_product_variants" add constraint "design_product_variants_design_id_fkey" FOREIGN KEY (design_id) REFERENCES public.designs(id) ON DELETE CASCADE not valid;

alter table "public"."design_product_variants" validate constraint "design_product_variants_design_id_fkey";

alter table "public"."design_product_variants" add constraint "design_product_variants_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE not valid;

alter table "public"."design_product_variants" validate constraint "design_product_variants_variant_id_fkey";

alter table "public"."designs" add constraint "designs_admin_approver_id_fkey" FOREIGN KEY (admin_approver_id) REFERENCES public.profiles(id) not valid;

alter table "public"."designs" validate constraint "designs_admin_approver_id_fkey";

alter table "public"."designs" add constraint "designs_submitter_id_fkey" FOREIGN KEY (submitter_id) REFERENCES public.profiles(id) not valid;

alter table "public"."designs" validate constraint "designs_submitter_id_fkey";

alter table "public"."files" add constraint "files_bucket_id_path_key_key" UNIQUE using index "files_bucket_id_path_key_key";

alter table "public"."files" add constraint "files_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."files" validate constraint "files_owner_id_fkey";

alter table "public"."product_images" add constraint "product_images_file_id_fkey" FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE not valid;

alter table "public"."product_images" validate constraint "product_images_file_id_fkey";

alter table "public"."product_images" add constraint "product_images_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE not valid;

alter table "public"."product_images" validate constraint "product_images_variant_id_fkey";

alter table "public"."product_variants" add constraint "product_variants_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_variants" validate constraint "product_variants_product_id_fkey";

alter table "public"."products" add constraint "products_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) not valid;

alter table "public"."products" validate constraint "products_category_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_product_admin(p_variant_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  caller_role_name text;
  v_product_id uuid;
BEGIN
    -- 1. KIỂM TRA QUYỀN: Chỉ Admin được xóa
    SELECT r.role_name INTO caller_role_name
    FROM public.profiles p JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid();
    
    IF caller_role_name <> 'admin' THEN
        RAISE EXCEPTION '403: Permission Denied. Only admins can delete products.';
    END IF;

    -- 2. Lấy ID sản phẩm mẹ (TRƯỚC KHI XÓA)
    SELECT product_id INTO v_product_id
    FROM public.product_variants
    WHERE id = p_variant_id;

    -- 3. Xóa Biến thể (product_variant)
    -- (ON DELETE CASCADE sẽ tự động xóa 'product_images')
    DELETE FROM public.product_variants
    WHERE id = p_variant_id;

    -- 4. (Tùy chọn) Xóa Sản phẩm mẹ (product) nếu nó không còn biến thể nào
    IF v_product_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM public.product_variants WHERE product_id = v_product_id
    ) THEN
        DELETE FROM public.products
        WHERE id = v_product_id;
        RETURN 'Variant and parent product ' || p_variant_id || ' deleted.';
    END IF;
    
    RETURN 'Variant ' || p_variant_id || ' deleted.';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_all_products()
 RETURNS SETOF jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Sử dụng Common Table Expressions (CTEs) để xây dựng JSON lồng nhau
    RETURN QUERY
    WITH
    -- 1. Tổng hợp ảnh cho mỗi Biến thể Sản phẩm
    product_images_agg AS (
        SELECT
            pi.variant_id,
            -- Tạo mảng JSON chứa các URL ảnh
            jsonb_agg(
                (public.get_r2_public_url() || f.path_key)
                ORDER BY pi.sort_order ASC
            ) AS images,
            
            -- Lấy ảnh thumbnail (ảnh đầu tiên hoặc is_primary)
            (array_agg(
                (public.get_r2_public_url() || f.path_key)
                ORDER BY pi.is_primary DESC, pi.sort_order ASC
            ))[1] AS thumbnail_image
        FROM
            public.product_images pi
        JOIN
            public.files f ON pi.file_id = f.id
        GROUP BY
            pi.variant_id
    )
    
    -- 2. Query chính: Tìm kiếm và xây dựng JSON
    SELECT
        jsonb_build_object(
            'id', pv.id, -- Lấy ID từ variant
            'sku', pv.sku,
            'name', COALESCE(pv.name, p.name), -- Ưu tiên tên variant, fallback về tên product
            'description', p.description,
            'images', COALESCE(pia.images, '[]'::jsonb),
            'thumbnailImage', pia.thumbnail_image,
            'brand',p.brand,
            'category', cat.name,
            'price', pv.price,
            'currency', pv.currency,
            'stock', pv.stock_qty,
            'isAvailable', (pv.stock_qty > 0),
            'views', 0, -- (Mocked, bạn cần 1 bảng 'views' riêng)
            'createdAt', pv.created_at,
            'updatedAt', pv.updated_at
        )
    FROM
        public.product_variants pv
    JOIN
        public.products p ON pv.product_id = p.id
    LEFT JOIN
        public.categories cat ON p.category_id = cat.id
    LEFT JOIN
        product_images_agg pia ON pv.id = pia.variant_id
    ORDER BY
        pv.created_at DESC;
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_all_users()
 RETURNS TABLE(id uuid, name text, email text, img text, createdat timestamp with time zone, phone text)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT
    p.id,
    p.name,
    p.email,
    p.avatar_url AS img,
    p.created_at AS createdAt,
    p.phone
  FROM
    public.profiles p
    JOIN public.roles r ON p.role_id = r.id
  WHERE
    r.role_name = 'user'
  ORDER BY
    p.created_at DESC;
$function$
;

CREATE OR REPLACE FUNCTION public.get_product_by_id(p_variant_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    -- !!! THAY THẾ URL NÀY !!!
    -- Dán Public URL của R2 bucket (lấy từ file setup_cloudflare_r2.md)
    r2_public_url TEXT := 'https://pub-015964f37f3f4529a8e04997ed43d343.r2.dev/'; -- <<< THAY THẾ BẰNG URL PUBLIC R2 CỦA BẠN
    
    -- Biến để lưu kết quả
    result_json jsonb;
BEGIN
    -- Sử dụng Common Table Expressions (CTEs) để xây dựng JSON lồng nhau
    WITH
    -- 1. Tổng hợp ảnh cho CHỈ BIẾN THỂ NÀY (Tối ưu)
    product_images_agg AS (
        SELECT
            pi.variant_id,
            -- Tạo mảng JSON chứa các URL ảnh
            jsonb_agg(
                (r2_public_url || f.path_key)
                ORDER BY pi.sort_order ASC
            ) AS images,
            
            -- Lấy ảnh thumbnail (ảnh đầu tiên hoặc is_primary)
            (array_agg(
                (r2_public_url || f.path_key)
                ORDER BY pi.is_primary DESC, pi.sort_order ASC
            ))[1] AS thumbnail_image
        FROM
            public.product_images pi
        JOIN
            public.files f ON pi.file_id = f.id
        WHERE
            pi.variant_id = p_variant_id -- Chỉ lấy ảnh cho variant này
        GROUP BY
            pi.variant_id
    )
    
    -- 2. Query chính: Lấy 1 sản phẩm và xây dựng JSON
    SELECT
        jsonb_build_object(
            'id', pv.id,
            'sku', pv.sku,
            'name', COALESCE(pv.name, p.name), -- Ưu tiên tên variant, fallback về tên product
            'description', p.description,
            'images', COALESCE(pia.images, '[]'::jsonb),
            'thumbnailImage', pia.thumbnail_image,
            'brand', p.brand, -- Thêm trường 'brand'
            'category', cat.name,
            'price', pv.price,
            'currency', pv.currency,
            'stock', pv.stock_qty,
            'isAvailable', (pv.stock_qty > 0),
            'views', 0, -- (Mocked, bạn cần 1 bảng 'views' riêng)
            'createdAt', pv.created_at,
            'updatedAt', pv.updated_at
        )
    INTO
        result_json -- Gán kết quả vào biến
    FROM
        public.product_variants pv
    JOIN
        public.products p ON pv.product_id = p.id
    LEFT JOIN
        public.categories cat ON p.category_id = cat.id
    LEFT JOIN
        product_images_agg pia ON pv.id = pia.variant_id
    WHERE
        pv.id = p_variant_id; -- Lọc theo ID đầu vào

    RETURN result_json; -- Trả về đối tượng JSON
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_r2_public_url()
 RETURNS text
 LANGUAGE plpgsql
AS $function$BEGIN
    RETURN 'https://pub-015964f37f3f4529a8e04997ed43d343.r2.dev/'; 
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_product_admin(p_variant_id uuid, p_name text, p_sku text, p_price numeric, p_stock_qty integer, p_description text, p_brand text, p_category_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  caller_role_name text;
  v_product_id uuid;
BEGIN
    -- 1. KIỂM TRA QUYỀN: Chỉ Admin được sửa
    SELECT r.role_name INTO caller_role_name
    FROM public.profiles p JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid();
    
    IF caller_role_name <> 'admin' THEN
        RAISE EXCEPTION '403: Permission Denied. Only admins can update products.';
    END IF;

    -- 2. Cập nhật bảng ProductVariants (Biến thể)
    UPDATE public.product_variants
    SET
        name = p_name,
        sku = p_sku,
        price = p_price,
        stock_qty = p_stock_qty
    WHERE
        id = p_variant_id
    RETURNING product_id INTO v_product_id; -- Lấy ID của sản phẩm mẹ

    -- 3. Cập nhật bảng Products (Mẹ)
    IF v_product_id IS NOT NULL THEN
        UPDATE public.products
        SET
            description = p_description,
            brand = p_brand,
            category_id = p_category_id
        WHERE
            id = v_product_id;
    END IF;
    
    RETURN 'Product ' || p_variant_id || ' updated successfully';
END;
$function$
;


