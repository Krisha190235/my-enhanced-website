import { initializeApp } from 'firebase/app';
// Optional: only include analytics if you need it
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCBjYMGitySX4bnD3-1dDSzohyEDYKI2IA",
  authDomain: "krisha-a1fb3.firebaseapp.com",
  projectId: "krisha-a1fb3",
  storageBucket: "krisha-a1fb3.firebasestorage.app",
  messagingSenderId: "919383409073",
  appId: "1:919383409073:web:ad10bcd2cd43adc56e7d90",
  measurementId: "G-S3CXZ9QZN8"
};

export const firebaseApp = initializeApp(firebaseConfig);

// Optional: enable analytics only in browser (prevents SSR errors)
if (typeof window !== 'undefined') {
  getAnalytics(firebaseApp);
}