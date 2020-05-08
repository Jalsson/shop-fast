'use strict';
require("dotenv").config();
const express = require("express");
const messageModel = require("./models/messageModel");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const socket = require('socket.io')

const http = require("http");
const app = express();

const PORT = process.env.PORT || 5000;

// Add a handler to inspect the req.secure flag (see
// http://expressjs.com/api#req.secure). This allows us
// to know whether the request was via http or https.
// https://github.com/aerwin/https-redirect-demo/blob/master/server.js



app.enable('trust proxy');

//Passport config
require("./controllers/passport")(passport);
app.use(express.static("uploads"));
// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: "cat secret thing",
    resave: true,
    saveUninitialized: true,
  })
);

// set up a route to redirect http to https
http.get('*', function(req, res) {  
  res.redirect('https://10.114.34.48/app/' + req.url);

  // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
  // res.redirect('https://' + req.url);
})

/*app.use(function(req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join('/app'));
  }
  return next();
});*/


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global warning variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.static(__dirname + "/public"));
app.use(express.static("views"));


// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/data", require("./routes/dataRoute"));
app.use("/chat", require("./routes/messages"));



let server = app.listen(PORT, console.log(`Server started on port ${PORT}`));


// setup socket.io
let io = socket(server);
const connectedUsers = [];

io.sockets.on("connection", (socket) => {
  /*<<<-----Function wich calculates all current connected users  (copy paste stuff)------>>>*/
  /*<<<--------------------------------------------------------------------------------->>>*/
  Object.size = function (obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  /*<-When new user makes connection they emit event which holds username, this stores it to connected users array alongside with user's socket.id------>>>*/
  /*<<<--------------------------------------------------------------------------------->>>*/

  socket.on("newUserToServer", function (data) {
    let usr = connectedUsers.find(
      (connectedUsers) => connectedUsers.socketID == socket.id
    );
    if (usr) {
      for (var i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[i] === usr) {
          connectedUsers.splice(i, 1);
        }
      }
    } else {
      connectedUsers.push({
        userName: data.userName,
        socketID: socket.id,
        userID: data.userID,
      });
    }
    socket.join(data.room);
    for (var i = 0; i < connectedUsers.length; i++) {
      console.log(
        " user " +
          connectedUsers[i].userName +
          " connected with this " +
          connectedUsers[i].userID +
          " id " +
          i +
          " on socket connection  " +
          connectedUsers[i].socketID
      );
    }
  });

  /*<<<--handling someone's disconnecting, removing them from connected users list--->>>*/
  /*<-------------------------------------------------------------------------------->>>*/

  socket.on("disconnect", (reason) => {
    var usr = connectedUsers.find(
      (connectedUsers) => connectedUsers.socketID == socket.id
    );
    if (usr) {
      for (var i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[i] === usr) {
          console.log("removed id " + connectedUsers[i].userID);
          connectedUsers.splice(i, 1);
        }
      }

      var usersInCurrentRoom = [];
      for (let i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[i].room == usr.room) {
          usersInCurrentRoom.push(connectedUsers[i]);
        }
      }

      io.to(usr.room).emit("UserListToClient", {
        connectedUsers: usersInCurrentRoom,
      });

      io.to(usr.room).emit("eventMessage", {
        eventMessage: "disconnect",
      });
    }
    console.log(
      "disconnect emit: connected users size " +
        Object.size(connectedUsers) +
        " after " +
        socket.id +
        " disconnect for " +
        reason +
        " reason"
    );
  });

  /*<<<---Handles private messaging---->>>*/

  socket.on("messageToServer", (data) => {
    data.message = data.message.trim()
    if(data.message === "") return
    data.message = removeTags(data.message)
    if(!data.message) return

    console.log(
      data.senderID +
        " sended message " +
        data.message +
        " To user " +
        data.userToSendID
    );
    let usr = connectedUsers.find(
      (connectedUsers) => connectedUsers.userID == data.userToSendID
    );
    let senderUsr = connectedUsers.find(
      (connectedUsers) => connectedUsers.userID == data.senderID
    );
    let newData = {};
    if (usr) {
      newData = {
        message: data.message,
        userToSendID: data.userToSendID,
        userToSendName: usr.userName,
        senderID: data.senderID,
        senderName: senderUsr.userName,
      };

      io.to(usr.socketID).emit("messageToUser", newData);
    } else {
      newData = {
        message: data.message,
        userToSendID: data.userToSendID,
        senderID: data.senderID,
        senderName: senderUsr.userName,
      };
    }
    io.to(socket.id).emit("messageToUser", newData);
    messageModel.insertMessage(newData)
  });
});

function removeTags(str) {
  str = str.trim()
  if ((str===null) || (str===''))
  return false;
  else
  str = str.toString();
  return str.replace( /(<([^>]+)>)/ig, '');
}
