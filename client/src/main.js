// client/src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'

import './input.css'
// import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

console.log('Starting the Vue application setup...');
const app = createApp(App);
console.log('Vue application instance created:', app);

// Register the Pinia store with the Vue application
console.log('Registering Pinia store...');
// const pinia = createPinia();
// app.use(pinia);

app.use(createPinia())
console.log('Pinia store applied.');

app.use(router);
console.log('Router applied.');

app.mount('#app');
console.log('Vue application mounted');
