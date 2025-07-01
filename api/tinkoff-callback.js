// api/tinkoff-callback.js

export const config = { api: { bodyParser: true } }; // ← JSON-парсер включён

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('method not allowed');

  const data = req.body || {};
  res.status(200).end('OK');                   // ← сразу подтверждаем банку

  // успех + подтверждённый статус?
  if (data.Success && data.Status === 'CONFIRMED') {
    const orderId = data.OrderId || '';
    try {
      await fetch('http://tc-soft.ru/TC2019/Pay/move-order.php', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ orderId })
      });
      console.log('move-order called for', orderId);
    } catch (e) {
      console.error('move-order failed:', e.message);
    }
  }
}
