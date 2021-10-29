const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
// var Datastore = require('nedb');
// var rooms = new Datastore();
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/game/index.html');
});

const gameRoomPrefix = 'room-'

const games = {
}
app.get('/rooms/:gameId', (req, res) => {
  //Get room name
  const roomName = gameRoomPrefix+req.params.gameId
  // If the game doesn't exsist, I'll inizialize it
  if (!games[roomName]){
    games[roomName] = {
      users: [],
      game: {
      }
    }
  }

  // Connect the user to the socket
  io.on('connection', (socket) => {
    // Join the socket room
    socket.join(roomName)
    // If the user is new, add it
    users = io.sockets.adapter.rooms.get(roomName);
    if (!games[roomName].users.find((u) => (u.id == socket.id))){
      const newUser = {
        id: socket.id,
        ready: false,
        name: '',
        click: 0
      }
      
      games[roomName].users.push(newUser)
      io.to(roomName).emit('update',games[roomName])
    }

    // When the user closes the session, i remove it from the game
    socket.on("disconnect", () => {
      games[roomName].users = games[roomName].users.filter((u) => u.id !== socket.id)
      io.to(roomName).emit('update',games[roomName])
    });
    
    // When we received a game update
    // We send it back to all the users
    socket.on(roomName+'_update', gameUpdate => {
      io.to(roomName).emit('update',gameUpdate)
    });
    

  });

  res.render('room',{
    room: roomName,
    game: games[roomName]
  });

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});