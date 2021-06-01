<template>
  <div class="grid-table">
    <div v-if="title" class="grid-table_title">{{ title }}</div>

    <div class="grid-table_table-container">
      <div v-if="label" class="grid-table_label">{{ label }}</div>
      <table class="grid-table_table">
        <thead v-if="hasHeader" class="grid-table_table_head">
          <th v-for="column in columns" :key="column.columnLabel">{{column.columnLabel}}</th>
        </thead>
        <tbody class="grid-table_table_body">
          <tr v-for="row in rows" :key="row.name" class="grid-table_table_body_row">
            <td v-for="(col, key, index) in row"
              :key="col"
              class="grid-table_table_body_row_cell"
              :class="{
                'numeric': col.type === 'numeric',
                'date': col.type === 'date',
                'string': col.type === 'string'
              }"
              :style="{'max-width': columns[index].maxWidth}"
            >{{col.text}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="hasPagination" class="grid-table_pagination">
      <pagination
        :totalItemCount="rowsCount"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        :hasSizeSelector="hasSizeSelector"
        @page-index-change="$emit('page-index-change', $event)"
        @page-size-change="$emit('page-size-change', $event)"
      />
    </div>
  </div>
</template>

<script src="./grid-table.ts"></script>
<style src="./grid-table.scss" lang="scss"></style>