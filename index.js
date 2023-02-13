const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const UserRoute = require("./routes/UserRoute");
const AdminRoute = require("./routes/AdminRoute");
const RequestRoute = require("./routes/RequestRoute");
// const db = require("./db");
const app = express();
const mongoose = require("mongoose");

const http = require("http");
// const { Server } = require("socket.io");

dotenv.config();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const MONGO_URL = process.env.MONGO_URL

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("a user connected " + socket.id);
//   socket.on("join_room", (room) => {
//     socket.join(room);
//     console.log("joined room " + room);
//   });

//   socket.on("newRequest", (data) => {
//     console.log("reached backend");
//     io.to(data).emit("newRequest", data);
//   });

//   socket.on("requestAccepted", (data) => {
//     io.to("room1").emit( "requestAccepted",data);
//   });
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.use("/", UserRoute);
app.use("/", AdminRoute);
app.use("/", RequestRoute);

const PORT = process.env.PORT || 8000;

mongoose.set('strictQuery', false)

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
});

const db = mongoose.connection;

const handleOpen = () => {
  console.log("Connected to DB");
  server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
}

const handleError = (error) => console.log(`Error on DB Connection:${error}`);

db.once("open", handleOpen);
db.on("error", handleError);


