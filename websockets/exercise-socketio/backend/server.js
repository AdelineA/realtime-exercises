import http from "http";
import handler from "serve-handler";
import nanobuffer from "nanobuffer";
import { Server } from "socket.io";

const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

msg.push({
  user: "Adeline",
  text: "Hello, This is Socket.io chat app!",
  time: Date.now(),
});

// serve static assets
const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: "./frontend",
  });
});


const io = new Server(server, {});

io.on('connection', socket => {
  console.log(`connected: ${socket.id}`)
  socket.emit('msgs: get', { msgs: getMsgs() })

  socket.on('disconnect', () => {
    console.log(`disconnected: ${socket.id}`)
  })

  socket.on('msg;post', data){
    msg.push({
      user: data.user,
      text: data.text,
      time: Date.now()  
    })
    io.emit('msgs: get', { msgs: getMsgs() })
  }

})

const port = process.env.PORT || 8080;
server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
