(function(){
  window.onload = function(){
    console.log("Loaded");
    const ws = new WebSocket("ws://localhost:8085/client01?query=123&sign=5112123");
    ws.addEventListener('message', function(msg){
      console.log("<= ", msg);
    });
    ws.addEventListener("open", function(){
      console.log("Socket opened");
      ws.send("test");
    });
  };

})();
