const app = {
  data() {
    return {
      room: ROOM,
      user: USER,
      socket: io()
    }
  },
  methods: {

  },
  mounted() {

    var socket = io();
    socket.on('users_update', (users) => {
      console.log(users, this.room)
      this.user = users[this.room]
    });
  }
}
Vue.createApp(app).mount('.app')
