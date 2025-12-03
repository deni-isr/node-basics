import express from 'express';
import {authenticateToken} from '../middlewares/authenticate.js';
import {
  deleteUser,
  getUserById,
  getUsers,
  postUser,
  putUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter
  .route('/:id')
  .put(authenticateToken, putUser) // PUT /api/users/:id (update user)
  .get(getUserById) // GET /api/users/:id
  .put(putUser) // PUT /api/users/:id (update user)
  .delete(deleteUser); // DELETE /api/users/:id

export default userRouter;