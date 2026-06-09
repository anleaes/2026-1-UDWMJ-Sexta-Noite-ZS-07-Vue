<template>
  <q-page class="bg-cream q-pa-md q-pa-md-xl">
    <div class="container-animais mx-auto">
      
      <div class="row q-mb-lg">
        <q-input 
          v-model="searchQuery" 
          rounded 
          outlined 
          bg-color="white" 
          placeholder="Buscar por raça, nome, cidade..." 
          class="full-width search-input"
          @update:model-value="currentPage = 1" 
        />
      </div>

      <div class="row q-col-gutter-xl">
        
        <div class="col-12 col-md-3">
          <q-card class="shadow-2 no-border-radius q-pa-md">
                <div class="text-subtitle1 text-center text-weight-bold q-mb-md">Filtros</div>
                <q-separator class="q-mb-md" />

                <div v-if="isLoading" class="flex flex-center column q-py-xl">
                    <q-spinner color="primary" size="3em" />
                    <div class="text-caption text-grey-7 q-mt-md">Carregando filtros...</div>
                </div>

                <div v-else>
                    <div class="text-weight-bold q-mb-sm text-dark">Espécies</div>
                    <div class="q-gutter-y-xs q-mb-md">
                        <q-checkbox 
                            v-for="especie in especiesVisiveis" 
                            :key="especie" 
                            v-model="filtros.especies" 
                            :val="especie" 
                            :label="especie" 
                            color="primary" dense class="full-width" 
                        />
                        <div v-if="todasEspecies.length > 4"
                        class="text-primary text-caption cursor-pointer q-mt-xs"
                        @click="showAllEspecies = !showAllEspecies"
                        >
                            {{ showAllEspecies ? 'Ver menos' : 'Ver mais' }}
                        </div>
                    </div>

                    <div class="text-weight-bold q-mb-sm text-dark">Porte</div>
                    <div class="q-gutter-y-xs q-mb-md">
                        <q-checkbox v-model="filtros.porte" val="Pequeno" label="Pequeno" color="primary" dense class="full-width" />
                        <q-checkbox v-model="filtros.porte" val="Médio" label="Médio" color="primary" dense class="full-width" />
                        <q-checkbox v-model="filtros.porte" val="Grande" label="Grande" color="primary" dense class="full-width" />
                    </div>

                    <div class="text-weight-bold q-mb-sm text-dark">Sexo</div>
                    <div class="q-gutter-y-xs q-mb-md">
                        <q-checkbox v-model="filtros.sexo" val="Macho" label="Macho" color="primary" dense class="full-width" />
                        <q-checkbox v-model="filtros.sexo" val="Fêmea" label="Fêmea" color="primary" dense class="full-width" />
                    </div>

                    <div class="text-weight-bold q-mb-sm text-dark">Características</div>
                    <div class="q-gutter-y-xs q-mb-md">
                        <q-checkbox 
                            v-for="carac in caracteristicasVisiveis" 
                            :key="carac" 
                            v-model="filtros.caracteristicas" 
                            :val="carac" 
                            :label="carac" 
                            color="primary" dense class="full-width" 
                        />
                        <div v-if="todasCaracteristicas.length > 4"
                        class="text-primary text-caption cursor-pointer q-mt-xs"
                        @click="showAllCaracteristicas = !showAllCaracteristicas"
                        >
                            {{ showAllCaracteristicas ? 'Ver menos' : 'Ver mais' }}
                        </div>
                    </div>
                </div>
            </q-card>
        </div>

        <div class="col-12 col-md-9">
          
          <div class="text-caption q-mb-md" style="color: #d85a30;">
            Mostrando <strong>{{ listaFiltrada.length }}</strong> animais
          </div>

          <div v-if="isLoading" class="flex flex-center q-py-xl">
            <q-spinner color="primary" size="3em" />
          </div>

          <div v-else-if="listaFiltrada.length === 0" class="text-center text-grey-7 q-py-xl text-h6">
            Nenhum animal encontrado com esses critérios.
          </div>

          <div v-else class="row q-col-gutter-md">
            <div 
              v-for="pet in animaisPaginados" 
              :key="pet.id" 
              class="col-12 col-sm-6 col-md-4"
              style="height: 420px;"
            >
              <AnimalCard :animal="pet" />
            </div>
          </div>

          <div class="flex flex-center q-mt-xl" v-if="totalPages > 1">
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              color="primary"
              active-color="primary"
              active-text-color="white"
              direction-links
              boundary-numbers
              :max-pages="6"
            />
          </div>

        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
    import { ref, computed, onMounted, watch } from 'vue'
    import AnimalCard from 'components/AnimalCard.vue'
    import { buscarAnimaisBackEnd } from '../services/AnimalsService'

    const isLoading = ref(true)

    const searchQuery = ref('')
    const filtros = ref({
        especies: [],
        porte: [],
        sexo: [],
        caracteristicas: []
    })

    const animais = ref([])

    const currentPage = ref(1)
    const itemsPerPage = 6

    const todasEspecies = computed(() => {
        const especiesSet = new Set(animais.value.map(pet => pet.especie))
        return Array.from(especiesSet).filter(Boolean).sort()
    })

    const todasCaracteristicas = computed(() => {
        const caracSet = new Set()
        animais.value.forEach(pet => {
            if (pet.characteristics && Array.isArray(pet.characteristics)) {
                pet.characteristics.forEach(c => caracSet.add(c))
            }
        })
        return Array.from(caracSet).sort()
    })

    const showAllEspecies = ref(false)
    const showAllCaracteristicas = ref(false)

    const especiesVisiveis = computed(() => showAllEspecies.value ? todasEspecies.value : todasEspecies.value.slice(0, 4))
    const caracteristicasVisiveis = computed(() => showAllCaracteristicas.value ? todasCaracteristicas.value : todasCaracteristicas.value.slice(0, 4))

    onMounted(async () => {
        try {
            const dados = await buscarAnimaisBackEnd()
            animais.value = dados.filter(pet => pet.adotado === false)
        } catch (error) {
            console.error("Erro ao buscar animais", error)
        } finally {
            isLoading.value = false
        }
    })

    const listaFiltrada = computed(() => {
        let filtrados = animais.value

        if (searchQuery.value) {
            const termo = searchQuery.value.toLowerCase()
            filtrados = filtrados.filter(pet => 
                (pet.nome && pet.nome.toLowerCase().includes(termo)) || 
                (pet.raca && pet.raca.toLowerCase().includes(termo)) ||
                (pet.especie && pet.especie.toLowerCase().includes(termo))
            )
        }

        if (filtros.value.especies.length > 0) {
            filtrados = filtrados.filter(pet => filtros.value.especies.includes(pet.especie))
        }

        if (filtros.value.porte.length > 0) {
            filtrados = filtrados.filter(pet => filtros.value.porte.includes(pet.porte))
        }

        if (filtros.value.sexo.length > 0) {
            filtrados = filtrados.filter(pet => filtros.value.sexo.includes(pet.sexo))
        }

        if (filtros.value.caracteristicas.length > 0) {
            filtrados = filtrados.filter(pet => 
                filtros.value.caracteristicas.some(caracteristica => pet.characteristics.includes(caracteristica))
            )
        }

        return filtrados
    })

    const totalPages = computed(() => {
        return Math.ceil(listaFiltrada.value.length / itemsPerPage)
    })

    const animaisPaginados = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        
        return listaFiltrada.value.slice(startIndex, endIndex)
    })

    watch([searchQuery, filtros], () => {
        currentPage.value = 1
    }, { deep: true })
</script>

<style scoped>
    .bg-cream { 
        background-color: #f7f5ef; 
    }
    .container-animais { 
        max-width: 1200px; 
    }
    :deep(.search-input .q-field__control) {
        border-radius: 30px !important;
        padding-right: 4px;
    }
</style>