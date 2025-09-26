<template>
  <div id="app" :class="{ dark: themeStore.isDarkMode }">
    <HeaderComponent />
    <button @click="themeStore.toggleDarkMode" class="toggle-dark-mode">
      Toggle Dark Mode
    </button>
    <router-view />
    <FooterComponent />
  </div>
</template>

<script>
import { useThemeStore } from './themeStore'; // Ensure the path is correct

export default {
  name: 'App',
  setup() {
    // Theme Store (Dark Mode)
    const themeStore = useThemeStore();

    return {
      themeStore,
    };
  },
};
</script>

<style>
.dark {
  background-color: black;
  color: white;
}

.toggle-dark-mode {
  background-color: transparent; /* Adjust as needed */
  color: white; /* Adjust as needed */
  border: none;
  cursor: pointer;
  margin: 1rem; /* Add margin as needed */
}
</style>



