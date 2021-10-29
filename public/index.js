const app = {
  data() {
    return {
      users: USERS,
      socket: null
    }
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