const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const port = 5151;
const server = http.createServer(async (req, res) => {res.end('ok')});
const wss = new WebSocket.Server({server});
const connections = new Map();

wss.on('connection', (ws) => {
connections.set(ws, {});

  ws.on('message', (wsd) => {
    const request = JSON.parse(wsd);
    let excludeItself = false;

    switch (request.type) {
      case 'LOGIN':
        excludeItself = true;
        connections.get(ws).login = request.data.name;
        const loadedPhotos = getCurrentPhotos();
        sendMessageTo(  
          { type: 'USERS',
          data: [...connections.values()].map((item) =>  item.login).filter(Boolean).reverse(),
          photos: loadedPhotos
          }, 
          ws)
        sendMessageFrom(connections, request, ws, excludeItself);
        break;
      case 'MESSAGE':
        excludeItself = false;
        let messageResponse = request;
        if (connections.get(ws).photo) {
          messageResponse.photo = connections.get(ws).photo;
        }
        sendMessageFrom(connections, messageResponse, ws, excludeItself);
        break;
      case 'PHOTO': 
        excludeItself = false;
        for (let item of connections.values()) {
          if (item.login === request.data.name) {
            item.photo = request.data.photo;
          }
          sendMessageFrom(connections, request, ws, excludeItself);
        }
        break;
        default: 
        console.log('unknown event');
        break;
    }
  });

  ws.on('close', () => {
    excludeItself = true;
    sendMessageFrom(connections, {type: 'CLOSE'}, ws, excludeItself);
    connections.delete(ws);
  })
})

function sendMessageTo(message, to) {
  to.send(JSON.stringify(message));
}

 function sendMessageFrom(connections, message, from, excludeSelf) {
  const socketData = connections.get(from);

  if (!socketData) {
    return;
  }

  message.from = socketData.login;

  for (const connection of connections.keys()) {
    if (connection === from && excludeSelf) {
      continue;
    }
    connection.send(JSON.stringify(message));
    getCurrentPhotos();
  }
}

function getCurrentPhotos() {
  const obj = {};
  for (let item of connections.values()) {
    if (item.photo) {
      let name = item.login;
      obj[`${name}`] = item.photo;
    }
  }
  return obj;
}

server.listen(port);
