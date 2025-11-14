/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    // thêm các biến môi trường khác của bạn ở đây
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
