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

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
          // Registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
    var socket = io();
    socket.on('users_update', (users) => {
      console.log(users, this.room)
      this.user = users[this.room]
    });
  }
}
Vue.createApp(app).mount('.app')
