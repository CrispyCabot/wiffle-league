<template>
  <div class="app-container">
    <div v-if="getGlobalToastIsShowing" class="global-toast">
      <Toast
        :message="getGlobalToastMessage"
        :type="getGlobalToastType"
        :duration="getGlobalToastDuration"
        :isShowing="getGlobalToastIsShowing"
        :key="getGlobalToastIsShowingOverride"
        @close="closingGlobalToast"
      />
    </div>
    <Navbar />
    <div ref="router_view" class="router-view" :class="{'mobile-router-view': isMobileView, 'not-max-viewport-height-router-view': !isMaxViewportHeight }">
      <router-view/>
    </div>

    <inline-svg class="background-svg" :src="backgroundSvg"></inline-svg>
    
    <span ref="footer_element">
      <Footer :class="{'max-viewport-height-footer': isMaxViewportHeight}"/>
    </span>
  </div>
</template>

<script src="./app.ts"></script>
<style src="./app.scss" lang="scss"></style>
