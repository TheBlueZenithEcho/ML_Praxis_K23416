set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_my_role()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  role_name_result TEXT;
BEGIN
  SET LOCAL "session.bypass_rls" = 'on';
  SELECT r.role_name
  INTO role_name_result
  FROM public.roles r
  JOIN public.profiles p ON r.id = p.role_id
  WHERE p.id = auth.uid();
  SET LOCAL "session.bypass_rls" = 'off';
  RETURN role_name_result;
END;
$function$
;


  create policy "Admin full access on profiles"
  on "public"."profiles"
  as permissive
  for all
  to authenticated
using ((public.get_my_role() = 'admin'::text))
with check ((public.get_my_role() = 'admin'::text));



