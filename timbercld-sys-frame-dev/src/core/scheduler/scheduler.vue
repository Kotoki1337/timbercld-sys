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
    <div class="scheduler__scheduler">
      <el-form :inline="true" :model="hooksData.dataForm" @keyup.enter="getDataList()">
        <el-form-item>
          <el-input
            v-model="hooksData.dataForm.beanName"
            :placeholder="t('scheduler.beanName')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="hasPermission('system:scheduler:save')"
            type="primary"
            @click="showEditDialogHandle()"
            >{{ t('add') }}</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="hasPermission('system:scheduler:delete')"
            type="danger"
            @click="deleteHandle()"
            >{{ t('deleteBatch') }}</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="hasPermission('system:scheduler:pause')"
            type="danger"
            @click="pauseHandle()"
            >{{ t('scheduler.pauseBatch') }}</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="hasPermission('system:scheduler:resume')"
            type="danger"
            @click="resumeHandle()"
            >{{ t('scheduler.resumeBatch') }}</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPermission('system:scheduler:run')" type="danger" @click="runHandle()">{{
            t('scheduler.runBatch')
          }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPermission('system:scheduler:log')" type="success" @click="logHandle()">{{
            t('scheduler.log')
          }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="hooksData.dataListLoading"
        :data="hooksData.dataList"
        border
        @selection-change="onListSelectionChange"
        @sort-change="onListOrderChange"
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
              v-if="hasPermission('system:scheduler:update')"
              link
              size="small"
              @click="showEditDialogHandle(scope.row.id)"
              >{{ t('update') }}</el-button
            >
            <el-button
              v-if="hasPermission('system:scheduler:pause')"
              link
              size="small"
              @click="pauseHandle(scope.row.id)"
              >{{ t('scheduler.pause') }}</el-button
            >
            <el-button
              v-if="hasPermission('system:scheduler:resume')"
              link
              size="small"
              @click="resumeHandle(scope.row.id)"
              >{{ t('scheduler.resume') }}</el-button
            >
            <el-button
              v-if="hasPermission('system:scheduler:run')"
              link
              size="small"
              @click="runHandle(scope.row.id)"
              >{{ t('scheduler.run') }}</el-button
            >
            <el-button
              v-if="hasPermission('system:scheduler:delete')"
              link
              size="small"
              @click="deleteHandle(scope.row.id)"
              >{{ t('delete') }}</el-button
            >
          </template>
        </el-table-column>
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
          prop="cronExpression"
          :label="t('scheduler.cronExpression')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="comment"
          :label="t('scheduler.comment')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          :label="t('scheduler.status')"
          sortable="custom"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" size="small">{{ t('scheduler.status1') }}</el-tag>
            <el-tag v-else size="small" type="danger">{{ t('scheduler.status0') }}</el-tag>
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

      <edit-dialog
        v-if="hooksData.editDialogVisible"
        ref="editDialogRef"
        @refreshPageHandle="getDataList"
      ></edit-dialog>
      <!-- 弹窗, 日志列表 -->
      <log ref="log"></log>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import useHooks from '@/hooks'
import EditDialog from './scheduler-edit-dialog.vue'
import Log from './scheduler-log.vue'
import http from '@/utils/http'
import { hasPermission } from '@/utils'

const { t } = useI18n()

const { proxy } = getCurrentInstance() as any

const {
  hooksOptions,
  hooksData,
  getDataList,
  onPageSizeChange,
  onPageCurrentChange,
  deleteHandle,
  showEditDialogHandle,
  onListOrderChange,
  onListSelectionChange
} = useHooks()

hooksOptions.getListURL = '/system/scheduler/page'
hooksOptions.needPage = true
hooksOptions.deleteURL = '/system/scheduler'
hooksOptions.multiDelete = true

hooksData.dataForm = {
  beanName: ''
}
const logVisible = ref(false)

// 暂停
const pauseHandle = (id?) => {
  if (!id && hooksData.tableDataSelectedList.length <= 0) {
    return ElMessage({
      message: t('prompt.deleteBatch'),
      type: 'warning',
      duration: 500
    })
  }
  ElMessageBox.confirm(t('prompt.info', { handle: t('scheduler.pause') }), t('prompt.title'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(async () => {
    const res = await http.put(
      '/system/scheduler/pause',
      id ? [id] : hooksData.tableDataSelectedList.map((item) => item.id)
    )
    if (res.code !== 0) {
      return ElMessage.error(res.msg)
    }
    ElMessage({
      message: t('prompt.success'),
      type: 'success',
      duration: 500,
      onClose: () => {
        getDataList()
      }
    })
  })
}

// 恢复
const resumeHandle = (id?) => {
  if (!id && hooksData.tableDataSelectedList.length <= 0) {
    return ElMessage({
      message: t('prompt.deleteBatch'),
      type: 'warning',
      duration: 500
    })
  }
  ElMessageBox.confirm(t('prompt.info', { handle: t('scheduler.resume') }), t('prompt.title'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  })
    .then(async () => {
      const res = await http.put(
        '/system/scheduler/resume',
        id ? [id] : hooksData.tableDataSelectedList.map((item) => item.id)
      )
      if (res.code !== 0) {
        return ElMessage.error(res.msg)
      }
      ElMessage({
        message: t('prompt.success'),
        type: 'success',
        duration: 500,
        onClose: () => {
          getDataList()
        }
      })
    })
    .catch(() => {})
}

// 执行
const runHandle = (id?) => {
  if (!id && hooksData.tableDataSelectedList.length <= 0) {
    return ElMessage({
      message: t('prompt.deleteBatch'),
      type: 'warning',
      duration: 500
    })
  }
  ElMessageBox.confirm(t('prompt.info', { handle: t('scheduler.run') }), t('prompt.title'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  })
    .then(async () => {
      const res = await http.put(
        '/system/scheduler/run',
        id ? [id] : hooksData.tableDataSelectedList.map((item) => item.id)
      )
      if (res.code !== 0) {
        return ElMessage.error(res.msg)
      }
      ElMessage({
        message: t('prompt.success'),
        type: 'success',
        duration: 500,
        onClose: () => {
          getDataList()
        }
      })
    })
    .catch(() => {})
}

// 日志列表
const logHandle = async () => {
  logVisible.value = true
  await nextTick()
  proxy.$refs.log.init()
}
</script>
