import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { upload } from './middleware/upload';
import { uploadFile, listFiles } from './controllers/fileController';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('upload'));
app.post('/upload', upload.single('file'), uploadFile);
app.get('/files', listFiles);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
