<template>
  <header class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <!-- Navbar Brand with Logo -->
      <RouterLink class="navbar-brand d-flex align-items-center" to="/">
        <img :src="bookImage" alt="Online Bookstore" style="height: 85px" />
      </RouterLink>

      <!-- Navbar Toggle Button for Mobile View -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <nav class="navbar-nav ms-auto align-items-lg-center">
          <RouterLink class="nav-link" to="/">Home</RouterLink>
          <RouterLink class="nav-link" to="/books">Books</RouterLink>
          <RouterLink class="nav-link" to="/about">About Us</RouterLink>
          <RouterLink class="nav-link" to="/contact">Contact Us</RouterLink>

          <!-- Order link: always visible; route is protected by guard -->
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/order" :aria-label="orderAria">
            <span>Order</span>
            <span v-if="!isAuthed" class="badge text-bg-secondary">Sign in</span>
          </RouterLink>
        </nav>

        <!-- Search Form -->
        <form class="d-flex ms-3" role="search" @submit.prevent>
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button class="btn btn-outline-light" type="submit">Search</button>
        </form>

        <!-- Dark Mode Toggle Button -->
        <button class="btn btn-outline-light ms-3" @click="toggleDarkMode" :aria-pressed="isDark.toString()">
          Toggle Dark Mode
        </button>

        <!-- Auth Area -->
        <div class="ms-3 d-flex align-items-center gap-2">
          <!-- When NOT signed in -->
          <RouterLink v-if="!isAuthed" class="btn btn-outline-primary" to="/login">Sign in</RouterLink>

          <!-- When signed in -->
          <div v-else class="d-flex align-items-center gap-2">
            <img
              v-if="user?.photoURL"
              :src="user.photoURL"
              alt="Avatar"
              style="height: 36px; width: 36px; border-radius: 50%; object-fit: cover"
            />
            <span class="text-light d-none d-sm-inline">Hi, {{ user?.displayName || user?.email }}</span>
            <button class="btn btn-outline-danger" @click="onLogout">Sign out</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useThemeStore } from '../themeStore.js';
import { useAuthStore } from '../stores/auth';
import bookImage from '../assets/book2.jpg';

const themeStore = useThemeStore();
const auth = useAuthStore();

const isAuthed = computed(() => auth.isAuthed);
const user = computed(() => auth.user);
const isDark = computed(() => themeStore.isDarkMode ?? false);

const toggleDarkMode = () => themeStore.toggleDarkMode();
const onLogout = () => auth.logout();

// Better a11y for the Order link when not signed in
const orderAria = computed(() => (isAuthed.value ? 'Go to Order page' : 'Order (sign in required)'));
</script>

<style scoped>
header .navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
}

header .nav-link {
  color: white;
  font-weight: 600;
  margin-right: 15px;
}

header .nav-link:hover {
  color: #ffcc00;
}

header .btn-outline-light {
  color: white;
  border-color: white;
}

header .btn-outline-light:hover {
  background-color: white;
  color: black;
}
</style>