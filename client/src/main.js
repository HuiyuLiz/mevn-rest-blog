import { createApp } from 'vue'
// eslint-disable-next-line no-unused-vars
import boostrap from 'bootstrap'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'
import Spinner from './components/ui/Spinner.vue'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(VueAxios, axios)

app.component('Spinner', Spinner)

app.mount('#app')
