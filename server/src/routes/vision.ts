import express, { Request, Response } from 'express';
import multer from 'multer';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import os from 'os'; // ✅

dotenv.config();

const vision = new ImageAnnotatorClient();
const upload = multer({ dest: os.tmpdir() });
const router = express.Router();

router.post('/analyze', upload.single('image'), async (req: Request & { file?: Express.Multer.File }, res: Response) => {
    try {
        let imagePath: string | null = null;

        if (req.file) {
            imagePath = req.file.path;
            console.log(`✅ Uploaded file: ${imagePath}`);
        } else if (req.body.imageUrl) {
            const imageUrl = req.body.imageUrl;
            console.log(`🔍 Downloading image from: ${imageUrl}`);

            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const tempFilePath = path.join(os.tmpdir(), 'temp-image.jpg');
            fs.writeFileSync(tempFilePath, Buffer.from(response.data, 'binary'));
            imagePath = tempFilePath;
        } else {
            return res.status(400).json({ error: "❌ No image provided. Upload a file or provide an image URL." });
        }

        const [result] = await vision.labelDetection(imagePath);
        const labels = result.labelAnnotations?.map(label => ({
            description: label.description,
            score: Math.round((label.score || 0) * 1000) / 10
        })) || [];


        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        if (labels.length === 0) {
            return res.status(400).json({ error: "⚠️ No labels detected. Try another image." });
        }

        console.log("✅ Labels:", labels);
        res.json({ labels });

    } catch (error: any) {
        console.error("❌ Vision API Error:", error);
        res.status(500).json({ error: error.message || 'Unknown error' });
    }
});

export default router;
