import clientPromise from '../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email and Scholarship ID are required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('scholarships');
    const collection = db.collection('results'); 

    const result = await collection.findOne({ email });
    console.log(result);
    if (result) {
      res.status(200).json({
        status: 'success',
        data: {
          email,
          isSelected: result.isSelected,},
      });
    } else {
      res.status(404).json({ status: 'error', message: 'No record found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
}
