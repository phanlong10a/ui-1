importScripts('https://www.gstatic.com/firebasejs/8.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.9.0/firebase-analytics.js');
importScripts('https://www.gstatic.com/firebasejs/8.9.0/firebase-messaging.js');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('../firebase-messaging-sw.js')
    .then(function (registration) {
      console.log('Registration successful, scope is:', registration.scope);
    })
    .catch(function (err) {
      console.log('Service worker registration failed, error:', err);
    });
}

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  messagingSenderId: '615674978299',
  appId: '1:615674978299:web:4e6e2a252b6b9f3996f55e',
};

// phần firebaseConfig tương tự như ở trên nhé

firebase.initializeApp(firebaseConfig);

const message = firebase.messaging();
