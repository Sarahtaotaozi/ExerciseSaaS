import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import visionRoutes from './routes/vision';
import geminiRoutes from './routes/gemini';
import databaseRoutes from './routes/database';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();


app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true }));
app.use(express.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));


const upload = multer({ dest: 'uploads/' });


const visionClient = new ImageAnnotatorClient();


const clientPath = path.join(__dirname, 'client-dist');
app.use(express.static(clientPath));


app.post('/vision/analyze-html', upload.single('image'), async (req, res) => {
    if (!req.file) return res.send('No file uploaded.');

    try {
        const [result] = await visionClient.labelDetection(req.file.path);
        const labels = result.labelAnnotations || [];

        const html = `
            <h1>✅ Image Analysis Result </h1>
            <img src="data:image/jpeg;base64,${fs.readFileSync(req.file.path, 'base64')}" style="max-width:300px;" /><br>
            <h3>Detected Labels:</h3>
            <ul>
                ${labels.map(l => `<li><b>${l.description}</b> - ${Math.round((l.score || 0) * 100)}%</li>`).join('')}
            </ul>
            <a href="/">Analyze another</a>
        `;
        res.send(html);
    } catch (err: any) {
        res.send(`Error: ${err.message}`);
    } finally {
        fs.unlinkSync(req.file.path);
    }
});


app.use('/vision', visionRoutes);
app.use('/gemini', geminiRoutes);
app.use('/database', databaseRoutes);


app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
