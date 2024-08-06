import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { authentication } from './plugins/authentication'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

const app = createApp(App)

app.use(createPinia())

// Whenever install method triggers,
// once it is ready to serve the promise,
// router will be activated and the app will be mounted
authentication.install().then(() => {
	app.use(router)
	app.mount('#app')
})
