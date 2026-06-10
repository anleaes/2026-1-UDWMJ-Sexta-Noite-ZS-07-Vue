<template>
  <q-page class="bg-cream q-pa-md q-pa-md-xl">
    <div class="container-form q-mx-auto">
      <q-card class="shadow-2 no-border-radius q-pa-lg">

        <div class="text-h5 text-weight-bold text-dark q-mb-xs">
          Solicitação de Adoção
        </div>

        <div class="text-caption q-mb-lg" style="color: #d85a30;">
          Preencha os dados abaixo para solicitar a adoção.
        </div>

        <q-form @submit="enviarAdocao" class="q-gutter-md">

          <div class="section-title">Dados pessoais</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="form.full_name" label="Nome completo" outlined rounded bg-color="white" :rules="[val => !!val || 'Campo obrigatório']"
 />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="form.cpf" label="CPF" outlined rounded bg-color="white" maxlength="11" :rules="[val => !!val || 'Campo obrigatório']" />
            </div>

            <div class="col-12 col-md-4">
              <q-input v-model="form.birth_date" label="Data de nascimento" outlined rounded bg-color="white" mask="##/##/####"  :rules="[val => !!val || 'Campo obrigatório']"
/>
            </div>

            <div class="col-12 col-md-4">
              <q-input v-model="form.phone" label="Telefone" outlined rounded bg-color="white" maxlength="11" :rules="[val => !!val || 'Campo obrigatório']" />
            </div>

            <div class="col-12 col-md-4">
              <q-input v-model="form.email" label="Email" outlined rounded bg-color="white" :rules="[v => !!v || 'Campo obrigatório']"/>
            </div>

            <div class="col-12">
              <q-input v-model="form.occupation" label="Ocupação" outlined rounded bg-color="white" />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="section-title">Endereço</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <q-input v-model="form.cep" label="CEP" outlined rounded bg-color="white" maxlength="8" :rules="[v => !!v || 'Campo obrigatório']" />
            </div>

            <div class="col-12 col-md-7">
              <q-input v-model="form.street" label="Rua" outlined rounded bg-color="white" :rules="[v => !!v || 'Campo obrigatório']" />
            </div>

            <div class="col-12 col-md-2">
              <q-input v-model="form.number" label="Número" outlined rounded bg-color="white" :rules="[v => !!v || 'Campo obrigatório']" />
            </div>

            <div class="col-12 col-md-4">
              <q-input v-model="form.complement" label="Complemento" outlined rounded bg-color="white" />
            </div>

            <div class="col-12 col-md-4">
              <q-input v-model="form.neighborhood" label="Bairro" outlined rounded bg-color="white" :rules="[v => !!v || 'Campo obrigatório']" />
            </div>

            <div class="col-12 col-md-3">
              <q-input v-model="form.city" label="Cidade" outlined rounded bg-color="white" :rules="[v => !!v || 'Campo obrigatório']" />
            </div>

            <div class="col-12 col-md-1">
              <q-input v-model="form.state" label="UF" outlined rounded bg-color="white" maxlength="2" :rules="[v => !!v || 'Campo obrigatório']" />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="section-title">Moradia</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.housing_type"
                :options="['Casa', 'Apartamento', 'Outro']"
                label="Tipo de moradia"
                outlined
                rounded
                bg-color="white"
                :rules="[v => !!v || 'Campo obrigatório']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.ownership_type"
                :options="['Própria', 'Alugada', 'Cedida', 'Outro']"
                label="Tipo de posse"
                outlined
                rounded
                bg-color="white"
                :rules="[v => !!v || 'Campo obrigatório']"
              />
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model.number="form.residents_count"
                label="Quantidade de moradores"
                type="number"
                outlined
                rounded
                bg-color="white"
                :rules="[v => !!v || 'Campo obrigatório']"
              />
            </div>

            <div class="col-12">
              <q-checkbox v-model="form.has_yard" label="Possui pátio/quintal?" color="primary" />
              <q-checkbox v-model="form.yard_secured" label="O pátio/quintal é seguro?" color="primary" />
              <q-checkbox v-model="form.has_children" label="Possui crianças em casa?" color="primary" />
            </div>

            <div v-if="form.has_children" class="col-12">
              <q-input v-model="form.children_ages" label="Idade das crianças" outlined rounded bg-color="white" />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="section-title">Experiência com animais</div>

          <q-checkbox v-model="form.had_pets_before" label="Já teve pets antes?" color="primary" />
          <q-checkbox v-model="form.currently_has_pets" label="Possui pets atualmente?" color="primary" />

          <q-input
            v-if="form.currently_has_pets"
            v-model="form.current_pets_description"
            label="Descreva seus pets atuais"
            type="textarea"
            outlined
            rounded
            bg-color="white"
          />

          <q-separator class="q-my-md" />

          <div class="section-title">Motivação</div>

          <q-input
            v-model="form.reason_for_adoption"
            label="Por que deseja adotar?"
            type="textarea"
            outlined
            rounded
            bg-color="white"
            :rules="[v => !!v || 'Campo obrigatório']"
          />

          <q-input
            v-model="form.caretaker"
            label="Quem será responsável pelo animal?"
            outlined
            rounded
            bg-color="white"
            :rules="[v => !!v || 'Campo obrigatório']"
          />

          <div class="row justify-end q-mt-lg">
            <q-btn
              label="Enviar solicitação"
              type="submit"
              color="primary"
              text-color="white"
              rounded
              unelevated
              no-caps
              class="q-px-xl q-py-sm"
              :loading="loading"
            />
          </div>

        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'

const route = useRoute()
const router = useRouter()

const loading = ref(false)

const form = ref({
  animal: route.params.id,

  full_name: '',
  cpf: '',
  birth_date: '',
  phone: '',
  email: '',
  occupation: '',

  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',

  housing_type: '',
  ownership_type: '',
  has_yard: false,
  yard_secured: false,
  residents_count: 1,
  has_children: false,
  children_ages: '',

  had_pets_before: false,
  currently_has_pets: false,
  current_pets_description: '',

  reason_for_adoption: '',
  caretaker: ''
})

async function enviarAdocao () {
  loading.value = true

  try {
    const response = await fetch('http://127.0.0.1:8000/adocoes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(form.value)
    })

    if (!response.ok) {
      const erro = await response.json()
      console.log(erro)
      throw new Error('Erro ao enviar solicitação')
    }

    Notify.create({
      type: 'positive',
      message: 'Solicitação enviada com sucesso!'
    })

    router.push('/minhas-solicitacoes')
  } catch (error) {
    console.error(error)

    Notify.create({
      type: 'negative',
      message: 'Erro ao enviar solicitação.'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-cream {
  background-color: #f7f5ef;
}

.container-form {
  max-width: 1100px;
}

.no-border-radius {
  border-radius: 8px;
}

.section-title {
  color: #d85a30;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
}

:deep(.q-field__control) {
  border-radius: 30px !important;
}
</style>