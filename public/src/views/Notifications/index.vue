<template>
  <div class="notifications">
    <div class="notifications_table white_card_background">
      <collapsible-table 
        :title="'Notifications'"
        :sections="orderedNotificationSections"
        @row-header-click="handleRowHeaderClick"
        @sections-mutated="mutatedSections"
        @collapsible-row-title-click="handleRowTitleClick"
        @collapsible-row-btn-click="handleRowBtnClick"
      />
    </div>

    <div v-if="contactModalIsOpen" class="contact-modal-container">
      <contact-modal
        :player="contactPlayer"
        :isSending="false"
        :messageOverride="contactPlayerMessage"
        @close="closeContactModal"
        @send="sendContactNotification"
        v-click-away="closeContactModal"
      />
    </div>
  </div>
</template>

<script src="./notifications.ts"></script>
<style src="./notifications.scss" lang="scss"></style>
