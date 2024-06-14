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
    <div class="system__log-operation">
      <el-form :inline="true" :model="hooksData.dataForm" @keyup.enter="getDataList()">
        <el-form-item>
          <el-select
            v-model="hooksData.dataForm.status"
            :placeholder="t('loggerOperation.status')"
            clearable
          >
            <el-option :label="t('loggerOperation.status0')" :value="0"></el-option>
            <el-option :label="t('loggerOperation.status1')" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="hooksData.dataListLoading"
        :data="hooksData.dataList"
        border
        @sort-change="onListOrderChange"
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
          prop="creatorName"
          :label="t('loggerOperation.creatorName')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operation"
          :label="t('loggerOperation.operation')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="requestUri"
          :label="t('loggerOperation.requestUri')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="requestMethod"
          :label="t('loggerOperation.requestMethod')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="requestParams"
          :label="t('loggerOperation.requestParams')"
          header-align="center"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="requestTime"
          :label="t('loggerOperation.requestTime')"
          sortable="custom"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            {{ `${scope.row.requestTime}ms` }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="t('loggerOperation.status')"
          sortable="custom"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{
              t('loggerOperation.status0')
            }}</el-tag>
            <el-tag v-else size="small" type="success">{{ t('loggerOperation.status1') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="ip"
          :label="t('loggerOperation.ip')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="userAgent"
          :label="t('loggerOperation.userAgent')"
          header-align="center"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          :label="t('loggerOperation.createDate')"
          sortable="custom"
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
        @current-change="onPageCurrentChange"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import useHooks from '@/hooks'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const {
  hooksOptions,
  hooksData,
  getDataList,
  onPageSizeChange,
  onPageCurrentChange,
  onListOrderChange,
  exportHandle
} = useHooks()

hooksOptions.getListURL = '/system/logger/operation/page'
hooksOptions.needPage = true
hooksOptions.exportURL = '/system/logger/operation/export'

hooksData.dataForm = {
  status: ''
}
</script>
