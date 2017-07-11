const WebSocket = require('ws');
const httpServer = require('http').Server;
const url = require('url');


function heartbeat() {
  this.isAlive = true;
}


class ChatWsServer
{
  constructor(chatModel, listen, path)
  {
    this.chat = chatModel;
    const config = {
      verifyClient: this.validateClient.bind(this)
    };
    if (typeof path !== 'undefined') {
      config.path = path;
    }

    if (listen instanceof httpServer) {
      config.server = listen;
    } else {
      config.port = listen;
    }
    const wss = this.wss = new WebSocket.Server(config, function(){
      console.log("WebSocket Server started at " + config.port);
    });

    wss.on('connection', this.connection.bind(this));

    const interval = setInterval(function ping() {
      wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
          console.log("Terminate connection on timeout");
          return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping('', false, true);
      });
    }, 30000);

  }

  connection(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('close', (code, reason) => {
      console.log("WebSocket Closed", code, reason);
    });
    ws.on('error', (err) => {
      console.log("WebSocket Error", err);
    });
    ws.on('unexpected-response', () => {
      console.log("WebSocket unexpected-response");
    });
  }

  validateClient(info, cb) {
    const urlInfo = url.parse(info.req.url);
    const checkProm = this.chat.checkClientExists(urlInfo.pathname);
    checkProm.then((checkResult) => {
      console.log("Check client", checkResult);
      cb(true);
    }).catch((err) => {
      console.log("Error on check client", err);
      cb(false);
    });

  }
}


module.exports = ChatWsServer;