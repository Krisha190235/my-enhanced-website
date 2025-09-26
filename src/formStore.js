// src/stores/formStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFormStore = defineStore('form', () => {
    const currentStep = ref(1);
    const formData = ref({
        step1Data: '',
        step2Data: '',
        step3Data: '',
    });

    const nextStep = () => {
        if (currentStep.value < 3) {
            currentStep.value += 1;
        }
    };

    const previousStep = () => {
        if (currentStep.value > 1) {
            currentStep.value -= 1;
        }
    };

    const saveFormData = (step, data) => {
        formData.value[`step${step}Data`] = data;
    };

    return { currentStep, formData, nextStep, previousStep, saveFormData };
});