<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.page-container {
  background-color: rgba(255, 255, 255, 0);
}

.q-layout {

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
