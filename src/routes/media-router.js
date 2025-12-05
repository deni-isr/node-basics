import express from 'express';
import {getMedia, getMediaById, postMedia, putMedia, deleteMedia} from '../controllers/media-controller.js';
import {authenticateToken} from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const mediaRouter = express.Router();

/**
 * @apiDefine token Logged in user access only
 * Valid authentication token must be provided within request.
 */
/**
 * @apiDefine BadRequestError
 * @apiError BadRequest Validation failed, bad input data, or file type error.
 * @apiErrorExample FileType Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 * "error": {
 * "message": "Only images and videos are allowed!",
 * "status": 400
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
 * "message": "Not Found - /api/media/999",
 * "status": 404
 * }
 * }
 */
/**
 * @apiDefine ForbiddenError
 * @apiError Forbidden User does not own this media or invalid token.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 * "message": "User does not own this media"
 * }
 */

mediaRouter
  .route('/')
/**
 * @api {get} /media Get all media
 * @apiName GetMedia
 * @apiGroup Media
 * @apiPermission all
 *
 * @apiDescription Retrieves a list of all media items.
 *
 * @apiSuccess {Object[]} media List of media items.
 * @apiSuccess {Number} media.media_id Unique ID.
 * @apiSuccess {Number} media.user_id Owner's ID.
 * @apiSuccess {String} media.title Title of the media.
 * @apiSuccess {String} media.filename Filename on server.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 * {
 * "media_id": 1,
 * "user_id": 1,
 * "title": "Sunset view",
 * "filename": "sunset-12345.jpg"
 * }
 * ]
 */
  .get(getMedia)

/**
 * @api {post} /media Upload new media
 * @apiName PostMedia
 * @apiGroup Media
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiDescription Uploads a new media file (image/video) and stores its info.
 *
 * @apiBody {String} title Title of the media (3-50 chars).
 * @apiBody {String} [description] Optional description (max 255 chars).
 * @apiBody {File} file The media file to upload (in multipart/form-data).
 *
 * @apiSuccess {String} message Media upload successful.
 * @apiSuccess {Number} media_id ID of the created media.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 * "message": "Media upload successful",
 * "media_id": 10
 * }
 *
 * @apiUse BadRequestError
 * @apiUse ForbiddenError
 */
  .post(
    authenticateToken,
    upload.single('file'), // 'file' - имя поля для Multer
    // body('title').isLength({min: 3})... (если используется валидация)
    // validationErrors,
    postMedia
  );

mediaRouter
  .route('/:id')
/**
 * @api {get} /media/:id Get media by ID
 * @apiName GetMediaById
 * @apiGroup Media
 * @apiPermission all
 *
 * @apiDescription Retrieves a single media item by its unique ID.
 *
 * @apiParam {Number} id Media unique ID.
 *
 * @apiSuccess {Object} media Media item details.
 * @apiSuccess {String} media.title Title.
 * @apiSuccess {String} media.filename Filename.
 *
 * @apiUse NotFoundError
 */
  .get(getMediaById)

/**
 * @api {put} /media/:id Update media
 * @apiName PutMedia
 * @apiGroup Media
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiDescription Updates the title and description of a media item. User must be the owner.
 *
 * @apiParam {Number} id Media unique ID.
 * @apiBody {String} [title] New title.
 * @apiBody {String} [description] New description.
 *
 * @apiSuccess {String} message Media updated successfully.
 *
 * @apiUse NotFoundError
 * @apiUse ForbiddenError
 * @apiUse BadRequestError
 */
  .put(authenticateToken, putMedia)

/**
 * @api {delete} /media/:id Delete media
 * @apiName DeleteMedia
 * @apiGroup Media
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiDescription Deletes a media item and its corresponding file. User must be the owner.
 *
 * @apiParam {Number} id Media unique ID.
 *
 * @apiSuccess {String} message Media deleted successfully.
 *
 * @apiUse NotFoundError
 * @apiUse ForbiddenError
 */
  .delete(authenticateToken, deleteMedia);

export default mediaRouter;