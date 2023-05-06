const express = require("express");
require("dotenv").config();
const app = express();
const http = require("http");
const cors = require("cors");
// const csrf = require('csurf')
const { Server } = require("socket.io");
const { checkTokenValidation } = require("../middlewares/authMiddleware");
const routes = require("./routes");
const { initializeDbConnection } = require("./db");
const { Chat, PhraseTag, ChatRoom, User } = require("../models/Schemas");

const server = http.createServer(app);
const PORT = 5000;

const { default: mongoose } = require("mongoose");
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
const parseBody = bodyParser.urlencoded({limit: '50mb', extended: true});
const cookieParser = require("cookie-parser");
const corsOptions = {
  credentials: true, origin: "http://94.101.179.112/Food"
}
app.use(cors(corsOptions));
app.use(cookieParser())
// const csrfProtection = csrf({cookie: true})
// This allows us to access the body of POST/PUT
// requests in our route handlers (as req.body)

app.use(express.static(`${__dirname}/public`));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://94.101.179.112/Food"); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// app.get('/api', csrfProtection, (req, res)=>{
//   res.json({csrfToken: req.csrfToken()})
// })
// Add all the routes to our Express server
// exported from routes/index.js
// routes.forEach((route) => {
//   if (route.checkTokenValidation) {
//     app[route.method](route.path, parseBody, csrfProtection, checkTokenValidation, route.handler);
//   } else {
//     app[route.method](route.path, parseBody, csrfProtection, route.handler);
//   }
// });
routes.forEach((route) => {
  if (route.checkTokenValidation) {
    app[route.method](route.path, parseBody, checkTokenValidation, route.handler);
  } else {
    app[route.method](route.path, parseBody, route.handler);
  }
});

// Connect to the database, then start the server.
// This prevents us from having to create a new DB
// connection for every request.
// initializeDbConnection()
//     .then(() => {
// app.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
// });
