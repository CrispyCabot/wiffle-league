<template>
  <div class="profile">
    <div v-if="!getIsLoggedIn" class="profile_not_logged_in white_card_background ">
      <p v-if="!getIsLoggedIn || getLoggedInPlayer == {}" @click="redirect('/login')">Sign in to view your profile</p>
    </div>
    <div v-if="getIsLoggedIn" class="profile-stats-table white_card_background ">

      <h1 v-if="getLoggedInPlayer && getLoggedInPlayer.firstname" class="profile-stats-table_firstname">{{getLoggedInPlayer.firstname}} {{getLoggedInPlayer.lastname}}</h1>
      <p v-if="getLoggedInPlayer && getLoggedInPlayer.nickname" class="profile-stats-table_nickname">
        <span>a.k.a</span> <br> {{getLoggedInPlayer.nickname}}
      </p>

      <grid-table
        class="profile-stats-table_table"
        :columns="columns"
        :rows="row"
        :rowsCount="1"
        :hasHeader="columns.length > 0"
        :label="'Overall Stats'"
        :hasPagination="false"
        :hasSizeSelector="false"
        :hoverable="false"
        @row-click="playerClick"
      ></grid-table>

      <div class="player_leagues-info" v-if="leagueRows && leagueRows.length > 0">
        <p class="player_leagues-info_label">League Standings</p>
        <row-card v-for="row in leagueRows" :key="row.id.text" :row="row" :columns="leagueColumns" @row-click="handleLeagueClick"/>
      </div>

      <content-dropdown class="profile-stats-table_settings" :label="'Settings'" :iconClass="'fas cog'">
        <div class="profile-stats-table_settings_grid">
          <div v-for="field in fields" :key="field.name" class="profile-stats-table_settings_grid_field" :class="{'full-width': field.type == 'radio-group'}">
            <div v-if="field.type == 'input' && isFieldShown(field)"
              class="profile-stats-table_settings_grid_field_input"
              :class="{'invalid': 
                (!validEmail && field.name == 'email') ||
                (!validPassword && field.name == 'password') ||
                (!confirmPassMatch && field.name == 'confirm') ||
                (!validPhone && field.name == 'phone') ||
                (field.isRequired && field.value == '')
              }"
            >
              <label :for="field.name">{{ field.placeholder }}<span>{{ field.isRequired ? '*' : '' }}</span></label>
              <input class="default-input field-input"
                :disabled="!isSettingsEditing"
                :type="'text'"
                :placeholder="field.placeholder"
                :name="field.name"
                v-model="field.value"
                @change="formatPhone($event, field.name == 'phone')"
              >
            </div>
            <div v-else-if="field.type == 'radio' && isFieldShown(field)" class="profile-stats-table_settings_grid_field_toggle">
              <label>{{ field.placeholder }}<span>{{ field.isRequired ? '*' : '' }}</span></label>
              <radio-slider :disabled="!isSettingsEditing" :showLabel="false" :values="[true, false]" :selectedValue="field.value" @value-change="changeRadioValue($event, field)" />
            </div>
            <div v-else-if="field.type == 'radio-group' && isFieldShown(field)" class="profile-stats-table_settings_grid_field_radio-group">
              <radio-button-group :class="{'profile-stats-table_settings_grid_field_radio-group-disabled': !isSettingsEditing}" :buttons="genderRadioButtons" :selectedRadioButton="field.value" @radio-button-change="setGender" />
            </div>
          </div>
        </div>
        <button v-if="!isSettingsEditing" class="btn red_btn profile-stats-table_settings_btn-edit" @click="editSettings">Edit</button>
        <button v-else-if="isSettingsEditing" class="btn red_btn profile-stats-table_settings_btn-save" :class="{'disabled': !isSaveEnabled}" @click="saveSettings">Save</button>
        <p v-if="isSettingsEditing" class="profile-stats-table_settings_btn-cancel"  @click="cancelSettings">Cancel</p>
      </content-dropdown>
    </div>

  </div>
</template>

<script src="./profile.ts"></script>
<style src="./profile.scss" lang="scss"></style>