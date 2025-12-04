import {
  addMedia,
  findMediaById,
  listAllMedia,
  updateMediaById,
  deleteMediaById,
} from '../models/media-model.js';

const getMedia = async (req, res) => {
  res.json(await listAllMedia());
};

const getMediaById = async (req, res) => {
  const media = await findMediaById(req.params.id);
  if (media) {
    // add full filepath url to media object
    media.filepath = `${req.protocol}://${req.headers.host}/${process.env.UPLOADS_PATH}/${media.filename}`;
    res.json(media);
  } else {    
    res.sendStatus(404);
  }
};

const postMedia = async (req, res, next) => {
  
  if (!req.file) {
    const error = new Error('File is missing or invalid.');
    error.status = 400; // 400 Bad Request
    return next(error); 
  }
  
  const {title, description} = req.body;
  const {filename, size, mimetype} = req.file;
  const user_id = req.user.user_id;

  try {
    // Media item data object
    const newMedia = {
      user_id,
      filename,
      size,
      mimetype,
      title,
      description: description || '', 
    };
    
    const result = await addMedia(newMedia);

    if (result.error) {
       const error = new Error(result.error);
       error.status = 500;
       return next(error);
    }
    
    res.status(201).json({message: 'New media item added.', ...result});
    
  } catch (e) {
    console.error('postMedia error', e.message);
    next(e); 
  }
};

const putMedia = async (req, res) => {
  const media_id = req.params.id;
  const {title, description} = req.body;

  if (!title || !description) {
    return res.status(400).json({message: 'Missing required fields (title, description)'});
  }

  const mediaData = {
    title,
    description,
    media_id,
  };

  const result = await updateMediaById(mediaData);
  
  if (result.error) {
    return res.status(500).json(result);
  }
  
  if (result) {
    res.json({message: `Media item ${media_id} updated successfully.`});
  } else {
    res.status(404).json({message: 'Media item not found or no changes made.'});
  }
};

const deleteMedia = async (req, res) => {
  const media_id = req.params.id;
  const result = await deleteMediaById(media_id);

  if (result.error) {
    return res.status(500).json(result);
  }

  if (result) {
    res.json({message: `Media item ${media_id} deleted successfully.`});
  } else {
    res.status(404).json({message: 'Media item not found.'});
  }
};

export {getMedia, getMediaById, postMedia, putMedia, deleteMedia};