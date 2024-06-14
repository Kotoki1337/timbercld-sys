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
  <div>
    <el-input
      v-model="__reactive.showDeptName"
      :placeholder="props.placeholder"
      readonly
      @click="showDialog"
    >
      <template #append><el-button :icon="Search" @click="showDialog"></el-button></template>
    </el-input>
    <el-input :value="props.modelValue" v-show="false"></el-input>
    <el-dialog
      v-model="__reactive.visible"
      width="30%"
      draggable
      :modal="false"
      :title="props.placeholder"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form size="small" :inline="true">
        <el-form-item :label="t('keyword')">
          <el-input v-model="__reactive.filterValue"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default">{{ t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        class="filter-tree"
        :data="__reactive.deptList"
        :default-expanded-keys="__reactive.expandedKeyList"
        :props="__reactive.defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :highlight-current="true"
        :render-after-expand="false"
        empty-text="-- 暂无数据 --"
        node-key="id"
        ref="treeRef"
      />
      <template #footer>
        <el-button type="default" @click="cancelHandle()" size="small">{{
          t('cancel')
        }}</el-button>
        <el-button v-if="props.query" type="info" @click="clearHandle()" size="small">{{
          t('clear')
        }}</el-button>
        <el-button type="primary" @click="commitHandle()" size="small">{{
          t('confirm')
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import type { ElTree } from 'element-plus'
import http from '@/utils/http'

const treeRef = ref<InstanceType<typeof ElTree>>()

const props = defineProps({
  modelValue: [Number, String],
  deptName: String,
  query: Boolean,
  placeholder: String
})

const { t } = useI18n()

const __reactive = reactive({
  visible: false,
  filterValue: '',
  showDeptName: '',
  expandedKeyList: [0],
  defaultProps: {
    children: 'children',
    label: 'name'
  },
  deptList: []
})

watch([() => __reactive.filterValue, () => props.deptName], (val1: any) => {
  treeRef.value?.filter(val1[0])
  __reactive.showDeptName = val1[1]
})

const emits = defineEmits(['confirm'])

const showDialog = async () => {
  __reactive.expandedKeyList = [0]
  await nextTick()
  if (treeRef.value!) {
    treeRef.value?.setCurrentKey(0)
  }
  __reactive.visible = true
  getDeptList(props.modelValue)
}

const getDeptList = async (id) => {
  const res:any = await http.get('/system/dept/list')
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  __reactive.deptList = res.data
  await nextTick()
  treeRef.value?.setCurrentKey(id)
  __reactive.expandedKeyList = [id]
}

const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}

const cancelHandle = () => {
  __reactive.visible = false
  __reactive.deptList = []
  __reactive.filterValue = ''
}

const clearHandle = () => {
  __reactive.showDeptName = ''
  __reactive.visible = false
  __reactive.deptList = []
  __reactive.filterValue = ''
}

const commitHandle = () => {
  const node = treeRef.value!.getCurrentNode()
  if (!node) {
    ElMessage.error(t('dept.chooseerror'))
    return
  }
  emits('confirm', node)
  __reactive.showDeptName = node.name
  __reactive.visible = false
  __reactive.deptList = []
  __reactive.filterValue = ''
}
</script>
