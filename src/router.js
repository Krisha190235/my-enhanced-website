// router.js
import { createRouter, createWebHistory } from 'vue-router';
import IndexPage from './components/IndexPage.vue';
import BooksPage from './components/BooksPage.vue';
import AboutUsPage from './components/AboutUsPage.vue';
import ContactUsPage from './components/ContactUsPage.vue';
import OrderPage from './components/OrderPage.vue';
import LoginPage from './components/LoginPage.vue'; // create below
import { useAuthStore } from './stores/auth';

const routes = [
    { path: '/', component: IndexPage },
    { path: '/about', component: AboutUsPage },
    { path: '/contact', component: ContactUsPage },
    { path: '/books', component: BooksPage },
    { path: '/order', component: OrderPage, meta: { requiresAuth: true } }, // protect
    { path: '/login', component: LoginPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
    const auth = useAuthStore();
    if (!auth.ready) await auth.init();           // wait for first auth state

    if (to.meta.requiresAuth && !auth.isAuthed) {
        return { path: '/login', query: { redirect: to.fullPath } };
    }
});

export default router;