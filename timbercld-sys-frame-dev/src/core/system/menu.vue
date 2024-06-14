/**
 * Copyright (C) 2022-2023 Timber Chain Cloud (TimberCLD). All Rights Reserved.
 *
 * @author Jianglong
 * @email jianglong@timbercld.com
 * @site https://www.timbercld.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
  <el-card shadow="never" class="tccui-card--fill">
    <div class="system__menu">
      <el-form :inline="true" :model="hooksData.dataForm" @keyup.enter="getDataList()">
        <el-form-item>
          <el-button
            v-if="hasPermission('system:menu:save')"
            type="primary"
            @click="showEditDialogHandle()"
            >{{ t('add') }}</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        v-loading="hooksData.dataListLoading"
        :data="hooksData.dataList"
        row-key="id"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :label="t('index')"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>

        <el-table-column
          prop="name"
          :label="t('menu.name')"
          header-align="center"
          min-width="150"
        ></el-table-column>
        <el-table-column prop="icon" :label="t('menu.icon')" header-align="center" align="center">
          <template #default="scope">
            <el-button link :icon="scope.row.icon"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="t('menu.type')" header-align="center" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.type === 0" size="small">{{ t('menu.type0') }}</el-tag>
            <el-tag v-else size="small" type="info">{{ t('menu.type1') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="order"
          :label="t('menu.order')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="url"
          :label="t('menu.url')"
          header-align="center"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="permissions"
          :label="t('menu.permissions')"
          header-align="center"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          :label="t('handle')"
          header-align="center"
          align="center"
          width="150"
        >
          <template #default="scope">
            <el-button
              v-if="hasPermission('system:menu:update')"
              link
              size="small"
              @click="showEditDialogHandle(scope.row.id)"
              >{{ t('update') }}</el-button
            >
            <el-button
              v-if="hasPermission('system:menu:delete')"
              link
              size="small"
              @click="deleteHandle(scope.row.id)"
              >{{ t('delete') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <edit-dialog
        v-if="hooksData.editDialogVisible"
        ref="editDialogRef"
        @refreshPageHandle="getDataList"
      ></edit-dialog>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import useHooks from '@/hooks'
import EditDialog from './menu-edit-dialog.vue'
import { hasPermission } from '@/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { hooksOptions, hooksData, getDataList, deleteHandle, showEditDialogHandle } = useHooks()

hooksOptions.getListURL = '/system/menu/list'
hooksOptions.deleteURL = '/system/menu'
</script>
<style lang="scss" scoped>
.icon {
  width: 18px;
}
</style>
