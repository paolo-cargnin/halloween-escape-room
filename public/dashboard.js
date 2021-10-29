const app = {
  data() {
    return {
      users: USERS,
      socket: null
    }
  },
  methods: {
    deleteSession(session) {
      this.socket.emit('delete_session',session)
    },
    light(user,key) {
      this.socket.emit('start_light_session',{user: user.user,key})
    }
  },
  mounted() {
    this.socket = io();
    // to send: 
    // socket.emit('chat message', input.value);
    // document.querySelector('#users').innerHTML = game.users
    // document.querySelector('#test').onclick= () => {
    //   socket.emit('update_user_click', 1)
    // }
    this.socket.on('users_update', (users) => {
      // Forse qua ricevo tutti i giochi.
      // Se l'update riguarda la mia room, ok
      this.users = users
    });
  }
}
Vue.createApp(app).mount('.app')