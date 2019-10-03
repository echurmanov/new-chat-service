(function(){
  window.onload = function(){
    console.log("Loaded");
    const ws = new WebSocket("ws://localhost:8080/chat/83484381-e607-11e9-85db-0263279f3ff3?userId=123&userData={a:3,+b:5}&userName=CrazyNiger&sign=b4df4d7d7afca37d3fa22f171ac5bef599882e2644cfc65a9e72c37ec5a44647");
    ws.addEventListener('message', function(msg){
      console.log("<= ", msg);
    });
    ws.addEventListener("open", function(){
      console.log("Socket opened");
      const message = {
        "type": "message",
        "room": "49ab45dd-6c7d-11e7-b98f-0800278f16ef",
        "text": "Всем привет от Нигера"
      };
      ws.send(JSON.stringify(message));
    });
  };

})();
