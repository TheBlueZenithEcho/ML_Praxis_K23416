set check_function_bodies = off;

create or replace view "public"."all_designers" as  SELECT p.id,
    p.avatar_url AS img,
    p.name,
    r.role_name AS role,
    u.email,
    p.phone,
    p.created_at
   FROM ((public.profiles p
     LEFT JOIN auth.users u ON ((u.id = p.id)))
     LEFT JOIN public.roles r ON ((r.id = p.role_id)))
  WHERE (r.role_name = 'designer'::text);


CREATE OR REPLACE FUNCTION public.delete_user_as_admin(user_id_to_delete uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  caller_role_id uuid;
  caller_role_name text;
BEGIN
  -- 1. Lấy role_id của người đang gọi hàm
  SELECT p.role_id INTO caller_role_id
  FROM public.profiles p
  WHERE p.id = auth.uid(); -- auth.uid() là người gọi

  -- 2. Kiểm tra xem người gọi có phải là 'admin' không
  SELECT r.role_name INTO caller_role_name
  FROM public.roles r
  WHERE r.id = caller_role_id;

  IF caller_role_name <> 'admin' THEN
    RAISE EXCEPTION 'Permission denied: Only admins can delete users.';
  END IF;

  -- 3. Nếu ĐÚNG là admin, tiến hành xóa user trong auth.users
  -- (Vì bảng profiles có ON DELETE CASCADE, profile sẽ tự động bị xóa)
  DELETE FROM auth.users WHERE id = user_id_to_delete;
  
  RETURN 'User ' || user_id_to_delete || ' deleted successfully';
END;
$function$
;


