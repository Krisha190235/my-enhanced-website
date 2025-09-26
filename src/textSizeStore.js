
import { defineStore } from 'pinia';

export const useTextSizeStore = defineStore('textSizeStore', {
    state: () => ({
        textSize: 'medium', 
    }),
    actions: {
        setTextSize(size) {
            this.textSize = size;
        },
    },
});