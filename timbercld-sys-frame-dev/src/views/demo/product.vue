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
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__product">
      <el-form :inline="true" :model="hooksData.dataForm" @keyup.enter="getDataList()">
        <el-form-item>
          <el-input
            v-model="hooksData.dataForm.productName"
            :placeholder="t('product.productName')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="hasPermission('demo:product:page')">
          <el-button @click="getDataList()">{{ t('query') }}</el-button>
        </el-form-item>
        <el-form-item v-if="hasPermission('demo:product:save')">
          <el-button type="primary" @click="showEditDialogHandle()">{{ t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
          v-loading="hooksData.dataListLoading"
          :data="hooksData.dataList"
          border
          style="width: 100%">
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
            <el-button v-if="hasPermission('demo:product:update')" link size="small" @click="showEditDialogHandle(scope.row.id)">{{
              t('update')
              }}</el-button>
            <el-button v-if="hasPermission('demo:product:delete')" link size="small" @click="deleteHandle(scope.row.id)">{{
              t('delete')
              }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
            prop="productName"
            :label="t('product.productName')"
            header-align="center"
            width="180"
            align="center"
        ></el-table-column>
        <el-table-column
            prop="marks"
            :label="t('product.marks')"
            header-align="center"
            align="center"
            min-width="200"
        ></el-table-column>
        <el-table-column
            prop="price"
            :label="t('product.price')"
            header-align="center"
            align="center"
            width="100"
        ></el-table-column>
        <el-table-column
            prop="pic"
            :label="t('product.pic')"
            header-align="center"
            align="center"
            width="180"
        >
          <template #default="scope">
            <div>
              <img :src="scope.row.pic" style="width: 100%;" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="creatorId"
            :label="t('product.creatorId')"
            header-align="center"
            align="center"
            width="180"
        ></el-table-column>
        <el-table-column
            prop="createDate"
            :label="t('product.createDate')"
            header-align="center"
            align="center"
            width="180"
        ></el-table-column>
        <el-table-column
            prop="updateDate"
            :label="t('product.updateDate')"
            header-align="center"
            align="center"
            width="180"
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
        @current-change="onPageCurrentChange">
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
import EditDialog from './product-edit-dialog.vue'
import { watch } from 'vue'
import useHooks from '@/hooks'
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
  showEditDialogHandle
} = useHooks()

hooksOptions.getListURL = '/demo/product/page'
hooksOptions.needPage = true
hooksOptions.deleteURL = '/demo/product/'
hooksOptions.multiDelete = false

hooksData.dataForm = {
  productName: ''
}

watch([() => hooksData.daterange], (val1) => {
  hooksData.dataForm.startDate = val1[0][0]
  hooksData.dataForm.endDate = val1[0][1]
})
</script>
