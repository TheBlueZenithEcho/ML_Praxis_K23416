# ML_Praxis_K23416
Praxis: An AI-powered web platform for interior designers to manage catalogs, create mood boards, and collaborate with clients.

# CSDL
## Supabase
### Basic commands
```
supabase start
```
```
supabase stop
```
### Working with DB in Supabase
1. Tạo một file migration mới
```
supabase migration new <file_name>
```
2. Mở file SQL đó trong `supabase/migrations/` và thêm lệnh SQL

3. Áp dụng migration vào CSDL local của bạn ( first time only )
```
supabase db reset
```
4. Apply migration (2nd time onwards)
```
supabase migration up
```
5. Push to supabase cloud
Note: only push when connected to ivp4 internet
```
supabase db push
```

### Important info
API URL: http://127.0.0.1:54321

     GraphQL URL: http://127.0.0.1:54321/graphql/v1

  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3

         MCP URL: http://127.0.0.1:54321/mcp

    Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres

      Studio URL: http://127.0.0.1:54323

     Mailpit URL: http://127.0.0.1:54324

 Publishable key: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH

      Secret key: sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz

   S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c
   
   S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907

       S3 Region: local

- Use ipv4 network (not ipv6)