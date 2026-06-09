<template>
  <q-header elevated class="bg-primary text-white" height-hint="90">
    <q-toolbar class="q-py-md q-px-md q-px-sm-xl">
      <q-toolbar-title class="row no-wrap items-center cursor-pointer" @click="$router.push('/')">
        <q-icon name="favorite" color="negative" size="md" class="q-mr-sm" />
        <span class="text-weight-bold text-h5 text-white">Adotar&Amar</span>
      </q-toolbar-title>

      <div class="row items-center gt-sm">

        <q-btn @click="$router.push('/animais')" flat no-caps label="Animais" color="white" class="text-h6 text-weight-bold q-mr-sm" />
        
        <q-btn round flat icon="account_circle" size="lg" color="white" @click="verificarLogin">
          <q-menu v-if="isLoggedIn" style="width: 150px;">
            <q-list>
              <q-item>
                <q-item-section class="text-weight-bold">Olá, {{ userName }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item v-if="userRole === 'admin' || userRole === 'moderador'" clickable v-close-popup @click="$router.push('/admin')">
                <q-item-section>Gerenciar Site</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="fazerLogout">
                <q-item-section class="text-negative">Sair</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="lt-md">
        <q-btn flat round dense icon="menu" color="white" size="lg">
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 220px">
              
              <q-item clickable v-close-popup @click="$router.push('/animais')">
                <q-item-section avatar><q-icon name="pets" color="primary" /></q-item-section>
                <q-item-section class="text-weight-bold">Animais</q-item-section>
              </q-item>
              
              <q-separator />

              <q-item v-if="!isLoggedIn" clickable v-close-popup @click="verificarLogin">
                <q-item-section avatar><q-icon name="account_circle" /></q-item-section>
                <q-item-section>Fazer Login</q-item-section>
              </q-item>

              <template v-else>
                <q-item>
                  <q-item-section avatar><q-icon name="account_circle" /></q-item-section>
                  <q-item-section class="text-weight-bold">Olá, {{ userName }}</q-item-section>
                </q-item>

                <q-item v-if="userRole === 'admin' || userRole === 'moderador'" clickable v-close-popup @click="$router.push('/admin')">
                  <q-item-section avatar><q-icon name="admin_panel_settings" color="primary" /></q-item-section>
                  <q-item-section>Gerenciar Site</q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="fazerLogout">
                  <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
                  <q-item-section class="text-negative">Sair</q-item-section>
                </q-item>
              </template>
              
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  // IMPORTANTE: Importamos o userRole aqui!
  import { isLoggedIn, userName, userRole, atualizarEstadoLogin, fazerLogout } from '../services/LoginService'

  defineOptions({ name: 'HeaderApp' })
  const router = useRouter()

  onMounted(() => {
    atualizarEstadoLogin()
  })

  const verificarLogin = () => {
    atualizarEstadoLogin() 
    if (!isLoggedIn.value) {
      router.push('/login')
    }
  }
</script>