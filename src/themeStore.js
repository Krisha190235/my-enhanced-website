import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDarkMode: false, // Default value
    }),
    actions: {
        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
        },
    },
});