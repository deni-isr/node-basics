import http from 'http';
const hostname = '127.0.0.1';
const port = 3000;

const items = [
  {id: 1, name: 'Mrcedes'},
  {id: 2, name: 'Ford'},
];

const server = http.createServer((req, res) => {
  console.log(`HTTP request: ${req.method} ${req.url}`);

  // GET all items
  if (req.method === 'GET' && req.url === '/items') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(items));

  // GET item by id
  } else if (req.method === 'GET' && req.url.split('/')[1] === 'items') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    const requestedID = parseInt(req.url.split('/')[2]);
    const foundItem = items.find(item => item.id === requestedID);
    if (!foundItem) {
      res.statusCode = 404;
      res.end(JSON.stringify({error: 'Item not found'}));
    } else {
      res.end(JSON.stringify(foundItem));
    }

  // POST new item
  } else if (req.method === 'POST' && req.url === '/items') {
    let body = [];
    req
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // at this point, `body` has the entire request body stored in it as a string
        console.log('req body', body);
        const newItem = JSON.parse(body);
        // check latest id and add 1
        newItem.id = items[items.length-1].id + 1;
        items.push(newItem);
        res.statusCode = 201;
        res.end();
      });

  // DELETE item by id
  } else if (req.method === 'DELETE' && req.url.split('/')[1] === 'items') {
    const id = parseInt(req.url.split('/')[2]);
    const index = items.findIndex(x => x.id === id);
    res.writeHead(200, {'Content-Type': 'application/json'});
    if (Number.isNaN(id)) {
      res.statusCode = 400;
      res.end(JSON.stringify({error: 'Invalid id'}));
    } else if (index === -1) {
      res.statusCode = 404;
      res.end(JSON.stringify({error: 'Item not found'}));
    } else {
      const removed = items.splice(index, 1)[0];
      res.end(JSON.stringify({message: 'deleted', item: removed}));
    }

  // PUT update item name by id
  } else if ((req.method === 'PUT' || req.method === 'PATCH') && req.url.split('/')[1] === 'items') {
    const id = parseInt(req.url.split('/')[2]);
    let body = [];
    req
      .on('data', chunk => body.push(chunk))
      .on('end', () => {
        body = Buffer.concat(body).toString();
        let data;
        try {
          data = JSON.parse(body);
        } catch (e) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({error: 'Bad JSON'}));
          return;
        }
        const item = items.find(x => x.id === id);
        res.setHeader('Content-Type', 'application/json');
        if (Number.isNaN(id)) {
          res.statusCode = 400;
          res.end(JSON.stringify({error: 'Invalid id'}));
        } else if (!item) {
          res.statusCode = 404;
          res.end(JSON.stringify({error: 'Item not found'}));
        } else if (!data || typeof data.name !== 'string' || data.name.trim() === '') {
          res.statusCode = 400;
          res.end(JSON.stringify({error: 'Missing or invalid "name"'}));
        } else {
          item.name = data.name;
          res.statusCode = 200;
          res.end(JSON.stringify(item));
        }
      });

  // GET some generated data
  } else if (req.method === 'GET' && req.url === '/random') {
    const value = Math.floor(Math.random() * 1000);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({random: value}));

  // POST generate uppercase from sent text
  } else if (req.method === 'POST' && req.url === '/uppercase') {
    let body = [];
    req
      .on('data', chunk => body.push(chunk))
      .on('end', () => {
        body = Buffer.concat(body).toString();
        let data;
        try {
          data = JSON.parse(body);
        } catch (e) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({error: 'Bad JSON'}));
          return;
        }
        if (!data || typeof data.text !== 'string') {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({error: 'Missing "text"'}));
          return;
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({uppercase: data.text.toUpperCase()}));
      });

  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});