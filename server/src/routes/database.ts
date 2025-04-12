import express, { Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';

const router = express.Router();
const db = new Firestore();
const collection = db.collection('art_insights');

// store the analysis result to Firestore
router.post('/save', async (req: Request, res: Response) => {
    try {
        const { userId, imageUrl, labels, story } = req.body;
        await collection.add({ userId, imageUrl, labels, story });
        res.json({ message: 'Analysis saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

// get the user's analysis result
router.get('/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const snapshot = await collection.where('userId', '==', userId).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No records found' });
        }

        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

export default router;
