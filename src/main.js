// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import './custom-styles.css';

import { useAuthStore } from './stores/auth';   // NEW

const app = createApp(App);
const pinia = createPinia();

app.component('HeaderComponent', HeaderComponent);
app.component('FooterComponent', FooterComponent);

app.use(pinia);
app.use(router);

// Wait for auth init, then mount
const auth = useAuthStore();
auth.init().finally(() => {
    app.mount('#app');
});