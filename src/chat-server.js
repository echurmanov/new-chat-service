const WebSocket = require('ws');
const httpServer = require('http').Server;
const url = require('url');
const Client = require('./models/client.js');
const ChatRoom = require('./models/chat-room.js');

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

  connection(ws, req) {
    ws.isAlive = true;
    ws._chatUser = req._chatUser;

    const chatRoomModel = new ChatRoom(this.chat.dbPool);
    chatRoomModel.getPublicClientRooms(ws._chatUser.serviceClientId).then((rooms)=>{
      console.log("Public chat rooms", rooms);
    }).catch((err) => {
      console.log("Error on get rooms", err);
    });

    chatRoomModel.getRoomsForClient(ws._chatUser).then((rooms)=>{
      console.log("All client rooms", rooms);
    }).catch((err) => {
      console.log("Error on get rooms", err);
    });


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

  async validateClient(info, cb) {
    const urlInfo = url.parse(info.req.url);
    const clientName = urlInfo.pathname.substr(1);
    const client = await this.chat.checkClientExists(clientName);
    if (client) {
      try {
        const chatUser = await this.chat.verifyChatUser(client, urlInfo.query);
        info.req._chatUser = chatUser;
        cb(true);
      } catch (err) {
        if (err.code == 1001) {
          console.log("Sign error");
        } else {
          console.log("Other error", err);
        }
        cb(false);
      }
      return;
    }
    cb(false);

  }
}


module.exports = ChatWsServer;