import express from 'express';
import {
  deleteMediaByID,
  getAllMedia,
  getMediaByID,
  postNewMediaItem,
} from './media.js';
import {
  getAllUsers,
  getUserByID,
  postNewUser,
  putUserByID,
  deleteUserByID,
} from './users.js';

const hostname = '127.0.0.1';
const app = express();
const port = 3000;

const items = [
  {id: 2, name: 'eka'},
  {id: 11, name: 'toka juttu'},
];

// Config for Pug template engine
app.set('views', './views');
app.set('view engine', 'pug');

// parse json from request bodies
app.use(express.json());

// Serve pug template (server root)
app.get('/', (req, res) => {
  // Dynamic content for the home page
  const pageContent = {
    title: 'My Simple API',
    apiInfo: 'Welcome',
    // Pass a list of endpoints to Pug for information
    endpoints: [
      {method: 'GET', path: '/api/media'},
      {method: 'GET', path: '/api/media/:id'},
      {method: 'POST', path: '/api/media'},
      {method: 'DELETE', path: '/api/media/:id'},
      {method: 'GET', path: '/api/users'},
      {method: 'GET', path: '/api/users/:id'},
      {method: 'POST', path: '/api/users'},
      {method: 'PUT', path: '/api/users/:id'},
      {method: 'DELETE', path: '/api/users/:id'},
    ],
  };
  // Render 'index.pug' and pass it the pageContent object
  res.render('index', pageContent);
});

// Serve static files from /media
app.use('/media', express.static('media'));

// Get all media items
app.get('/api/media', getAllMedia);
// get media by id
app.get('/api/media/:id', getMediaByID);
// post new media item
app.post('/api/media', postNewMediaItem);
// delete media
app.delete('/api/media/:id', deleteMediaByID);

// Users endpoints
// Users endpoints
app.get('/api/users', getAllUsers);
app.get('/api/users/:id', getUserByID);
app.post('/api/users', postNewUser);
app.put('/api/users/:id', putUserByID);
app.delete('/api/users/:id', deleteUserByID);

// Endpoints for /items API
app.get('/api/items', (req, res) => {
  res.json(items);
});
app.get('/api/items/:id', (req, res) => {
  // find item by numeric id and return it (or 404 if not found)
  const id = parseInt(req.params.id);
  const item = items.find((it) => it.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({message: 'item not found'});
  }
});
app.delete('/api/items/:id', (req, res) => {
  // delete item by id
  const id = parseInt(req.params.id);
  const idx = items.findIndex((it) => it.id === id);
  if (idx !== -1) {
    items.splice(idx, 1);
    res.status(200).json({message: 'item deleted'});
  } else {
    res.status(404).json({message: 'item not found'});
  }
});
app.post('/api/items', (req, res) => {
  // add new item to items[] and return created item
  const data = req.body;
  if (!data || typeof data.name !== 'string' || data.name.trim() === '') {
    return res.status(400).json({message: 'Invalid item data, "name" is required'});
  }

  // compute new id (max existing id + 1)
  const maxId = items.reduce((m, it) => (it.id > m ? it.id : m), 0);
  const newItem = {id: maxId + 1, name: data.name};
  items.push(newItem);
  res.status(201).json({message: 'New item created', item: newItem});
});
app.put('/api/items/:id', (req, res) => {
  // modify existing item by id
  const id = parseInt(req.params.id);
  const idx = items.findIndex((it) => it.id === id);
  if (idx === -1) {
    return res.status(404).json({message: 'item not found'});
  }
  const data = req.body;
  if (!data || typeof data.name !== 'string' || data.name.trim() === '') {
    return res.status(400).json({message: 'Invalid item data, "name" is required'});
  }
  items[idx].name = data.name;
  res.status(200).json({message: 'item updated', item: items[idx]});
});

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});