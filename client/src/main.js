// client/src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { authentication } from './plugins/authentication.js'
import App from './App.vue'
import router from './router/index.js'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

console.log('Starting the Vue application setup...');

const app = createApp(App)
console.log('Vue application instance created:', app);

app.use(createPinia())
console.log('Pinia store applied.');

// Whenever install method triggers,
// once it is ready to serve the promise,
// router will be activated and the app will be mounted
console.log('Using router:', router);

authentication.install().then(() => {
	console.log('Authentication plugin installed.');
	app.use(router)
	console.log('Router applied.');
	app.mount('#app')
	console.log('Vue application mounted');

})
