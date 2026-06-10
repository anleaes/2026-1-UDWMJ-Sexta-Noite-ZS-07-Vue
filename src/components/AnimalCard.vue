<template>
  <q-card class="my-card column shadow-5 no-border-radius overflow-hidden" bordered>
    
    <q-img :src="animal.imagem" class="cursor-pointer animal-img">
      <div class="absolute-bottom text-subtitle2 text-center">
        {{ animal.nome }}
      </div>
    </q-img>

    <div class="col column justify-between">
      
      <div>
        <q-card-section class="q-pa-md q-pb-xs">
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis text-primary" :title="animal.raca + ' - ' + animal.especie">
              {{ animal.raca }} - {{animal.especie}}
            </div>
          </div>
          <div class="text-subtitle2 text-grey-8">{{ animal.sexo }} • {{ animal.idade }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-pb-sm text-caption text-grey-7">
          <div class="row q-gutter-xs">
            <q-badge v-for="tag in animal.characteristics.slice(0,2)" :key="tag" outline color="secondary" :label="tag" />
            <div v-if="animal.characteristics.length > 2">•••</div>
          </div>
        </q-card-section>
      </div>

      <div>
        <q-separator />
        <q-card-actions align="center" class="q-pa-sm">
          <q-btn 
            unelevated 
            rounded 
            color="primary" 
            label="Ver Mais"
            style="width: 70%; margin: 0;"
            no-caps
            :to="`/animal/${animal.id}`"
          />
        </q-card-actions>
      </div>

    </div>
  </q-card>
</template>

<script setup>
  defineProps({
    animal: {
      type: Object,
      required: true
    }
  })
</script>

<style scoped>
  .my-card {
    width: 100%;
    height: 100%;
    transition: transform 0.3s;
  }
  .my-card:hover {
    transform: translateY(-5px);
  }

  .animal-img {
    height: 50%;
    width: 100%;
  }
</style>