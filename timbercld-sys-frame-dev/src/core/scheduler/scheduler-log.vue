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
  <el-dialog
    v-model="hooksData.visible"
    :title="t('scheduler.log')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="75%"
  >
    <el-form :inline="true" :model="hooksData.dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input
          v-model="hooksData.dataForm.schedulerId"
          :placeholder="t('scheduler.schedulerId')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ t('query') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="hooksData.dataListLoading"
      :data="hooksData.dataList"
      border
      @sort-change="onListOrderChange"
      height="460"
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
        prop="schedulerId"
        :label="t('scheduler.schedulerId')"
        header-align="center"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="beanName"
        :label="t('scheduler.beanName')"
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="params"
        :label="t('scheduler.params')"
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="status"
        :label="t('scheduler.status')"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.status === 1" size="small">{{
            t('scheduler.statusLog1')
          }}</el-tag>
          <el-tag
            v-else
            type="danger"
            size="small"
            @click="showErrorInfo(scope.row.id)"
            style="cursor: pointer"
            >{{ t('scheduler.statusLog0') }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="times"
        :label="t('scheduler.times')"
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createDate"
        :label="t('scheduler.createDate')"
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
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import useHooks from '@/hooks'
import http from '@/utils/http'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const {
  hooksOptions,
  hooksData,
  getDataList,
  onPageSizeChange,
  onPageCurrentChange,
  onListOrderChange
} = useHooks()

hooksOptions.getListURL = '/system/schedulerlog/page'
hooksOptions.needPage = true

hooksData.dataForm = {
  schedulerId: ''
}

const init = () => {
  hooksData.visible = true
  getDataList()
}

// 失败信息
const showErrorInfo = async (id) => {
  const res: any = await http.get(`/system/schedulerlog/${id}`)
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  ElMessageBox.alert(res.data.error)
}

defineExpose({
  init
})
</script>
