import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import firebase from "firebase";
import VueClipboard from "vue-clipboard2";

// Initialize Firebase
var firebaseConfig = {};
firebase.initializeApp(firebaseConfig);

Vue.use(VueClipboard);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
