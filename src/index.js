import http from 'http';
import {parse as parseUrl} from 'url';

let items = [
  {id: 1, name: 'Item1'},
  {id: 2, name: 'Item2'},
];
let nextId = 3;

const sendJSON = (res, status, data) => {
  const body = JSON.stringify(data);
  res.writeHead(status, {'Content-Type': 'application/json'});
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });

const server = http.createServer(async (req, res) => {
  const {pathname} = parseUrl(req.url, true);
  const method = req.method;

  if (pathname === '/' && method === 'GET') {
    return sendJSON(res, 200, {message: 'Welcome to my REST API!'});
  }

  if (pathname === '/items' && method === 'GET') {
    return sendJSON(res, 200, items);
  }

  if (pathname === '/items' && method === 'POST') {
    try {
      const body = await readBody(req);
      if (!body.name) return sendJSON(res, 400, {error: 'Missing name'});
      const newItem = {id: nextId++, name: body.name};
      items.push(newItem);
      return sendJSON(res, 201, newItem);
    } catch {
      return sendJSON(res, 400, {error: 'Invalid JSON'});
    }
  }

  const match = pathname.match(/^\/items\/(\d+)$/);
  if (match && method === 'GET') {
    const id = Number(match[1]);
    const item = items.find((i) => i.id === id);
    if (!item) return sendJSON(res, 404, {error: 'Not Found'});
    return sendJSON(res, 200, item);
  }

  if (match && method === 'PUT') {
    const id = Number(match[1]);
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return sendJSON(res, 404, {error: 'Not Found'});

    try {
      const body = await readBody(req);
      if (!body.name) return sendJSON(res, 400, {error: 'Missing name'});
      items[index].name = body.name;
      return sendJSON(res, 200, items[index]);
    } catch {
      return sendJSON(res, 400, {error: 'Invalid JSON'});
    }
  }

  if (match && method === 'DELETE') {
    const id = Number(match[1]);
    const exists = items.some((i) => i.id === id);
    if (!exists) return sendJSON(res, 404, {error: 'Not Found'});
    items = items.filter((i) => i.id !== id);
    res.writeHead(204);
    return res.end();
  }

  return sendJSON(res, 404, {error: 'Resource not found'});
});

const hostname = '127.0.0.1';
const port = 3000;
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
