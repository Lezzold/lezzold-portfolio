// Vercel serverless function — отправляет сообщение в Telegram
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const BOT_TOKEN = '6098150595:AAEKcdXuizmjORZk1HKtvBoX663bmEc_h8g';
  const CHAT_ID   = '633098667';

  try {
    const { name, message, contact } = req.body || {};
    if (!message?.trim()) return res.status(400).json({ error: 'Empty message' });

    const text = [
      '📬 *Новое сообщение с портфолио*',
      '',
      `👤 *Имя:* ${name || 'не указано'}`,
      `📧 *Контакт:* ${contact || 'не указан'}`,
      '',
      `💬 *Сообщение:*`,
      message.trim(),
      '',
      `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Kiev' })}`,
    ].join('\n');

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    });

    const tgData = await tgRes.json();
    if (!tgData.ok) throw new Error(tgData.description);

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
