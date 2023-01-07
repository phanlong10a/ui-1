import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD8-o10wI1uKMustZ-mLSNxnrSYezj_Kcw',
  authDomain: 'smooth-pen-362407.firebaseapp.com',
  projectId: 'smooth-pen-362407',
  storageBucket: 'smooth-pen-362407.appspot.com',
  messagingSenderId: '615674978299',
  appId: '1:615674978299:web:4e6e2a252b6b9f3996f55e',
  measurementId: 'G-7E8EML90ZX',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const messaging = getMessaging(app);
export { app, auth, messaging };
