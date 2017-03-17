// Components
import Dashboard from './pages/Dashboard.vue';
import Login from './pages/Login.vue';
import Tpv from './pages/Tpv.vue';
import Orders from './pages/Orders.vue';
import Entries from './pages/Entries.vue';
import NotFound from './pages/NotFound.vue';
import users from './pages/users';
import warehouses from './pages/warehouses';
import products from './pages/products';
import brands from './pages/brands';
import taxes from './pages/taxes';
import categories from './pages/categories';

// Services
import auth from './services/auth';

const requireAuth = (to, from, next) => {
  if (!auth.loggedIn()) {
    return next({
      path: '/login',
      query: {redirect: to.fullPath},
    });
  }
  next();
};

export default [
	{path: '/', redirect: '/dashboard'},
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    beforeEnter: requireAuth,
  },
  {
    path: '/tpv',
    name: 'tpv',
    component: Tpv,
    beforeEnter: requireAuth,
  },
  {
    path: '/Orders',
    name: 'orders',
    component: Orders,
    beforeEnter: requireAuth,
  },
  {
    path: '/entries',
    name: 'entries',
    component: Entries,
    beforeEnter: requireAuth,
  },
  {
    path: '/products',
    name: 'products',
    component: products.Index,
    beforeEnter: requireAuth,
  },
  {
    path: '/products/create',
    name: 'create-product',
    component: products.Form,
    beforeEnter: requireAuth,
  },
  {
    path: '/products/edit/:id',
    name: 'edit-product',
    component: products.Form,
    beforeEnter: requireAuth,
  },
  {
    path: '/brands',
    name: 'brands',
    component: brands.Index,
    beforeEnter: requireAuth,
  },
  {
    path: '/brands/create',
    name: 'create-brand',
    component: brands.Form,
    beforeEnter: requireAuth,
  },
  {
    path: '/brands/edit/:id',
    name: 'edit-brand',
    component: brands.Form,
    beforeEnter: requireAuth,
  },
  {
    path: '/categories',
    name: 'categories',
    component: categories.Index,
    beforeEnter: requireAuth,
  },
  {
    path: '/categories/create',
    name: 'create-category',
    component: categories.Form,
    beforeEnter: requireAuth,
  },
  {
    path: '/categories/edit/:id',
    name: 'edit-category',
    component: categories.Form,
    beforeEnter: requireAuth,
  },
  {
    path: '/taxes',
    name: 'taxes',
    component: taxes.Index,
    beforeEnter: requireAuth,
  },
  {
    path: '/taxes/create',
    name: 'create-tax',
    component: taxes.Form,
    beforeEnter: requireAuth,
  },
  {
    path: '/taxes/edit/:id',
    name: 'edit-tax',
    component: taxes.Form,
    beforeEnter: requireAuth,
  },
  {
    path: '/users',
    name: 'users',
    component: users.Index,
    beforeEnter: requireAuth,
  },
  {
    path: '/users/create',
    name: 'create-user',
    component: users.Form,
    beforeEnter: requireAuth,
  },
  {
    path: '/users/edit/:id',
    name: 'edit-user',
    component: users.Form,
    beforeEnter: requireAuth,
  },
  {
    path: '/warehouses',
    name: 'warehouses',
    component: warehouses.Index,
    beforeEnter: requireAuth,
  },
  {
    path: '/warehouses/create',
    name: 'create-warehouse',
    component: warehouses.Form,
    beforeEnter: requireAuth,
  },
  {
    path: '/warehouses/edit/:id',
    name: 'edit-warehouse',
    component: warehouses.Form,
    beforeEnter: requireAuth,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/logout',
    name: 'logout',
    beforeEnter(to, from, next) {
      auth.logout();
      next('/login');
    },
  },
	{path: '*', component: NotFound},
];
