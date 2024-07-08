const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
  const { request, env } = context;

  // 处理 OPTIONS 请求（预检请求）
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // 处理 POST 请求
  if (request.method === "POST") {
    try {
      const { from, to, subject, text } = await request.json();

      if (!env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not set');
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to: [to], subject, text }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      return new Response(JSON.stringify({ message: '邮件发送成功', data: responseData }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Server error:', error);
      return new Response(JSON.stringify({ error: error.message || '发送失败' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  // 如果不是 POST 或 OPTIONS 请求，返回 405 Method Not Allowed
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { ...corsHeaders, 'Allow': 'POST, OPTIONS' }
  });
}