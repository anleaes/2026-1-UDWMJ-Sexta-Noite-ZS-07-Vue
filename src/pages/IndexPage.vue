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

    <div class="q-py-xl bg-grey-1">
      
      <div class="row items-center q-mb-lg q-px-md q-px-md-xl q-mx-auto" style="max-width: 1600px;">
        <div class="text-h5 text-weight-bold text-dark border-left-primary q-pl-md">
          Em Destaque
        </div>
        <q-space />
        <q-btn flat color="primary" label="Ver todos" icon-right="chevron_right" no-caps class="gt-xs" />
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
  import { ref, onMounted } from 'vue'
  import AnimalCard from 'components/AnimalCard.vue'
  import { buscarAnimais } from '../services/AnimalsService'

  const listaAnimais = ref([])

  onMounted(async () => {
    const animais = await buscarAnimais()
    listaAnimais.value = (animais.filter(animal => animal.adotado === false)).slice(0, 5)
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