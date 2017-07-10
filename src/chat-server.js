const WebSocket = require('ws');

class ChatWsServer
{
  constructor(httpServer, path)
  {
    console.log("Prepare WebSocket Server");
    const wss = new WebSocket.Server({server: httpServer, path: path}, function(){
      console.log("WebSocket Server started at ");
    });

    wss.on('connection', function wsConnect(socket, req){
      console.log(req);
      console.log("ws connection");
      socket.on('message', function incoming(message){
        console.log('received: %s', message);
      });
      socket.send('hello');
    });

  }
}


module.exports = ChatWsServer;