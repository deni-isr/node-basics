// Mockdata
const mediaItems = [
  {
    media_id: 9632,
    filename: 'ffd8.jpg',
    filesize: 887574,
    title: 'Favorite drink',
    description: '',
    user_id: 1606,
    media_type: 'image/jpeg',
    created_at: '2023-10-16T19:00:09.000Z',
  },
  {
    media_id: 9626,
    filename: 'dbbd.jpg',
    filesize: 60703,
    title: 'Miika',
    description: 'My Photo',
    user_id: 3671,
    media_type: 'image/jpeg',
    created_at: '2023-10-13T12:14:26.000Z',
  },
  {
    media_id: 9625,
    filename: '2f9b.jpg',
    filesize: 30635,
    title: 'Aksux',
    description: 'friends',
    user_id: 260,
    media_type: 'image/jpeg',
    created_at: '2023-10-12T20:03:08.000Z',
  },
  {
    media_id: 9592,
    filename: 'f504.jpg',
    filesize: 48975,
    title: 'Desert',
    description: '',
    user_id: 3609,
    media_type: 'image/jpeg',
    created_at: '2023-10-12T06:59:05.000Z',
  },
  {
    media_id: 9590,
    filename: '60ac.jpg',
    filesize: 23829,
    title: 'Basement',
    description: 'Light setup in basement',
    user_id: 305,
    media_type: 'image/jpeg',
    created_at: '2023-10-12T06:56:41.000Z',
  },
];

const getMediaByID = (req, res) => {
  //console.log('req id', req.params.id);
  const item = mediaItems.find(
    (item) => item.media_id === parseInt(req.params.id),
  );
  //console.log('item found:', item);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({message: 'media not found'});
  }
};

const getAllMedia = (req, res) => {
  res.json(mediaItems);
};

const postNewMediaItem = (req, res) => {
  const data = req.body;
  //console.log('post data', data)
  data.media_id = mediaItems[mediaItems.length - 1].media_id + 1;
  mediaItems.push(data);
  res.status(201).json({message: 'New item created', item: data});
};

/**
 * Deletes media item from the mockdata based on value of id
 * 
 * @param {Object} req http request
 * @param {Object} res http response
 */
const deleteMediaByID = (req, res) => {
  const itemToBeDeletedIndex = mediaItems.findIndex(
    (item) => item.media_id === parseInt(req.params.id),
  );
  if (itemToBeDeletedIndex != -1) {
    mediaItems.splice(itemToBeDeletedIndex, 1);
    res.status(200).json({message: 'item deleted'});
  } else {
    res.status(404).json({message: 'media item not found'});
  }
};

export {getAllMedia, getMediaByID, postNewMediaItem, deleteMediaByID};