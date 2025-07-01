import getRawBody from 'raw-body';

export const config = { api: { bodyParser: false } }; // получаем «сырой» JSON

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('method not allowed');

  // читаем «сырое» тело (Tinkoff присылает application/json)
  const raw = await getRawBody(req);
  const data = JSON.parse(raw.toString('utf8'));

  // обязательно подтверждаем приём: 200 OK
  res.status(200).end('OK');

  // проверяем, что платёж успешно подтверждён
  if (data.Success && data.Status === 'CONFIRMED') {
    const orderId = data.OrderId || '';

    // вызываем PHP-скрипт, который перенесёт файл
    try {
      await fetch('http://tc-soft.ru/TC2019/Pay/move-order.php', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ orderId })
      });
      console.log(`move-order.php called for ${orderId}`);
    } catch (e) {
      console.error('move-order request failed:', e);
    }
  }
}
