<template>
  <div class="app-container">
    <div v-if="getGlobalToastIsShowing" class="global-toast">
      <Toast :message="getGlobalToastMessage" :type="getGlobalToastType" :duration="getGlobalToastDuration" :isShowing="getGlobalToastIsShowing" @close="closingGlobalToast" />
    </div>
    <Navbar />
    <div class="router-view">
      <router-view/>
    </div>
    <Footer />
  </div>
</template>

<script src="./app.ts"></script>
<style src="./app.scss" lang="scss"></style>
