<template>
  <div class="collapsible-table">
    <div v-if="title" class="collapsible-table_title">{{ title }}</div>

    <div class="collapsible-table_table-container" ref="collapsible_table_container">
      <table class="collapsible-table_table" ref="collapsible_table">
        <tbody v-if="mutableSections.length > 0" class="collapsible-table_table_body" ref="collapsible_table_body">
          <draggable class="draggable-sections" v-model="mutableSections" :handle="getHandle">
            <div v-for="section in mutableSections" :key="section.sectionKey" class="collapsible-table_table_body_row-group">
              <tr class="collapsible-table_table_body_row-header" :class="{'closed': section.isCollapsed}">
                <th class="collapsible-table_table_body_row-header_cell" @click="$emit('row-header-click', section)">
                  <span>
                    <h6>{{section.sectionTitle}}</h6>
                    <font-awesome-icon :icon="['fas', 'chevron-down']" class="section-chevron" :class="{'open': !section.isCollapsed}"></font-awesome-icon>
                  </span>
                </th>
                <th class="collapsible-table_table_body_row-header_grip" @dragstart="log">
                  <font-awesome-icon class="drag-grip-icon" :icon="['fas', 'grip-vertical']"></font-awesome-icon>
                </th>
              </tr>
              <div v-show="!section.isCollapsed" class="collapsible-table_table_body_collapsible">
                <tr v-for="row in section.rows" :key="row.senderId" class="collapsible-table_table_body_collapsible-row">
                  <td class="collapsible-filler-cell"></td>
                  <td class="collapsible-content-cell">
                    <div class="collapsible-row-title">
                      <h2 @click="$emit('collapsible-row-title-click', { row, section })">{{row.title}}</h2>
                      <p @click="$emit('collapsible-row-title-click', { row, section })" v-if="row.message">{{row.message}}</p>
                    </div>
                    <div class="collapsible-row-btns">
                      <button class="btn red_btn" v-for="btn in row.btns" :key="btn" @click="$emit('collapsible-row-btn-click', { btn, row, section })">{{btn}}</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="section.rows.length === 0" class="collapsible-table_table_body_collapsible-row">
                  <td class="collapsible-filler-cell"></td>
                  <td>No new notifications</td>
                </tr>
              </div>
            </div>
          </draggable>
        </tbody>
      </table>
      <div v-if="sections.length == 0" class="collapsible-table_table-empty">
        <h6>Oops!</h6>
        <p>No Data Found</p>
      </div>
    </div>
  </div>
</template>

<script src="./collapsible-table.ts"></script>
<style src="./collapsible-table.scss" lang="scss"></style>