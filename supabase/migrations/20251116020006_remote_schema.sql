drop policy "Allow authenticated users to insert customer profile" on "public"."profiles";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Users can update their own profile." on "public"."profiles";

drop view if exists "public"."all_designers";

alter table "public"."product_variants" add column "original_id" text;

alter table "public"."profiles" add column "email" text;

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_all_designers()
 RETURNS TABLE(id uuid, name text, email text, img text, createdat timestamp with time zone, phone text)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT
    -- ⭐️ VÀ THÊM 'p.id' VÀO ĐÂY
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
    r.role_name = 'designer'
  -- ⭐️ THÊM SẮP XẾP
  ORDER BY
    p.created_at DESC;
$function$
;

CREATE OR REPLACE FUNCTION public.get_my_role()
 RETURNS text
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT r.role_name
  FROM public.roles r
  JOIN public.profiles p ON r.id = p.role_id
  WHERE p.id = auth.uid();
$function$
;

CREATE OR REPLACE FUNCTION public.get_profile_by_id(profile_id uuid)
 RETURNS TABLE(id uuid, img text, name text, role text, email character varying, phone text, createdat timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Hàm này join 3 bảng (profiles, auth.users, roles)
    -- và trả về thông tin của người có 'profile_id' được truyền vào
    RETURN QUERY
    SELECT
        p.id,
        p.avatar_url AS img,
        p.name,
        r.role_name AS role, -- Lấy tên vai trò (text)
        u.email,
        p.phone, -- Lấy phone từ 'public.profiles'
        u.created_at AS createdAt
    FROM
        public.profiles p
    LEFT JOIN
        auth.users u ON p.id = u.id
    LEFT JOIN
        public.roles r ON p.role_id = r.id
    WHERE
        -- Lọc theo ID được truyền vào
        p.id = profile_id
    LIMIT 1;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  customer_role_uuid uuid;
  signup_source text; -- Biến để lưu trữ "dấu hiệu"
BEGIN

  -- 1. Lấy "dấu hiệu" từ metadata
  signup_source := NEW.raw_user_meta_data->>'source';

  -- 2. Chỉ chạy logic nếu "dấu hiệu" chính xác là 'public_signup'
  IF signup_source = 'public_signup' THEN

    -- Logic cũ của bạn: Lấy role 'user'
    SELECT id INTO customer_role_uuid
    FROM public.roles
    WHERE role_name = 'user'; -- <-- Đảm bảo 'user' là tên chính xác

    -- Chèn profile với vai trò 'user'
    INSERT INTO public.profiles (
      id,
      name,
      avatar_url,
      role_id,
      email, 
      phone  
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      NEW.raw_user_meta_data->>'avatar_url',
      customer_role_uuid,
      NEW.email, 
      NEW.phone  
    );
  
  END IF;

  RETURN NEW;
END;$function$
;


  create policy "Users can update their own profile."
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



