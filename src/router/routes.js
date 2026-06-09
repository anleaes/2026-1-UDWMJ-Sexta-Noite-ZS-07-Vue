const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'registro', component: () => import('pages/RegisterPage.vue') },
      { path: 'admin', component: () => import('pages/AdminPage.vue') },
      { path: 'animais', component: () => import('pages/AnimalsPage.vue') }
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes