require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport  = require('passport')
const socket = require('socket.io')
const http = require('http');
const app = express();

//Passport config
require('./controllers/passport')(passport)
app.use(express.static('uploads'))
// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//Bodyparser
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: false}))

// Express session 
app.use(session({
    secret: 'cat secret thing',
    resave: true,
    saveUninitialized: true
  }))

  // Passport middleware
  app.use(passport.initialize())
  app.use(passport.session())

// Connect flash
app.use(flash()) 

// Global warning variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  next()
});

app.use(express.static(__dirname + '/public'))
app.use(express.static('views'));

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/data', require('./routes/dataRoute'))
app.use('/chat', require('./routes/messages'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`))
let server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);

/*Event listener for HTTP server "error" event. */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/* Event listener for HTTP server "listening" event.*/
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

// setup socket.io
const io = socket(server);
const connectedUsers = [];

io.sockets.on("connection", (socket) => {

console.log("new connections")
  /*<<<-----Function wich calculates all current connected users  (copy paste stuff)------>>>*/
  /*<<<--------------------------------------------------------------------------------->>>*/
  Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  /*<-When new user makes connection they emit event which holds username, this stores it to connected users array alongside with user's socket.id------>>>*/
  /*<<<--------------------------------------------------------------------------------->>>*/

  socket.on("newUserToServer", function (data) {

    var usr = connectedUsers.find(connectedUsers => connectedUsers.userID == socket.id);
    if (usr) {
      for (var i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[i] === usr) {
          connectedUsers.splice(i, 1);
        }
      }
    }
    else {
      connectedUsers.push({
        userName: data.userName,
        socketID: socket.id,
        userID: data.userID
      });
    }
    socket.join(data.room)
    for (var i = 0; i < connectedUsers.length; i++) {
      console.log(" user " + connectedUsers[i].userName + " connected with this " + connectedUsers[i].userID + " id " + i + " on socket connection  " + socket.id);
    }


    /*io.to(data.room).emit('UserListToClient',{
      connectedUsers: usersInCurrentRoom
    });*/
  });

  /*<<<--handling someone's disconnecting, removing them from connected users list--->>>*/
  /*<-------------------------------------------------------------------------------->>>*/

  socket.on("disconnect", (reason) => {
    var usr = connectedUsers.find(connectedUsers => connectedUsers.userID == socket.id);
    if (usr) {
      for (var i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[i] === usr) {
          console.log("removed id " + connectedUsers[i].userID)
          connectedUsers.splice(i, 1);
        }
      }

      var usersInCurrentRoom = []
      for (let i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[i].room == usr.room) {
          usersInCurrentRoom.push(connectedUsers[i])
        }
      }
  
      io.to(usr.room).emit('UserListToClient',{
        connectedUsers: usersInCurrentRoom
      });
      
      io.to(usr.room).emit('eventMessage',{
        eventMessage: "disconnect"
      });

    }

    
    console.log("disconnect emit: connected users size " + Object.size(connectedUsers) + " after " + socket.id + " disconnect for " + reason + " reason");
  });

  //testing if this reconnect ever launches
  socket.on("reconnect", function (data) {
    console.log("reconnected")
  });

  /*<<<---------Ilmoita konsolissa uusi viesti ja emittaa se muille------->>>*/

  socket.on('chatToServer', function (data) {
    io.to(data.roomToSend).emit('chat', data);

    console.log(data.userName + " sended message " + data.message + " from room " + data.roomToSend + " at " +
      data.date)

    const newMessage = new Message({
      name: data.userName,
      message: data.message,
      room: data.roomToSend,
      date: data.date
    });
    newMessage.save()
      .then(message => {
      })
      .catch(err => console.log(err));
  });

  /*<<<---Handles private messaging---->>>*/

  socket.on("whisperToServer", (data) => {
    var usr = connectedUsers.find(connectedUsers => connectedUsers.userName == data.userToSend);
    if (usr) {
      io.to(usr.userID).emit("whisperToUser", data);

      console.log(data.userName + " sended message " + data.message + " To user " + data.userToSend + " at " +
        data.date)
      const newPrivMessage = new PrivMessage({
        name: data.userName,
        SendedTo: data.userToSend,
        message: data.message,
        date: data.date
      });
      newPrivMessage.save()
        .then(message => {
        })
        .catch(err => console.log(err));


      io.to(socket.id).emit("whisperToUser", data);
    }
    else{
      io.to(socket.id).emit('eventMessage',{
        eventMessage: "cannot send private message, either username is wrong or person has left the server"
      });
    }
  })
});

