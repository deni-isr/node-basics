import express from 'express';
import {body} from 'express-validator';
import {authenticateToken} from '../middlewares/authenticate.js';
import {validationErrors} from '../middlewares/error-handlers.js';
import upload from '../middlewares/upload.js';
import {
  deleteMedia,
  getMedia,
  getMediaById,
  postMedia,
  putMedia,
} from '../controllers/media-controller.js';

// All media endpoints handled with express router
const mediaRouter = express.Router();

mediaRouter
  .route('/')
  // Get all media items
  .get(getMedia)
  .post(
    authenticateToken,
    upload.single('file'),
    
    body('title').trim().isLength({min: 3, max: 50}).withMessage('Title must be 3-50 chars'),
    body('description').trim().optional().isLength({max: 255}).withMessage('Description max 255 chars'),
    
    validationErrors,
    postMedia
  );

mediaRouter
  .route('/:id')
  // get media by id
  .get(getMediaById)
  // update media
  .put(putMedia)
  // delete media
  .delete(deleteMedia);

export default mediaRouter;