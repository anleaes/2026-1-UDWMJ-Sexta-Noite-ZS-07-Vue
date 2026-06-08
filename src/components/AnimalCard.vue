<template>
  <q-card class="my-card column shadow-5 no-border-radius overflow-hidden" bordered>
    <q-img :src="animal.imagem" :ratio="1" class="cursor-pointer">
      <div class="absolute-bottom text-subtitle2 text-center">
        {{ animal.nome }}
      </div>
    </q-img>

    <q-card-section class="q-pa-md">
      <div class="row no-wrap items-center">
        <div class="col text-h6 ellipsis text-primary">{{ animal.raca }}</div>
      </div>
      <div class="text-subtitle2 text-grey-8">{{ animal.sexo }} • {{ animal.idade }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none q-pb-lg text-caption text-grey-7">
      <div class="row q-gutter-xs">
        <q-badge v-for="tag in animal.tags" :key="tag" outline color="secondary" :label="tag" />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="center" class="q-pa-md">
      <q-btn 
        unelevated 
        rounded 
        color="primary" 
        label="Ver Mais" 
        class="full-width" 
        no-caps 
      />
    </q-card-actions>
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
</style>