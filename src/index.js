const ChatServer = require("./chat-server.js");
const httpServer = require("http").createServer();
const port = 8081;
httpServer.listen(port);
httpServer.on('listening', function(){
  console.log("HTTP-Server start at port " + port);
  const chat = new ChatServer(httpServer, '/chat');
});

httpServer.on('request', function(req, res){
  console.log(req.url);
  console.log("HTTP-request");
  res.write(`<html>
    <head>

    </head>
    <body>
    <script>
        var ws = new WebSocket("ws://localhost:8081/chat");
        console.log(ws);
        ws.addEventListener('message', function(msg){
            console.log("<= ", msg);
        });
        ws.addEventListener("open", function(){
            console.log("Socket opend");
            ws.send("test");
        });

    </script>
    </body>
</html>`);
  res.end();
});

