import express from 'express';
import {
  deleteUser,
  getUserById,
  getUsers,
  postUser,
  putUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter
  .route('/')
  .get(getUsers) // GET /api/users
  .post(postUser); // POST /api/users (add new user)

userRouter
  .route('/:id')
  .get(getUserById) // GET /api/users/:id
  .put(putUser) // PUT /api/users/:id (update user)
  .delete(deleteUser); // DELETE /api/users/:id

export default userRouter;