import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueHead from 'vue-head';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VueMaterial from 'vue-material';
import VeeValidate from 'vee-validate';
import 'vue-material/dist/vue-material.css';

import App from './App.vue';

import routes from './routes';
import locales from './locale';
import filters from './filters';

import PageContent from './components/PageContent.vue';
import Loader from './components/Loader.vue';

// favicon
require('./assets/favicon.ico');

// Register components
Vue.component('page-content', PageContent);
Vue.component('loader', Loader);

// Filters
filters.register(Vue);

// i18n
Vue.use(VueI18n);
Object.keys(locales).forEach((key) => Vue.locale(key, locales[key]));
Vue.config.lang = 'es';

// HTML Meta management
Vue.use(VueHead);

// Form validation
Vue.use(VeeValidate, {
  locale: Vue.config.lang,
  dictionary: {
    es: {messages: locales.es.veeValidate},
  },
});

// Material design
Vue.use(VueMaterial);
Vue.material.registerTheme('default', {
  primary: 'red',
  accent: 'pink',
});

// Resource (HTTP)
Vue.use(VueResource);
Vue.http.options.root = API_ADDRESS;

// Router
Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  routes,
});

// Instanciate the app
let Application = Vue.component('app', App);
Application = new Application({
  el: '#app',
  router,
});

// Before each route
router.beforeEach((to, from, next) => {
  Vue.nextTick(() => {
    let mainContent = document.querySelector('.main-content');

    if (mainContent) {
      mainContent.scrollTop = 0;
    }

    Application.closeSidenav();

    next();
  });
});
