<template>
  <q-layout view="hHh lpR fff">
    <HeaderApp />

    <q-page-container>
      <router-view />
    </q-page-container>

    <FooterApp />
  </q-layout>
</template>

<script setup>
  import HeaderApp from 'components/HeaderApp.vue'
  import FooterApp from 'components/FooterApp.vue'
</script>