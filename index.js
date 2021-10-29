const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
// var Datastore = require('nedb');
// var rooms = new Datastore();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/game/index.html');
});

const gameRoomPrefix = 'user-'

const users = {}

app.get('/dashboard', (req, res) => {
  console.log('_',users)
  io.on('connection', (socket) => {
    socket.on('delete_session',(session) => {
      const i = gameRoomPrefix+session.user.name
      delete users[i]
      io.emit('users_update',users)
    })
    
    socket.on('start_light_session',({user,key}) => {
      console.log(user)
      let {time} = user
      users[key].user.time = time;
      users[key].user.light = true;
      io.emit('users_update',users)
      const int = setInterval(() => {
        time--
        users[key].user.time = time;
        users[key].user.light = true;
        io.emit('users_update',users)
        if ( time === 0) {
          users[key].user.light = false;
          users[key].user.time = 60;
          clearInterval(int)
          io.emit('users_update',users)
        }
      },1000)
    })
  })
  res.render('dashboard',{
    users
  })
})
app.get('/rooms/:gameId', (req, res) => {
  //Get room name
  const roomName = gameRoomPrefix+req.params.gameId
  // If the game doesn't exsist, I'll inizialize it
  if (!users[roomName]){
    users[roomName] = {
      user: {
        time: 60,
        name: req.params.gameId,
        light: false
      },
    }
  }

  // Connect the user to the socket
  io.on('connection', (socket) => {
    io.emit('users_update',users)

    socket.on(roomName+'_update', gameUpdate => {
      io.emit(roomName+'_update',gameUpdate)
    });
  });

  res.render('room',{
    room: roomName,
    user: users[roomName]
  });

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});