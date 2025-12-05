import express from 'express';
import {login} from '../controllers/auth-controller.js';
import {authenticateToken} from '../middlewares/authenticate.js';
import {getMe} from '../controllers/user-controller.js';

const authRouter = express.Router();

/**
 * @apiDefine all No authentication needed.
 */
/**
 * @apiDefine token Logged in user access only
 * Valid authentication token must be provided within request.
 */
/**
 * @apiDefine UnauthorizedError
 * @apiError UnauthorizedError User name or password invalid.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 * "message": "Invalid username or password"
 * }
 */

/**
 * @api {post} /auth/login Login
 * @apiName PostLogin
 * @apiGroup Authentication
 * @apiPermission all
 *
 * @apiDescription Sign in and get an authentication token for the user.
 *
 * @apiBody {String} username Username of the user.
 * @apiBody {String} password Password of the user.
 *
 * @apiSuccess {String} token Token for the user authentication.
 * @apiSuccess {Object} user User info.
 *
 * @apiUse UnauthorizedError
 */
authRouter.route('/login').post(login);

/**
 * @api {get} /auth/me Request information about current user
 * @apiName GetMe
 * @apiGroup Authentication
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiDescription Get the profile information of the currently authenticated user.
 *
 * @apiSuccess {Object} user User info.
 * @apiSuccess {Number} user.user_id Id of the User.
 * @apiSuccess {String} user.username Username of the User.
 * @apiSuccess {String} user.email email of the User.
 * @apiSuccess {Number} user.user_level_id User level id of the User.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "user_id": 21,
 * "username": "johnd",
 * "email": "johnd@example.com",
 * "user_level_id": 2
 * }
 *
 * @apiError InvalidToken Authentication token was invalid.
 *
 * @apiErrorExample Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 * "message": "invalid token"
 * }
 */
authRouter.route('/me').get(authenticateToken, getMe);

export default authRouter;