const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'registro', component: () => import('pages/RegisterPage.vue') },
      { path: 'admin', component: () => import('pages/AdminPage.vue') },
      { path: 'animais', component: () => import('pages/AnimalsPage.vue') },
      { path: 'admin/animais', component: () => import('pages/AdminAnimalsPage.vue') },
      { path: 'animal/:id', component: () => import('pages/InfoAnimalPage.vue') },
      { path: 'admin/vacinas', component: () => import('pages/ManageVaccinesPage.vue') },
      { path: 'perfil', component: () => import('pages/ProfilePage.vue') },
      { path: 'adocao/:id', component: () => import('pages/AdoptionFormPage.vue') },
      { path: 'minhas-solicitacoes', component: () => import('pages/MinhasSolicitacoesPage.vue') },
      { path: 'admin/solicitacoes', component: () => import('pages/AprovarSolicitacoesPage.vue') },
      { path: 'admin/racas', component: () => import('pages/AdminBreedsPage.vue') }
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes