<template>
  <div class="contact-modal white_card_background">
    <font-awesome-icon class="close-icon" :icon="['fas', 'times']" @click="$emit('close')"></font-awesome-icon>
    <div class="contact-modal_title">
      <h1>Contact</h1>
      <p>{{isSending ? 'to' : 'from'}}</p>
      <p v-if="player && player.firstname && player.lastname">{{player.firstname}} {{player.lastname}}</p>
    </div>

    <div class="contact-modal_message">
      <label for="message">Message</label>
      <textarea name="message" id="message" cols="30" rows="6" :disabled="messageOverride" v-model="message"></textarea>
    </div>
    <div v-if="!isSending" class="contact-modal_response">
      <label for="response">Response</label>
      <textarea name="response" id="response" cols="30" rows="6" v-model="response"></textarea>
    </div>

    <div class="contact-modal_btns">
      <button class="btn red_btn" :class="{'disabled': !canSend}" @click="sendContactForm">Send</button>
      <p @click="$emit('close')">Cancel</p>
    </div>
  </div>
</template>

<script src="./contact-modal.ts"></script>
<style src="./contact-modal.scss" lang="scss"></style>
