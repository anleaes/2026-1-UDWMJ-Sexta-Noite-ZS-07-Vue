<template>
  <q-page class="bg-creme q-pa-md q-pa-md-xl">
    <div class="q-mx-auto" style="max-width: 1600px;">
      
      <div class="q-mb-md">
        <q-btn flat icon="arrow_back" label="Voltar" color="grey-9" no-caps class="q-px-none" @click="$router.back()" />
      </div>

      <div class="row q-col-gutter-lg items-stretch">
        
        <div class="col-12 col-md-6" style="max-height: 700px;">
          <q-img 
            :src="animal.imagem" class="full-height"
            style="border-radius: 8px; min-height: 400px;  object-fit: cover;"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-card class="q-pa-lg no-shadow full-height column justify-between" bordered style="border-radius: 8px;">
            
            <div>
              <div class="text-h4 text-weight-bold text-grey-9">{{ animal.nome }}</div> <div class="text-subtitle1 text-grey-7 q-mb-md">
                {{ animal.raca }} • {{ animal.especie }} </div>

              <q-separator class="q-mb-md" />

              <div class="row q-col-gutter-y-lg q-col-gutter-x-sm q-mb-lg">
                <div class="col-4">
                  <div class="text-caption text-grey-7 text-uppercase">Sexo</div>
                  <div class="text-body2 text-weight-medium text-grey-9">
                    <q-icon :name="animal.sexo === 'Macho' ? 'male' : 'female'" size="16px" />
                    {{ animal.sexo }} </div>
                </div>

                <div class="col-4">
                  <div class="text-caption text-grey-7 text-uppercase">Porte</div>
                  <div class="text-body2 text-weight-medium text-grey-9">
                    {{ animal.porte }} </div>
                </div>

                <div class="col-4">
                  <div class="text-caption text-grey-7 text-uppercase">Cor</div>
                  <div class="text-body2 text-weight-medium text-grey-9">{{ animal.cor }}</div>
                </div>

                <div class="col-4">
                  <div class="text-caption text-grey-7 text-uppercase">Castrado</div>
                  <div class="text-body2 text-weight-medium text-grey-9">
                    <q-icon :name="animal.castrado ? 'check_circle' : 'cancel'" :color="animal.castrado ? 'black' : 'grey'" size="16px" class="q-mr-xs" />
                    {{ animal.castrado ? 'Sim' : 'Não' }} </div>
                </div>

                <div class="col-4">
                  <div class="text-caption text-grey-7 text-uppercase">Idade</div>
                  <div class="text-body2 text-weight-medium text-grey-9">
                    {{ animal.idade }} </div>
                </div>

                <div class="col-4">
                  <div class="text-caption text-grey-7 text-uppercase">Tempo no Abrigo</div>
                  <div class="text-body2 text-weight-medium text-grey-9">{{ animal.tempo_abrigo }}</div>
                </div>
              </div>

              <div class="q-mb-md">
                <div class="text-caption text-weight-bold text-grey-7 text-uppercase q-mb-sm">Características</div>
                <div class="row q-gutter-sm">
                  <q-chip 
                    v-for="char in animal.characteristics" :key="char" outlined color="secondary"
                    size="sm"
                    class="text-weight-medium"
                  >
                    {{ char }}
                  </q-chip>
                </div>
              </div>

              <div class="q-mb-lg">
                <div class="text-caption text-weight-bold text-grey-7 text-uppercase q-mb-sm">
                  Histórico de Vacinas
                </div>
                
                <div v-if="animal.vacinas && animal.vacinas.length > 0">
                  <q-list bordered separator class="rounded-borders bg-white">
                    
                    <q-item v-for="(vacina, index) in animal.vacinas" :key="index" class="q-py-md">
                      
                      <q-item-section avatar>
                        <q-avatar color="green-2" text-color="positive" icon="vaccines" />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="text-weight-bold text-grey-9">
                          {{ vacina.nome }}
                        </q-item-label>
                        
                        <q-item-label caption lines="3" class="text-grey-7" style="font-size: 11px;">
                          {{ vacina.descricao }}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label caption class="text-weight-medium text-grey-8">
                          {{ vacina.data }}
                        </q-item-label>
                      </q-item-section>

                    </q-item>
                    
                  </q-list>
                </div>
                
                <div v-else class="text-body2 text-grey-6">
                  Nenhuma vacina registrada.
                </div>
              </div>

            </div>

            <q-btn color="deep-orange-6" class="full-width q-py-sm text-weight-bold" label="Adotar" rounded unelevated no-caps size="lg" />
          </q-card>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { buscarAnimalPorId } from 'src/services/AnimalsService' // Importando a nova função mapeada

const route = useRoute()
const animal = ref({})

onMounted(async () => {
  const id = route.params.id
  if (id) {
    const dados = await buscarAnimalPorId(id)
    if (dados) {
      animal.value = dados
    }
  }
})

</script>

<style scoped>
    .bg-cream { 
        background-color: #f7f5ef; 
    }
    .container-animais { 
        max-width: 1600px; 
    }
    :deep(.search-input .q-field__control) {
        border-radius: 30px !important;
        padding-right: 4px;
    }
</style>