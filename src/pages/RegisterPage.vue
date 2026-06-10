<template>
  <q-page class="flex flex-center bg-cream q-pa-md">
    
    <q-card class="login-card shadow-4 q-pa-xl" style="border-radius: 16px; width: 100%; max-width: 450px;">
      
      <div class="text-center q-mb-lg">
        <q-icon name="person_add" color="primary" size="3.5rem" class="q-mb-sm" />
        <h2 class="text-h4 text-weight-bold text-dark q-ma-none q-mb-sm">Crie sua Conta</h2>
        <p class="text-subtitle1 text-grey-7 q-ma-none">Preencha os dados para se registrar</p>
      </div>

      <q-form @submit.prevent="registrar" class="q-gutter-y-md">
        
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-6">
            <q-input 
              v-model="firstName" 
              outlined 
              placeholder="Nome" 
              bg-color="grey-1" color="primary" lazy-rules
              :rules="[val => !!val || 'Obrigatório']"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input 
              v-model="lastName" 
              outlined 
              placeholder="Sobrenome" 
              bg-color="grey-1" color="primary" lazy-rules
              :rules="[val => !!val || 'Obrigatório']"
            />
          </div>
        </div>

        <q-input 
          v-model="username" 
          outlined 
          placeholder="Nome de Usuário" 
          bg-color="grey-1" color="primary" lazy-rules
          :rules="[val => !!val || 'Por favor, informe um usuário']"
        >
          <template v-slot:prepend><q-icon name="person_outline" color="grey-7" /></template>
        </q-input>

        <q-input 
          v-model="email" 
          type="email"
          outlined 
          placeholder="E-mail" 
          bg-color="grey-1" color="primary" lazy-rules
          :rules="[val => !!val || 'Por favor, informe seu e-mail']"
        >
          <template v-slot:prepend><q-icon name="mail_outline" color="grey-7" /></template>
        </q-input>

        <q-input 
          v-model="password" 
          outlined 
          placeholder="Senha" 
          :type="isPasswordVisible ? 'text' : 'password'"
          bg-color="grey-1" color="primary" lazy-rules
          :rules="[val => !!val || 'Por favor, crie uma senha']"
        >
          <template v-slot:prepend><q-icon name="lock_outline" color="grey-7" /></template>
          <template v-slot:append>
            <q-icon 
              :name="isPasswordVisible ? 'visibility_off' : 'visibility'" 
              class="cursor-pointer" color="grey-7"
              @click="isPasswordVisible = !isPasswordVisible" 
            />
          </template>
        </q-input>

        <q-btn 
          type="submit" 
          color="primary" 
          label="Registrar" 
          class="full-width q-mt-md text-weight-bold" 
          size="lg" style="border-radius: 8px;"
          :loading="isLoading" no-caps
        />
        
        <div v-if="errorMessage" class="text-negative text-center text-weight-bold q-mt-sm">
          {{ errorMessage }}
        </div>
        
        <div class="text-center q-mt-md text-grey-8">
          Já tem uma conta? 
          <span class="text-primary text-weight-bold cursor-pointer" @click="$router.push('/login')">
            Faça Login
          </span>
        </div>

      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { fazerRegistro } from '../services/LoginService'

    const router = useRouter()

    const firstName = ref('')
    const lastName = ref('')
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const isPasswordVisible = ref(false)
    const isLoading = ref(false)
    const errorMessage = ref('')

    const registrar = async () => {
        isLoading.value = true
        errorMessage.value = ''

        try {
            await fazerRegistro(
                firstName.value, 
                lastName.value, 
                username.value, 
                email.value, 
                password.value
            )
            
            router.push('/')

        } catch (error) {
            errorMessage.value = error.message
        } finally {
            isLoading.value = false
        }
    }
</script>

<style scoped>
    .bg-cream { background-color: #f7f5ef; }
    :deep(.q-field--outlined .q-field__control) { border-radius: 8px; }
</style>