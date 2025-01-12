export default function handler(req, res) {
    if (req.method === 'POST') {
      res.setHeader('Set-Cookie', 'authToken=; HttpOnly; Path=/; Max-Age=0');
      return res.status(200).end();
    }
    res.status(405).end(); // Method not allowed
  }
  