const ChatServer = require("./chat-server.js");
const httpServer = require("http").createServer();
const ChatModel = require('./chat-model.js');
const chat = new ChatModel(
  {
    "connectionLimit": 20,
    "host": "127.0.0.1",
    "user": "root",
    "password": "root",
    "database": "chat"
  }
);
const port = 3011;
const chatServer = new ChatServer(chat, httpServer);

httpServer.listen(port);
httpServer.on('listening', function(){
  console.log("Start HTTP server at " + port);
});


httpServer.on('request', function(req, res){
  res.setHeader('Content-Type', 'text/json;charset=utf-8');
  res.write("{}");
  res.end();
});




