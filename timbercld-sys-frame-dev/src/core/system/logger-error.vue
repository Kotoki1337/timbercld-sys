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
    <div class="system__log-error">
      <el-form :inline="true" :model="hooksData.dataForm" @keyup.enter="getDataList()">
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
          :label="t('handle')"
          header-align="center"
          align="center"
          width="150"
        >
          <template #default="scope">
            <el-button link size="small" @click="infoHandle(scope.row.errorInfo)">{{
              t('loggerError.errorInfo')
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="requestUri"
          :label="t('loggerError.requestUri')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="requestMethod"
          :label="t('loggerError.requestMethod')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="requestParams"
          :label="t('loggerError.requestParams')"
          header-align="center"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="ip"
          :label="t('loggerError.ip')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="userAgent"
          :label="t('loggerError.userAgent')"
          header-align="center"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          :label="t('loggerError.createDate')"
          sortable="custom"
          header-align="center"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column
          :label="t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template #default="scope">
            <el-button link size="small" @click="infoHandle(scope.row.errorInfo)">{{
              t('loggerError.errorInfo')
            }}</el-button>
          </template>
        </el-table-column>
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
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import useHooks from '@/hooks'

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

hooksOptions.getListURL = '/system/logger/error/page'
hooksOptions.needPage = true
hooksOptions.exportURL = '/system/logger/error/export'

hooksData.dataForm = {
  username: '',
  deptId: '',
  gender: ''
}

// 异常信息
const infoHandle = (info) => {
  ElMessageBox.alert(info, t('loggerError.errorInfo'), {
    customClass: 'system__log-error-view-info'
  })
}
</script>

<style lang="scss">
.system__log-error {
  &-view-info {
    width: 80%;
  }
}
</style>
