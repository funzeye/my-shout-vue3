import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios'
import { VuelidatePlugin } from "@vuelidate/core";

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* firebase start */
// I should move this to its own file?
import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyB8-xAjyYMTR0Jt1-H-ayS9FDINW4JdAhQ',
  authDomain: 'myshout-app.firebaseapp.com',
  databaseURL: 'https://myshout-app.firebaseio.com',
  projectId: 'myshout-app',
  storageBucket: 'myshout-app.appspot.com',
  messagingSenderId: '99944916740',
  appId: '1:99944916740:web:2ee7fe3bcb77d6402bd251'
}
firebase.initializeApp(firebaseConfig)

/* fireabse end */
import { defineCustomElements } from "@ionic/pwa-elements/loader";

axios.defaults.baseURL = 'https://myshout-app.firebaseio.com/'

const app = createApp(App)
  .use(IonicVue)
  .use(store)
  .use(VuelidatePlugin);
  // .use(router);

store.dispatch('userModule/checkAuth').then(() => {
  app.use(router);
  router.isReady();
  }).then(() => {
    app.mount("#app");
    defineCustomElements(window);
  })

// router.isReady().then(() => {
//   app.mount('#app');
// });