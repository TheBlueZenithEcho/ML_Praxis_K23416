# ML_Praxis_K23416
Praxis: An AI-powered web platform for interior designers to manage catalogs, create mood boards, and collaborate with clients.

# CSDL
## Supabase
### Installation
Just the supabase client to be used inside front end.
```
npm install
```
```
npm install @supabase/supabase-js
```

The supabase local db
```
TBU
```
### Basic commands
```
supabase start
```
```
supabase stop
```
### Working with DB in Supabase locally
1. Tạo một file migration mới
```
supabase migration new <file_name>
```
2. Mở file SQL đó trong `supabase/migrations/` và thêm lệnh SQL
3. Apply only new migrations locally
```
supabase migration up
```

4. Clear local db and  apply all migrations saved back into db
```
supabase db reset
```

### Working with Supabase DB on cloud
1. Create a free account and get redirected to the dashboard.
2. Create a project
3. Save SUPABASE_URL (with account id), SUPABASE_
4. Pull db cloud to sync locally (or supabase link --project--ref <supabase_project_id> first)
Note: only directly apply migrations upstream when connected to ivp4 internet
```
supabase db pull
```
If too many changes => ```supabase db reset```
5. Push db local to sync supabase cloud (maybe applicable for local-first workflow)
Note: only push when connected to ivp4 internet
```
supabase db push
```


### Important info for db local backup
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

### Important info for ACTUAL Cloud DB:
[Link to .env files]() - must be placed at root folder of the project required to access supabase, including 1 .env file with fewer keys and less privilege for frontend and 1 .env file with all keys for both Supabase DB and Cloudflare R2 object storage.

- To sync Supabase db migrations MUST Use ipv4 network (not ipv6). 
- Front end access via API is available for both protocols.