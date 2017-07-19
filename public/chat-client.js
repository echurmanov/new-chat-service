(function(){
  window.onload = function(){
    console.log("Loaded");
    const ws = new WebSocket("ws://localhost:8085/client01?userId=123&userData={a:3}&userName=CrazyNiger&sign=b0ba430b4789310f64217759ab35d4e5f6f1ada2a032a7bbb4bd871ec93d96c3");
    ws.addEventListener('message', function(msg){
      console.log("<= ", msg);
    });
    ws.addEventListener("open", function(){
      console.log("Socket opened");
      ws.send("test");
    });
  };

})();
