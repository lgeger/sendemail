export async function onRequestPost(context) {
    const { request, env } = context;
    
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
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Server error:', error);
      return new Response(JSON.stringify({ error: error.message || '发送失败' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }