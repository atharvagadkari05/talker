const express = require("express");
const app = express();
const http = require("http");
const redis = require("redis")
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());
const PORT = process.env.PORT || 3001

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


// Redis Pub/Sub Code

const subscriber = redis.createClient({
  port: 6379,
  host: 'rds'
});

const publisher = redis.createClient({
  port: 6379,
  host: 'rds'
});


subscriber.on("subscribe", function (channel, count) {
  console.log(`Server ${APPID} subscribed successfully to livechat`)
  count++;
  publisher.publish("livechat", "a message");
});

subscriber.on("message", function (channel, message) {
  try {
    
    console.log(`Server ${APPID} received message in channel ${channel} msg: ${message}`);

    io.emit("send_msg", `${APPID} : ${message}`)

  }
  catch (ex) {
    console.log("ERR::" + ex)
  }
});

subscriber.subscribe("livechat");



// Socketio Logic


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);



  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("SERVER RUNNING");
});
