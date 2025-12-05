import express from 'express';

import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import 'dotenv/config';
import mediaRouter from './routes/media-router.js';
import userRouter from './routes/user-router.js';
import likeRouter from './routes/like-router.js';
import authRouter from './routes/auth-router.js';
import {notFoundHandler, errorHandler} from './middlewares/error-handlers.js';

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const app = express();

app.use(helmet.contentSecurityPolicy({
  directives: {
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"], 
    'default-src': ["'self'"],
  },
}));

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // Max 100 requests per IP
  message: { message: "Too many requests, please try again later" }
});
app.use(limiter);

// parse json from request bodies
app.use(express.json());
// Serve static files ('public' folder -> http server root)
app.use('/', express.static('public'));
app.use('/uploads', express.static('uploads'));

// Api endpoints
app.use('/api/media', mediaRouter);
// Users endpoints
app.use('/api/users', userRouter);
// Likes endpoints
app.use('/api/likes', likeRouter);
// Auth endpoints
app.use('/api/auth', authRouter);

// Serve API documentation
app.use('/docs', express.static('docs'));

// Use the 404 not found middleware
app.use(notFoundHandler);
// Use the error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});