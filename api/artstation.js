// Vercel Serverless Function — проксирует ArtStation API
// Деплоится автоматически как /api/artstation?type=projects или ?type=user

export default async function handler(req, res) {
  // CORS — разрешаем запросы с любого домена (в т.ч. твой сайт)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // кэш 5 минут

  const username = 'lezzold';
  const type = req.query.type || 'projects';

  const urls = {
    projects: `https://www.artstation.com/users/${username}/projects.json?page=1&per_page=20`,
    user:     `https://www.artstation.com/users/${username}.json`,
  };

  const url = urls[type];
  if (!url) {
    return res.status(400).json({ error: 'unknown type' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        // Притворяемся обычным браузером — ArtStation не блокирует такие запросы
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.artstation.com/',
        'Origin': 'https://www.artstation.com',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `ArtStation returned ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
