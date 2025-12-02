import express from 'express';
import multer from 'multer';
import {
  deleteMedia,
  getMedia,
  getMediaById,
  postMedia,
  putMedia,
} from '../controllers/media-controller.js';

// All media endpoints handled with express router
const mediaRouter = express.Router();
const upload = multer({dest: process.env.UPLOADS_PATH});


mediaRouter
  .route('/')
  // Get all media items
  .get(getMedia)
  // post new media item
  .post(upload.single('file'), postMedia);

mediaRouter
  .route('/:id')
  // get media by id
  .get(getMediaById)
  // update media
  .put(putMedia)
  // delete media
  .delete(deleteMedia);

export default mediaRouter;