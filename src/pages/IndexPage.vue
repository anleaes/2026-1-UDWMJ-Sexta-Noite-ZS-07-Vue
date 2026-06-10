<template>
  <q-page>
    <section class="bg-secondary q-py-xl">
      <div class="container row items-center justify-center q-px-md q-mx-auto" style="max-width: 1600px;">
        <div class="col-12 col-md-8">
          <h1 class="text-h4 text-weight-bold q-mb-md text-dark">Encontre seu melhor amigo aqui</h1>
          <p class="text-h6 q-mb-lg text-grey" style="opacity: 0.9">
            Temos diversos animais aguardando um lar cheio de amor.<br>
            Adotar é um ato de amor que transforma duas vidas.
          </p>
        </div>
      </div>
    </section>

    <!-- Meta do mês -->
    <div class="bg-primary q-py-lg">
      <div class="q-px-md q-mx-auto" style="max-width: 1600px;">
        <div class="row items-center q-gutter-md">
          <q-icon name="emoji_events" color="white" size="36px" />
          <div class="col">
            <div class="text-white text-weight-bold text-h6">
              Meta de adoções de {{ mesAtual }}
            </div>
            <div class="text-white q-mt-xs" style="opacity: 0.85; font-size: 13px;">
              {{ adotadosNoMes }} adotados · {{ faltam }} faltando para a meta de {{ meta }}
            </div>
            <q-linear-progress
              :value="progresso"
              color="white"
              track-color="orange-3"
              rounded
              size="12px"
              class="q-mt-sm"
              style="max-width: 500px;"
            />
          </div>
          <div class="text-white text-h4 text-weight-bold q-pr-md">
            {{ adotadosNoMes }}/{{ meta }}
          </div>
        </div>
      </div>
    </div>

    <div class="q-py-xl bg-grey-1">
      <div class="row items-center q-mb-lg q-px-md q-px-md-xl q-mx-auto" style="max-width: 1600px;">
        <div class="text-h5 text-weight-bold text-dark border-left-primary q-pl-md">
          Em Destaque
        </div>
        <q-space />
        <q-btn flat @click="$router.push('/animais')" color="primary" label="Ver todos" icon-right="chevron_right" no-caps class="gt-xs" />
        <q-btn flat round color="primary" icon="chevron_right" class="lt-sm" />
      </div>

      <div class="row no-wrap q-gutter-md overflow-auto q-pb-md hide-scrollbar q-pl-md q-pl-md-xl q-mx-auto" style="max-width: 1600px;">
        <div
          v-for="pet in listaAnimais"
          :key="pet.id"
          class="col-auto"
          style="width: 250px; height: 400px;"
        >
          <AnimalCard :animal="pet" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AnimalCard from 'components/AnimalCard.vue'
import { buscarAnimais } from '../services/AnimalsService'

const listaAnimais = ref([])
const adotadosNoMes = ref(0)
const meta = ref(parseInt(localStorage.getItem('meta_adocoes')) || 15)

const mesAtual = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
const faltam = computed(() => Math.max(meta.value - adotadosNoMes.value, 0))
const progresso = computed(() => Math.min(adotadosNoMes.value / meta.value, 1))

onMounted(async () => {
  const animais = await buscarAnimais()
  listaAnimais.value = animais.filter(a => !a.adotado).slice(0, 5)
  adotadosNoMes.value = animais.filter(a => a.adotado).length
})
</script>

<style scoped>
.border-left-primary {
  border-left: 5px solid #d85a30;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>