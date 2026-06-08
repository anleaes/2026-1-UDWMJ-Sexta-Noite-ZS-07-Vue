<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar class="bg-primary" style="height: 90px">
        <q-space />
        <q-toolbar-title style="color: #444441">
          <q-icon name="favorite" size="lg" style="color: #c60102" />
          Adotar&Amar
        </q-toolbar-title>

        <q-space />

        <q-btn no-caps style="color: #444441" stretch flat label="Animais" />
        <q-btn no-caps style="color: #444441" stretch flat label="Como adotar?" />
        <q-btn no-caps style="color: #444441" stretch flat label="Sobre" />
        <q-btn no-caps style="color: #444441" stretch flat label="Contato" />
        <q-btn style="color: #444441" stretch flat icon="account_circle" />
        <q-space />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup></script>
