<template>
  <q-page class="flex flex-center bg-cream q-pa-md">
    
    <q-card class="login-card shadow-4 q-pa-xl" style="border-radius: 16px; width: 100%; max-width: 420px;">
      
      <div class="text-center q-mb-xl">
        <q-icon name="pets" color="primary" size="3.5rem" class="q-mb-sm" />
        <h2 class="text-h4 text-weight-bold text-dark q-ma-none q-mb-sm">Bem-vindo!</h2>
        <p class="text-subtitle1 text-grey-7 q-ma-none">Entre na sua conta para continuar</p>
      </div>

      <q-form @submit.prevent="logar" class="q-gutter-y-md">
        
        <q-input 
          v-model="username" 
          outlined 
          placeholder="Usuário" 
          bg-color="grey-1"
          color="primary"
          lazy-rules
          :rules="[val => !!val || 'Por favor, informe seu usuário']"
        >
          <template v-slot:prepend>
            <q-icon name="person_outline" color="grey-7" />
          </template>
        </q-input>

        <q-input 
          v-model="password" 
          outlined 
          placeholder="Senha" 
          :type="isPasswordVisible ? 'text' : 'password'"
          bg-color="grey-1"
          color="primary"
          lazy-rules
          :rules="[val => !!val || 'Por favor, informe sua senha']"
        >
          <template v-slot:prepend>
            <q-icon name="lock_outline" color="grey-7" />
          </template>
          <template v-slot:append>
            <q-icon 
              :name="isPasswordVisible ? 'visibility_off' : 'visibility'" 
              class="cursor-pointer" 
              color="grey-7"
              @click="isPasswordVisible = !isPasswordVisible" 
            />
          </template>
        </q-input>

        <q-btn 
          type="submit" 
          color="primary" 
          label="Entrar" 
          class="full-width q-mt-md text-weight-bold" 
          size="lg"
          style="border-radius: 8px;"
          :loading="isLoading"
          no-caps
        />
        
        <div class="text-center q-mt-lg text-grey-8">
          Não tem uma conta? 
          <span class="text-primary text-weight-bold cursor-pointer" @click="$router.push('/registro')">
            Registre-se
          </span>
        </div>

      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { fazerLogin } from '../services/LoginService'

    const router = useRouter()

    const username = ref('')
    const password = ref('')
    const isPasswordVisible = ref(false)
    const isLoading = ref(false)

    const logar = async () => {
        isLoading.value = true

        try {
            await fazerLogin(username.value, password.value)

            router.push('/')

        } catch (error) {
            console.log('Erro na requisição: ', error.message)
        } finally {
            isLoading.value = false
        }
    }
</script>

<style scoped>
    .bg-cream {
    background-color: #f7f5ef;
    }

    :deep(.q-field--outlined .q-field__control) {
    border-radius: 8px;
    }
</style>