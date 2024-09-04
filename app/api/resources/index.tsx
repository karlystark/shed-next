import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongoose';
import Resource from '../../../models/Resource';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    await connectToDatabase();

    if(req.method === 'GET'){
        try{
            const resources = await Resource.find({});
            res.status(200).json(resources);
        } catch(err){
            res.status(500).json({err: "Error fetching resources"});
        }
    } else if (req.method === 'POST'){
        try {
            const { name, quantity, description, image } = req.body;
            const resource = new Resource({name, quantity, description, image});
            await resource.save();
            res.status(201).json(resource);
        } catch(err){
            res.status(400).json({err: err.message});
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}