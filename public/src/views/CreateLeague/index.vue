<template>
  <div class="create-league">
    <h1 class="home site-title">Create League</h1>
    <p v-if="!getIsLoggedIn && getLoggedInPlayer == {}" class="home not-logged-in-text">Please login before creating a league</p>
    <div class="create-league_fields">
      <div class="create-league_fields_field" v-for="field in fields" :key="field.name">
        <div v-if="field.name !== 'gender'"
          class="login-input"
          :class="{
            'extra-margin-top': field.value !== '' || field.name == 'startDate' || field.name == 'endDate' || field.name == 'deadlineDate',
            'error': (field.name == 'startDate' && !isStartDateValid) ||
              (field.name == 'endDate' && !isEndDateValid) ||
              (field.name == 'deadlineDate' && !isDeadlineDateValid)
          }"
        >
          <transition name="slide">
            <label v-if="field.value !== '' || field.name == 'startDate' || field.name == 'endDate' || field.name == 'deadlineDate'"
              class="create-league_fields_field_label"
              :for="field.name"
            >{{field.label}}</label>
          </transition>
          <input v-if="field.name != 'other'" 
            class="default-input"
            :type="field.name == 'startDate' || field.name == 'endDate' || field.name == 'deadlineDate' ? 'date'
            : field.name == 'maxPlayers' || field.name == 'numGames' || field.name == 'teamSize' ? 'number' : 'text'"
            :placeholder="field.placeholder"
            :name="field.name"
            v-model="field.value"
          >
          <textarea v-else
            class="default-input"
            :placeholder="field.placeholder"
            :name="field.name"
            v-model="field.value"
          ></textarea>
          <span class="login-input_required" v-if="field.isRequired">*</span>
          <span class="login-input_error startDate-error" v-if="(field.name == 'startDate' && !isStartDateValid)">Start Date must be before the End Date</span>
          <span class="login-input_error endDate-error" v-else-if="(field.name == 'endDate' && !isEndDateValid)">End Date must be after the Start Date</span>
          <span class="login-input_error deadlineDate-error" v-else-if="(field.name == 'deadlineDate' && !isDeadlineDateValid)">Deadline Date must be before the Start Date</span>
        </div>
        <radio-button-group v-else-if="field.name == 'gender'" class="create-league_fields_field" :buttons="genderRadioButtons" :selectedRadioButton="field.value" @radio-button-change="setGender" />
      </div>
    </div>

    <button class="btn red_btn" :class="{'disabled': !enabledCreateButton}" @click="createLeagueClick">Create</button>
  </div>
</template>

<script src="./create-league.ts"></script>
<style src="./create-league.scss" lang="scss"></style>