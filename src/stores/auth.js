// src/stores/auth.js
import { defineStore } from 'pinia';
import { firebaseApp } from '../firebase';
import {
    getAuth, onAuthStateChanged,
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup, signOut
} from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        ready: false,            // becomes true after first auth state is known
        _initPromise: null,      // used so router/main can await initialization
        error: null,
    }),
    getters: {
        isAuthed: (s) => !!s.user,
    },
    actions: {
        init() {
            if (this._initPromise) return this._initPromise;

            const auth = getAuth(firebaseApp);
            this._initPromise = new Promise((resolve) => {
                onAuthStateChanged(auth, (u) => {
                    this.user = u
                        ? { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL }
                        : null;
                    this.ready = true;
                    resolve();
                });
            });

            return this._initPromise;
        },

        // Auth actions
        async login(email, password) {
            this.error = null;
            const auth = getAuth(firebaseApp);
            await signInWithEmailAndPassword(auth, email, password);
        },
        async signup(email, password) {
            this.error = null;
            const auth = getAuth(firebaseApp);
            await createUserWithEmailAndPassword(auth, email, password);
        },
        async loginWithGoogle() {
            this.error = null;
            const auth = getAuth(firebaseApp);
            await signInWithPopup(auth, new GoogleAuthProvider());
        },
        async logout() {
            const auth = getAuth(firebaseApp);
            await signOut(auth);
        },
    },
});