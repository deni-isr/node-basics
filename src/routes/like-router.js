import express from 'express';
import {
  getLikesByMedia,
  postLike,
  removeLike,
} from '../controllers/like-controller.js';

const likeRouter = express.Router();

likeRouter
  .route('/')
  .post(postLike);

likeRouter
  .route('/:id')
  .delete(removeLike);

likeRouter
  .route('/media/:id')
  .get(getLikesByMedia);

export default likeRouter;