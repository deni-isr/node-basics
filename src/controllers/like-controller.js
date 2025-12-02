import {addLike, countLikesByMediaId, deleteLike} from '../models/like-model.js';

const postLike = async (req, res) => {
  const {media_id, user_id} = req.body;
  if (!media_id || !user_id) {
    return res.status(400).json({message: 'Missing required fields: media_id and user_id'});
  }

  const result = await addLike(media_id, user_id);

  if (result.error) {
    return res.status(500).json(result);
  }
  
  if (result.message === 'Already liked') {
    return res.status(200).json({message: 'Media already liked by this user.', ...result});
  }

  res.status(201).json({message: 'Like added.', ...result});
};

const removeLike = async (req, res) => {
  const like_id = req.params.id;
  const result = await deleteLike(like_id);

  if (result.error) {
    return res.status(500).json(result);
  }

  if (result) {
    res.json({message: `Like ${like_id} deleted successfully.`});
  } else {
    res.status(404).json({message: 'Like not found.'});
  }
};

const getLikesByMedia = async (req, res) => {
  const media_id = req.params.id;
  
  if (!media_id) {
    return res.status(400).json({message: 'Missing media ID.'});
  }

  const count = await countLikesByMediaId(media_id);
  
  if (count.error) {
    return res.status(500).json(count);
  }

  res.json({media_id, total_likes: count});
};

export {postLike, removeLike, getLikesByMedia};