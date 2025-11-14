// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/*
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})
*/
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/r2-presigned-upload' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { S3Client, PutObjectCommand } from 'https://esm.sh/@aws-sdk/client-s3@3.583.0';
import { getSignedUrl } from 'https://esm.sh/@aws-sdk/s3-request-presigner@3.583.0';

// Hàm xử lý CORS
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    // --- SỬA LỖI CORS (THÊM DÒNG NÀY) ---
    // Cho phép trình duyệt gửi request 'POST' (và 'OPTIONS' preflight)
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

serve(async (req) => {
  // Xử lý CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    // 1. Lấy thông tin file từ frontend
    const { fileName, contentType } = await req.json();

    // 2. Lấy R2 Secrets (đã cài ở file setup)
    const R2_ENDPOINT = Deno.env.get('R2_ENDPOINT');
    const R2_ACCESS_KEY_ID = Deno.env.get('R2_ACCESS_KEY_ID');
    const R2_SECRET_ACCESS_KEY = Deno.env.get('R2_SECRET_ACCESS_KEY');
    const R2_BUCKET_NAME = Deno.env.get('R2_BUCKET_NAME');

    if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
      throw new Error('Thiếu thông tin cấu hình R2 trên server.');
    }

    // 3. Khởi tạo S3 Client (tương thích R2)
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    // 4. Tạo lệnh PUT
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName, // Đường dẫn file (ví dụ: 'profiles/designers/manning_at_gmail_com.jpg')
      ContentType: contentType, // Loại file (ví dụ: 'image/jpeg')
    });

    // 5. Tạo Presigned URL (link upload an toàn, hết hạn sau 5 phút)
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 phút
    });

    // 6. Trả URL về cho frontend
    return new Response(JSON.stringify({ presignedUrl }), {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});