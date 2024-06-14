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
    <div class="system__params">
      <el-form :inline="true" :model="hooksData.dataForm" @keyup.enter="getDataList()">
        <el-form-item>
          <el-input
            v-model="hooksData.dataForm.paramCode"
            :placeholder="t('params.paramCode')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="hasPermission('system:params:save')"
            type="primary"
            @click="showEditDialogHandle()"
            >{{ t('add') }}</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="hasPermission('system:params:delete')"
            type="danger"
            @click="deleteHandle()"
            >{{ t('deleteBatch') }}</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        v-loading="hooksData.dataListLoading"
        :data="hooksData.dataList"
        border
        @selection-change="onListSelectionChange"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          type="index"
          :label="t('index')"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          :label="t('handle')"
          header-align="center"
          align="center"
          width="150"
        >
          <template #default="scope">
            <el-button
              v-if="hasPermission('system:params:update')"
              link
              size="small"
              @click="showEditDialogHandle(scope.row.id)"
              >{{ t('update') }}</el-button
            >
            <el-button
              v-if="hasPermission('system:params:delete')"
              link
              size="small"
              @click="deleteHandle(scope.row.id)"
              >{{ t('delete') }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="paramCode"
          :label="t('params.paramCode')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="paramValue"
          :label="t('params.paramValue')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="comment"
          :label="t('params.comment')"
          header-align="center"
          align="center"
        ></el-table-column>
      </el-table>
      <el-pagination
        :current-page="hooksData.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="hooksData.limit"
        :total="hooksData.total"
        layout="total, sizes, prev, pager, next, jumper"
        :small="true"
        @size-change="onPageSizeChange"
        @current-change="onPageCurrentChange"
      >
      </el-pagination>

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
import EditDialog from './params-edit-dialog.vue'
import { hasPermission } from '@/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const {
  hooksOptions,
  hooksData,
  getDataList,
  onPageSizeChange,
  onPageCurrentChange,
  deleteHandle,
  showEditDialogHandle,
  onListSelectionChange
} = useHooks()

hooksOptions.getListURL = '/system/params/page'
hooksOptions.needPage = true
hooksOptions.deleteURL = '/system/params'
hooksOptions.multiDelete = true

hooksData.dataForm = {
  paramCode: ''
}
</script>
