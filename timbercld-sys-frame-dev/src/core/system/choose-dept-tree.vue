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
    v-model="deptData.visibleSelect"
    width="30%"
    :modal="true"
    :title="t('dept.choosetitle')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form size="small" :inline="true">
      <el-form-item :label="t('keyword')">
        <el-input v-model="deptData.filterText"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="default">查询</el-button>
      </el-form-item>
    </el-form>
    <el-tree
      class="filter-tree"
      :data="deptData.deptList"
      :default-expanded-keys="deptData.expandedKeys"
      :props="deptData.defaultProps"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :highlight-current="true"
      node-key="id"
      ref="treeRef"
    >
    </el-tree>
    <template #footer>
      <el-button type="default" @click="cancelHandle()" size="small">{{ t('cancel') }}</el-button>
      <el-button type="info" @click="cleanHandle()" size="small">{{ t('clear') }}</el-button>
      <el-button type="primary" @click="commitHandle()" size="small">{{ t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElTree } from 'element-plus'
import { useI18n } from 'vue-i18n'
import http from '@/utils/http'

const treeRef = ref<InstanceType<typeof ElTree>>()

const { t } = useI18n()

const deptData = reactive({
  filterText: '',
  visibleSelect: false,
  callback: null,
  deptList: [] as any,
  expandedKeys: [0],
  defaultProps: {
    children: 'children',
    label: 'name'
  }
}) as any

watch([() => deptData.filterText], (val1) => {
  treeRef.value?.filter(val1)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.name.indexOf(value) !== -1
}
const getDeptList = async (id) => {
  const res = await http.get('/system/dept/list')
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  deptData.deptList = res.data
  await nextTick()
  treeRef.value?.setCurrentKey(id)
  deptData.expandedKeys = [id]
}

const init = (id, callback) => {
  deptData.expandedKeys = [0]
  deptData.visibleSelect = true
  deptData.callback = callback
  getDeptList(id)
}
const cancelHandle = () => {
  deptData.visibleSelect = false
}
const cleanHandle = () => {
  if (deptData.callback) {
    deptData.callback({})
  }
  deptData.visibleSelect = false
}
const commitHandle = () => {
  const node = treeRef.value?.getCurrentNode()
  if (!node) {
    ElMessage.error(t('dept.chooseerror'))
    return
  }
  if (deptData.callback) {
    const deptInfo = {
      deptId: node.id,
      deptName: node.name
    }
    deptData.callback(deptInfo)
  }
  deptData.visibleSelect = false
}
</script>
