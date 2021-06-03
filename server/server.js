const WebSocket = require('ws');
const fs =  require('fs');

const wss = new WebSocket.Server({port: 5501});

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
        sendMessageTo(  
          { type: 'USERS',
          data: [...connections.values()].map((item) =>  item.login).filter(Boolean)}, 
          ws)
        sendMessageFrom(connections, request, ws, excludeItself);
        break;
        default: 
        console.log('unknown event');
        break;
    }
  });

  ws.on('close', () => {
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

  for (const connection of connections.keys()) {
    if (connection === from && excludeSelf) {
      continue;
    }

    connection.send(JSON.stringify(message));
  }
}

