import { computed } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import { useAuth } from "../stores/auth.js";

export default {
    name: "AccountView",
    template: `
  <div class="container py-5">
    <h1 class="mb-4">My Account</h1>
    <div v-if="user" class="card p-3">
      <p class="mb-1"><strong>Email:</strong> {{ user.email }}</p>
      <p class="mb-1"><strong>Name:</strong> {{ user.displayName || '—' }}</p>
      <img v-if="user.photoURL" :src="user.photoURL" alt="Avatar" style="height:64px;width:64px;border-radius:50%"/>
    </div>
    <button class="btn btn-outline-danger mt-3" @click="logout">Sign out</button>
  </div>
  `,
    setup() {
        const { state, logout } = useAuth();
        const user = computed(() => state.user);
        return { user, logout };
    }
};