const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const UserRoute = require("./routes/UserRoute");
const AdminRoute = require("./routes/AdminRoute");
const RequestRoute = require("./routes/RequestRoute");
const db = require("./db");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected " + socket.id);
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log("joined room " + room);
  });

  socket.on("newRequest", (data) => {
    console.log("reached backend");
    io.to(data).emit("newRequest", data);
  });

  socket.on("requestAccepted", (data) => {
    io.to("room1").emit( "requestAccepted",data);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

db();

app.use("/", UserRoute);
app.use("/", AdminRoute);
app.use("/", RequestRoute);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
