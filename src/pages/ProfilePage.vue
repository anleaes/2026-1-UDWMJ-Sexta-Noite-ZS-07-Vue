<template>
  <q-page class="bg-cream q-pa-md q-pa-md-xl">
    <div class="container-profile mx-auto" v-if="!profileLoading">
      
      <div class="row q-col-gutter-lg">
        
        <div class="col-12 col-md-4">
          <q-card class="shadow-2 text-center q-pa-lg card-profile-left">
            <q-icon name="account_circle" size="120px" color="primary" class="q-mb-md" />
            
            <div class="text-h5 text-weight-bold text-dark">{{ perfil.first_name }} {{ perfil.last_name }}</div>
            <div class="text-subtitle1 text-grey-7 q-mb-md">@{{ perfil.username }}</div>
            
            <q-badge 
              :color="userRole === 'admin' ? 'negative' : (userRole === 'moderador' ? 'orange' : 'secondary')"
              :label="userRole === 'admin' ? 'Administrador' : (userRole === 'moderador' ? 'Moderador' : 'Cliente')"
              class="q-px-md q-py-xs text-weight-bold"
              style="border-radius: 20px;"
            />

            <q-separator class="q-my-lg" />

            <div class="q-gutter-y-sm">
              <q-btn @click="modalAlterarMeuUser" class="full-width text-weight-bold" color="primary" outline label="Alterar Usuário" no-caps />
              <q-btn @click="modalAlterarMinhaSenha" class="full-width text-weight-bold" color="dark" outline label="Alterar Senha" no-caps />
            </div>
          </q-card>
        </div>

        <div class="col-12 col-md-8">
          <q-card class="shadow-2 card-profile-right">
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="left"
              narrow-indicator
            >
              <q-tab name="pessoal" label="Dados Pessoais" />
              <q-tab v-if="userRole === 'user'" name="endereco" label="Endereço" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              
              <q-tab-panel name="pessoal">
                <q-form @submit.prevent="salvarInformacoes" class="q-gutter-y-md">
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6">
                      <q-input v-model="perfil.first_name" label="Nome:" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input v-model="perfil.last_name" label="Sobrenome:" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                    </div>
                    <div class="col-12">
                      <q-input v-model="perfil.email" label="E-mail:" type="email" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input v-model="perfil.cpf" label="CPF:" outlined dense readonly bg-color="grey-2" mask="###.###.###-##" />
                    </div>
                    
                    <div v-if="userRole !== 'user'" class="col-12 col-sm-6">
                      <q-input v-model="perfil.position" label="Seu Cargo na Empresa:" outlined dense readonly bg-color="grey-2" />
                    </div>
                  </div>

                  <div class="row justify-end q-mt-md">
                    <q-btn type="submit" color="primary" label="Salvar Alterações" :loading="btnLoading" no-caps class="text-weight-bold" />
                  </div>
                </q-form>
              </q-tab-panel>

              <q-tab-panel name="endereco" v-if="userRole === 'user'">
                <q-form @submit.prevent="salvarInformacoes" class="q-gutter-y-md">
                  <q-input v-model="perfil.address" label="Endereço Completo:" outlined dense type="textarea" rows="3" lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                  
                  <div class="q-mt-md bg-grey-2 q-pa-md rounded-borders">
                    <div class="text-weight-bold text-dark q-mb-sm">Status de Verificação da ONG:</div>
                    <div class="row q-gutter-md">
                      <q-chip :selected="perfil.yard_security" color="secondary" text-color="white" icon="home" label="Ambiente Seguro" />
                      <q-chip :selected="perfil.addressComprove" color="secondary" text-color="white" icon="verified" label="Endereço Comprovado" />
                    </div>
                  </div>

                  <div class="row justify-end q-mt-md">
                    <q-btn type="submit" color="primary" label="Salvar Endereço" :loading="btnLoading" no-caps class="text-weight-bold" />
                  </div>
                </q-form>
              </q-tab-panel>

            </q-tab-panels>
          </q-card>
        </div>

      </div>

    </div>

    <div v-else class="flex flex-center column q-py-xl" style="height: 50vh;">
      <q-spinner color="primary" size="4em" />
      <div class="text-h6 text-grey-7 q-mt-md">Carregando seus dados...</div>
    </div>
  </q-page>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useQuasar } from 'quasar'
    import { userRole, userName } from '../services/LoginService'
    import { buscarMeuPerfil, atualizarMeuPerfil, alterarMinhaSenha, alterarMeuUsuario } from '../services/ProfileService'

    const $q = useQuasar()
    const tab = ref('pessoal')
    const profileLoading = ref(true)
    const btnLoading = ref(false)

    const perfil = ref({
    id: null,
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    cpf: '',
    address: '',
    yard_security: false,
    addressComprove: false,
    position: ''
    })

    const carregarMeuPerfil = async () => {
    try {
        profileLoading.value = true
        const dados = await buscarMeuPerfil(userRole.value)
        
        perfil.value = {
        id: dados.register || dados.id,
        first_name: dados.first_name || '',
        last_name: dados.last_name || '',
        username: dados.username || userName.value,
        email: dados.email || '',
        cpf: dados.cpf || '',
        address: dados.address || '',
        yard_security: dados.yard_security || false,
        addressComprove: dados.addressComprove || false,
        position: dados.position || ''
        }
    } catch (error) {
        $q.notify({ type: 'negative', message: error.message, position: 'top' })
    } finally {
        profileLoading.value = false
    }
    }

    const salvarInformacoes = async () => {
    btnLoading.value = true
    try {
        const payload = {
        first_name: perfil.value.first_name,
        last_name: perfil.value.last_name,
        email: perfil.value.email
        }

        if (userRole.value === 'user') {
        payload.address = perfil.value.address
        }

        await atualizarMeuPerfil(userRole.value, perfil.value.id, payload)
        $q.notify({ type: 'positive', message: 'Perfil atualizado com sucesso!', position: 'top' })
    } catch (error) {
        $q.notify({ type: 'negative', message: error.message, position: 'top' })
    } finally {
        btnLoading.value = false
    }
    }

    const modalAlterarMeuUser = () => {
    $q.dialog({
        title: 'Alterar Nome de Usuário',
        message: 'Digite o seu novo nome de usuário (@):',
        prompt: { model: perfil.value.username, type: 'text' },
        cancel: true, persistent: true
    }).onOk(async (novoUsername) => {
        if (novoUsername && novoUsername !== perfil.value.username) {
        try {
            await alterarMeuUsuario(userRole.value, perfil.value.id, novoUsername)
            
            perfil.value.username = novoUsername
            localStorage.setItem('authUsername', novoUsername)
            userName.value = novoUsername
            $q.notify({ type: 'positive', message: 'Nome de usuário atualizado!', position: 'top' })
        } catch (error) {
            $q.notify({ type: 'negative', message: error.message, position: 'top' })
        }
        }
    })
    }

    const modalAlterarMinhaSenha = () => {
    $q.dialog({
        title: 'Alterar Senha',
        message: 'Digite a sua nova senha de acesso:',
        prompt: { model: '', type: 'password' },
        cancel: true, persistent: true
    }).onOk(async (novaSenha) => {
        if (novaSenha) {
        try {
            await alterarMinhaSenha(userRole.value, perfil.value.id, novaSenha)
            $q.notify({ type: 'positive', message: 'Sua senha foi alterada com sucesso!', position: 'top' })
        } catch (error) {
            $q.notify({ type: 'negative', message: error.message, position: 'top' })
        }
        }
    })
    }

    onMounted(carregarMeuPerfil)
</script>

<style scoped>
.bg-cream { background-color: #f7f5ef; }
.container-profile { max-width: 1100px; }
.card-profile-left, .card-profile-right { border-radius: 12px; }
</style>