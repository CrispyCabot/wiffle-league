<template>
  <div class="notifications">
    <div class="notifications_table white_card_background">
      <collapsible-table 
        :title="'Notifications'"
        :sections="notificationSections"
      />
    </div>
  </div>
</template>

<script src="./notifications.ts"></script>
<style src="./notifications.scss" lang="scss"></style>
