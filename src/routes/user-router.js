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

/**
 * @apiDefine all No authentication needed.
 */
/**
 * @apiDefine token Logged in user access only
 * Valid authentication token must be provided within request.
 */
/**
 * @apiDefine BadRequestError
 * @apiError BadRequest Validation failed or bad input data.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 * "error": {
 * "message": "Validation failed",
 * "status": 400,
 * "errors": [{...}]
 * }
 * }
 */
/**
 * @apiDefine NotFoundError
 * @apiError NotFound The requested resource was not found.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 * "error": {
 * "message": "Not Found - /api/users/999",
 * "status": 404
 * }
 * }
 */

/**
 * @api {get} /users Get all users
 * @apiName GetUsers
 * @apiGroup User
 * @apiPermission all
 *
 * @apiDescription Retrieves a list of all users.
 *
 * @apiSuccess {Object[]} users List of user objects.
 * @apiSuccess {Number} users.user_id ID of the User.
 * @apiSuccess {String} users.username Username.
 * @apiSuccess {String} users.email Email address.
 */

/**
 * @api {post} /users Register new user
 * @apiName PostUser
 * @apiGroup User
 * @apiPermission all
 *
 * @apiDescription Registers a new user with a hashed password.
 *
 * @apiBody {String} username Username (3-20 chars).
 * @apiBody {String} password Password (min 8 chars).
 * @apiBody {String} email Email.
 *
 * @apiSuccess {String} message New user added.
 * @apiSuccess {Number} user_id ID of the created user.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 * "message": "New user added",
 * "user_id": 1
 * }
 *
 * @apiUse BadRequestError
 */
userRouter
  .route('/')
  .get(getUsers) // <--- ИСПРАВЛЕНИЕ: Добавлен GET маршрут для /api/users
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

/**
 * @api {get} /users/:id Get user by ID
 * @apiName GetUserById
 * @apiGroup User
 * @apiPermission all
 *
 * @apiDescription Retrieves user information by their unique ID.
 *
 * @apiParam {Number} id User unique ID.
 *
 * @apiSuccess {Number} user_id ID of the User.
 * @apiSuccess {String} username Username.
 * @apiSuccess {String} email Email address.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "user_id": 1,
 * "username": "tester",
 * "email": "test@example.com"
 * }
 *
 * @apiUse NotFoundError
 */

/**
 * @api {put} /users/:id Update user
 * @apiName PutUser
 * @apiGroup User
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiDescription Updates the profile of the authenticated user. Only the owner can update their profile.
 *
 * @apiParam {Number} id User unique ID.
 * @apiBody {String} [username] New username.
 * @apiBody {String} [email] New email address.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "message": "User 1 updated successfully."
 * }
 *
 * @apiError Forbidden User ID mismatch or invalid token.
 * @apiUse NotFoundError
 */

/**
 * @api {delete} /users/:id Delete user
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiDescription Deletes the profile of the authenticated user. Only the owner can delete their profile.
 *
 * @apiParam {Number} id User unique ID.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "message": "User 1 deleted successfully."
 * }
 *
 * @apiError Forbidden User ID mismatch or invalid token.
 * @apiUse NotFoundError
 */
userRouter
  .route('/:id')
  .get(getUserById) // GET /api/users/:id
  .put(authenticateToken, putUser) // PUT /api/users/:id (update user - Требуется токен)
  .delete(authenticateToken, deleteUser); // DELETE /api/users/:id (удаление - Требуется токен)


export default userRouter;