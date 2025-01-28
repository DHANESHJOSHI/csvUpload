import cookie from 'cookie';

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Remove the authToken cookie by setting it with maxAge: -1 to expire immediately
    res.setHeader('Set-Cookie', 'authToken=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None');
    
    res.setHeader(
      'Set-Cookie',
      `authToken=; HttpOnly; Secure; SameSite=None; Max-Age=86400; Path=/;`
    );

    return res.status(200).json({ message: 'Logged out successfully' });
  }

  // Handle non-POST requests
  return res.status(405).json({ message: 'Method Not Allowed' });
}
