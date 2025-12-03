import express from 'express';
// read .env file
import 'dotenv/config';
import mediaRouter from './routes/media-router.js';
import userRouter from './routes/user-router.js';
import likeRouter from './routes/like-router.js';
import authRouter from './routes/auth-router.js';

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const app = express();

//console.log(process.env);

// parse json from request bodies
app.use(express.json());

// Serve static files ('public' folder -> http server root)
app.use('/', express.static('public'));
app.use('/uploads', express.static('uploads'));

// Api endpoints
app.use('/api/media', mediaRouter);

// Users endpoints
// TODO: add user router and use it
app.use('/api/users', userRouter);
// Likes endpoints
app.use('/api/likes', likeRouter);
// Auth endpoints
app.use('/api/auth', authRouter);

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});