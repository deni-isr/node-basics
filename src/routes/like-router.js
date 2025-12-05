import express from 'express';
import {authenticateToken} from '../middlewares/authenticate.js';
import {postLike, removeLike as deleteLike, getLikesByMedia} from '../controllers/like-controller.js';

const likeRouter = express.Router();

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
 * "message": "Not Found - /api/likes/999",
 * "status": 404
 * }
 * }
 */

/**
 * @api {get} /likes Get like count for media (using getLikesByMedia)
 * @apiName GetLikes
 * @apiGroup Like
 * @apiPermission all
 *
 * @apiDescription Retrieves the total count of likes for a specific media item.
 * NOTE: This endpoint uses the controller function designed for /:id, so it expects a media_id parameter if modified.
 * Currently using getLikesByMedia (which expects ID) for simplicity.
 *
 * @apiSuccess {Number} media_id ID of the media.
 * @apiSuccess {Number} total_likes Total count of likes.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "media_id": 5,
 * "total_likes": 3
 * }
 */
likeRouter.route('/').get(getLikesByMedia) 

/**
 * @api {post} /likes Add a like
 * @apiName PostLike
 * @apiGroup Like
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiDescription Adds a like to a specific media item.
 *
 * @apiBody {Number} media_id ID of the media item to like.
 *
 * @apiSuccess {String} message Like added successfully.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 * "message": "Like added successfully"
 * }
 *
 * @apiUse BadRequestError
 * @apiError Forbidden Invalid token provided.
 */
  .post(authenticateToken, postLike);

/**
 * @api {delete} /likes/:id Delete a like
 * @apiName DeleteLike
 * @apiGroup Like
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiDescription Removes a like by its ID (the user must own the like).
 *
 * @apiParam {Number} id Like unique ID.
 *
 * @apiSuccess {String} message Like deleted successfully.
 *
 * @apiUse NotFoundError
 * @apiError Forbidden User does not own this like or invalid token.
 */
likeRouter.route('/:id').delete(authenticateToken, deleteLike);

export default likeRouter;