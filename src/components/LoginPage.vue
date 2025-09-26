<template>
  <div class="container" style="max-width:480px;padding:2rem 1rem">
    <h1 class="mb-3">Sign in</h1>

    <form @submit.prevent="onLogin" class="mb-3">
      <label class="form-label">Email</label>
      <input v-model="email" type="email" class="form-control" required />
      <label class="form-label mt-2">Password</label>
      <input v-model="password" type="password" class="form-control" required />
      <button class="btn btn-primary w-100 mt-3" :disabled="busy">{{ busy ? 'Signing in…' : 'Sign in' }}</button>
    </form>

    <button class="btn btn-outline-secondary w-100" @click="onGoogle" :disabled="busy">Continue with Google</button>

    <hr class="my-4" />

    <h2 class="h5">Create an account</h2>
    <form @submit.prevent="onSignup">
      <input v-model="newEmail" type="email" class="form-control" placeholder="Email" />
      <input v-model="newPassword" type="password" class="form-control mt-2" placeholder="Password" />
      <button class="btn btn-success w-100 mt-2" :disabled="busy">Create account</button>
    </form>

    <p v-if="error" class="text-danger mt-3">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const email = ref(''); const password = ref('');
const newEmail = ref(''); const newPassword = ref('');
const busy = ref(false); const error = ref('');

const finish = () => router.replace(route.query.redirect ?? '/');

const run = async (fn) => {
  busy.value = true; error.value = '';
  try { await fn(); finish(); } catch (e) { error.value = e.message; }
  finally { busy.value = false; }
};

const onLogin  = () => run(() => auth.login(email.value, password.value));
const onSignup = () => run(() => auth.signup(newEmail.value, newPassword.value));
const onGoogle = () => run(() => auth.loginWithGoogle());
</script>