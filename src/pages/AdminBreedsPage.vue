<template>
  <q-page class="bg-cream q-pa-md q-pa-md-xl">
    <div class="container-admin q-mx-auto" style="max-width: 800px;">
      
      <div class="text-h4 text-weight-bold text-dark q-mb-lg border-left-primary q-pl-md">
        Gerenciamento de Raças
      </div>

      <q-card class="shadow-2 q-mb-xl bg-white q-pa-md">
        <q-card-section>
          <div class="text-h6 text-weight-bold q-mb-md">Cadastrar Nova Raça</div>
          
          <q-form @submit.prevent="salvarNovaRaca" class="q-gutter-y-md">
            <div class="row q-col-gutter-md">
              
              <div class="col-12 col-md-6">
                <q-input 
                  v-model="novaRaca.name" 
                  label="Nome da Raça *" 
                  outlined dense 
                  lazy-rules 
                  :rules="[val => !!val || 'Obrigatório']" 
                />
              </div>

              <div class="col-12 col-md-6">
                <q-select 
                  v-model="novaRaca.specie" 
                  :options="listaEspecies" 
                  option-value="id" 
                  option-label="name" 
                  emit-value 
                  map-options
                  label="Espécie Pertencente *" 
                  outlined dense
                  lazy-rules 
                  :rules="[val => !!val || 'Obrigatório']" 
                />
              </div>

            </div>

            <div class="row justify-end q-mt-md">
              <q-btn type="submit" color="primary" label="Salvar Raça" icon="save" :loading="loadingBtn" no-caps />
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <q-card class="shadow-2 bg-white">
        <q-card-section>
          <div class="text-h6 text-weight-bold q-mb-md">Raças Cadastradas no Sistema</div>
          
          <div v-if="listaEspecies.length === 0" class="text-grey text-center q-pa-md">
            A carregar dados...
          </div>

          <q-list v-else bordered class="rounded-borders">
            <q-expansion-item
              v-for="especie in listaEspecies"
              :key="especie.id"
              expand-separator
              :label="especie.name"
              :caption="getRacasPorEspecie(especie.id).length + ' raça(s) cadastrada(s)'"
              header-class="text-weight-bold text-dark"
            >
              
              <q-list separator class="q-pl-lg q-pr-md q-pb-sm bg-grey-1">
                <q-item v-for="raca in getRacasPorEspecie(especie.id)" :key="raca.id" dense class="q-py-sm">
                  <q-item-section avatar>
                    <q-icon name="pets" color="primary" size="sm" />
                  </q-item-section>
                  
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ raca.name }}</q-item-label>
                  </q-item-section>
                </q-item>
                
                <q-item v-if="getRacasPorEspecie(especie.id).length === 0" dense>
                  <q-item-section class="text-grey text-italic">
                    Nenhuma raça cadastrada para esta espécie.
                  </q-item-section>
                </q-item>
              </q-list>

            </q-expansion-item>
          </q-list>

        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { buscarRacas, cadastrarRaca, buscarEspecies } from '../services/BreedService'

const $q = useQuasar()
const loadingBtn = ref(false)

const listaRacas = ref([])
const listaEspecies = ref([])

const novaRaca = ref({
  name: '',
  specie: null
})

const carregarDados = async () => {
  try {
    listaRacas.value = await buscarRacas()
    
    listaEspecies.value = await buscarEspecies()
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar dados: ' + error.message, position: 'top' })
  }
}

const salvarNovaRaca = async () => {
  loadingBtn.value = true
  try {
    await cadastrarRaca(novaRaca.value)
    
    $q.notify({ type: 'positive', message: 'Raça cadastrada com sucesso!', position: 'top' })
    
    novaRaca.value.name = ''
    novaRaca.value.specie = null
    
    await carregarDados()
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message, position: 'top' })
  } finally {
    loadingBtn.value = false
  }
}

const getRacasPorEspecie = (idEspecie) => {
  return listaRacas.value.filter(raca => raca.specie === idEspecie)
}

onMounted(() => {
  carregarDados()
})

onMounted(() => {
  carregarDados()
})
</script>

<style scoped>
.bg-cream { background-color: #f7f5ef; }
.border-left-primary { border-left: 5px solid #d85a30; }
</style>