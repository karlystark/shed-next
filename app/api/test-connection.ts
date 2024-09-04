import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    res.status(200).json({ message: 'Successfully connected to MongoDB!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to MongoDB', details: error.message });
  }
}
