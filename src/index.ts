import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import session from 'express-session';
import { upload } from './middleware/upload';
import { uploadFile, listFiles, fileDetailsRoute, deleteFile } from './controllers/fileController';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session middleware
app.use(
    session({
        secret: process.env.SECRET_KEY!,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 },
    })
);

// Set view engine and static files directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Admin validation middleware
function adminValidation(req: any, res: any, next: any) {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
        req.session.isAdmin = true; // Mark user as authenticated
        next();
    } else {
        res.status(403).send('Access denied. Invalid credentials.');
    }
}

// Middleware to protect routes
function isAuthenticated(req: any, res: any, next: any) {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/'); // Redirect to login if not authenticated
    }
}

// Login route
app.get('/', (req, res) => res.render('login'));

// Login post route
app.post('/', adminValidation, (req, res) => {
    res.redirect('/upload'); // Redirect to upload page after login
});

// Protected route for upload page
app.get('/upload', isAuthenticated, (req, res) => {
    res.render('upload');
});

// File upload and other routes
app.post('/uploadFile', isAuthenticated, upload.single('file'), uploadFile);
app.get('/files', isAuthenticated, listFiles);
app.get('/files/:filename', isAuthenticated, fileDetailsRoute);
app.delete('/files/:filename', isAuthenticated, deleteFile);

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/'); // Redirect to login after logout
    });
});

app.use((req, res) => {
    res.status(404).render('404', { message: 'Sorry, the page you are looking for does not exist.' });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
