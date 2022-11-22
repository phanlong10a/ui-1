export const authRoutes = [
  {
    exact: true,
    path: '/',
    component: '@/pages/User/index',
    title: 'navigation_admin',
    routes: [],
    wrappers: ['@/layouts/Wrapper'],
  },
  {
    exact: true,
    path: '/user',
    component: '@/pages/User/index',
    title: 'navigation_admin',
    routes: [],
    wrappers: ['@/layouts/Wrapper'],
  },
  {
    exact: true,
    path: '/user_detail/:id',
    component: '@/pages/UserEditAccount/index',
    title: 'navigation_admin',
    routes: [],
    wrappers: ['@/layouts/Wrapper'],
  },
  {
    exact: true,
    path: '/user_new/',
    component: '@/pages/UserNewAccount/index',
    title: 'navigation_admin',
    routes: [],
    wrappers: ['@/layouts/Wrapper'],
  },
  {
    exact: true,
    path: '/user_edit/:id',
    component: '@/pages/UserEditAccount/index',
    title: 'navigation_admin',
    routes: [],
    wrappers: ['@/layouts/Wrapper'],
  },
];
export default [
  {
    exact: true,
    path: '/login',
    component: '@/layouts/AuthLayout/index',
    title: 'Login',
    wrappers: ['@/layouts/Wrapper'],
    routes: [
      { exact: true, path: '/login', component: '@/pages/SignIn/index' },
    ],
  },
  {
    exact: false,
    path: '/',
    component: '@/layouts/MainLayout',
    wrappers: ['@/layouts/Wrapper'],
    routes: authRoutes,
  },
];
