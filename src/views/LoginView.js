import { ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import { useAuth } from "../stores/auth.js";

export default {
    name: "LoginView",
    template: `
  <div class="container py-5" style="max-width: 480px;">
    <h1 class="mb-4">Sign in</h1>

    <form @submit.prevent="onLogin" class="mb-3">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>
      <button class="btn btn-primary w-100" :disabled="submitting">
        {{ submitting ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>

    <button class="btn btn-outline-secondary w-100" @click="onGoogle" :disabled="submitting">Continue with Google</button>

    <hr class="my-4"/>

    <h2 class="h5">Create an account</h2>
    <form @submit.prevent="onSignup" class="mb-3">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="newEmail" type="email" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="newPassword" type="password" class="form-control" />
      </div>
      <button class="btn btn-success w-100" :disabled="submitting">Create account</button>
    </form>

    <p v-if="error" class="text-danger">{{ error }}</p>
  </div>
  `,
    setup() {
        const { login, signup, loginWithGoogle } = useAuth();
        const email = ref("");
        const password = ref("");
        const newEmail = ref("");
        const newPassword = ref("");
        const submitting = ref(false);
        const error = ref("");

        const withCatch = async (fn) => {
            submitting.value = true; error.value = "";
            try { await fn(); } catch (e) { error.value = e.message; }
            finally { submitting.value = false; }
        };

        const onLogin = () => withCatch(() => login(email.value, password.value));
        const onSignup = () => withCatch(() => signup(newEmail.value, newPassword.value));
        const onGoogle = () => withCatch(() => loginWithGoogle());

        return { email, password, newEmail, newPassword, onLogin, onSignup, onGoogle, submitting, error };
    }
};