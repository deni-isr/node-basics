import express from 'express';
import {authenticateToken} from '../middlewares/authenticate.js';
import {body} from 'express-validator';
import {validationErrors} from '../middlewares/error-handlers.js';
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

userRouter
  .route('/')
  .post(
    body('email').trim().isEmail().withMessage('must be a valid email'),
    body('username')
      .trim()
      .isLength({min: 3, max: 20})
      .withMessage('must be 3-20 characters long')
      .isAlphanumeric()
      .withMessage('must contain only letters and numbers'),
    body('password').trim().isLength({min: 8}).withMessage('must be min. 8 characters'),
    
    validationErrors, 
    
    postUser
  );
export default userRouter;