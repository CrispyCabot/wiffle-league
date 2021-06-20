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
  </div>
</template>

<script src="./notifications.ts"></script>
<style src="./notifications.scss" lang="scss"></style>
