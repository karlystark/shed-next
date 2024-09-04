import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongoose';
import Resource from '../../../models/Resource';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    await connectToDatabase();
    const { id } = req.query;

    try{
        if (req.method === 'GET'){
            // grab resource by ID
            const resource = await Resource.findById(id);

            if(!resource){
                res.status(404).json({message: "Resource not found."});
                return;
            }
            res.status(200).json(resource);
        } else if (req.method === 'PUT'){
            // grab updated resource from request
            const { name, quantity, description, image } = req.body;
            // find resource by id and update with updated resource
            const resource = await Resource.findByIdAndUpdate(id, { name, quantity, description, image }, { new: true });

            if(!resource){
                res.status(404).json({ message: "Resource not found"});
                return;
            }
            res.status(200).json(resource);
        } else if (req.method === 'DELETE'){
            // delete resource by ID
            const resource = await Resource.findByIdAndDelete(id);

            if(!resource){
                res.status(404).json({ message: "Resource not found"});
                return;
            }
            res.status(204).end();
        } else {
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (err) {
        res.status(500).json({ err: 'Internal Server Error'});
    }
}