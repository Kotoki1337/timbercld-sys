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
    v-model="__reactive.visible"
    :title="!__reactive.dataForm.id ? t('add') : t('update')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="__reactive.dataForm"
      :rules="rules"
      ref="dataFormRef"
      @keyup.enter="submitDataFormHandle()"
      label-width="120px"
    >
      <el-form-item prop="name" :label="t('role.name')">
        <el-input v-model="__reactive.dataForm.name" :placeholder="t('role.name')"></el-input>
      </el-form-item>
      <el-form-item prop="comment" :label="t('role.comment')">
        <el-input v-model="__reactive.dataForm.comment" :placeholder="t('role.comment')"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item size="small" :label="t('role.menuList')">
            <el-tree
              :data="__reactive.menuList"
              :props="__reactive.defaultProps"
              node-key="id"
              ref="menuListTreeRef"
              accordion
              show-checkbox
            >
            </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="__reactive.visible = false">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitDataFormHandle()">{{ t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import debounce from 'lodash/debounce'
import type { ElForm, ElTree } from 'element-plus'
import { ElMessage } from 'element-plus'
import http from '@/utils/http'

const dataFormRef = ref<InstanceType<typeof ElForm>>()

const menuListTree = ref<InstanceType<typeof ElTree>>()

const { t } = useI18n()

const emit = defineEmits(['refreshPageHandle'])

const dialogId = ref(0)

const __reactive = reactive({
  visible: false,
  menuList: [],
  dataForm: {
    id: '',
    name: '',
    menuIdList: [],
    comment: ''
  },
  defaultProps: { label: 'name', children: 'children' }
}) as any

const rules = computed(() => {
  return {
    name: [{ required: true, message: t('validate.required'), trigger: 'blur' }]
  }
})

watch([() => dialogId.value], (val1) => {
  __reactive.dataForm.id = val1[0]
})

// 获取菜单列表
const getMenuList = async () => {
  const res = await http.get('/system/menu/select')
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  __reactive.menuList = res.data
}

// 获取信息
const getInfo = async () => {
  const res: any = await http.get(`/sub/system/role/${__reactive.dataForm.id}`)
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  __reactive.dataForm = {
    ...__reactive.dataForm,
    ...res.data
  }
}

const init = async () => {
  __reactive.visible = true
  await nextTick()
  dataFormRef.value?.resetFields()
  menuListTree.value?.setCheckedKeys([])
  Promise.all([getMenuList()]).then(() => {
    if (__reactive.dataForm.id) {
      getInfo()
    }
  })
}

// 表单提交
const submitDataFormHandle = debounce(
  () => {
    dataFormRef.value?.validate(async (valid) => {
      if (!valid) {
        return false
      }
      const res = await http[!__reactive.dataForm.id ? 'post' : 'put'](
        '/sub/system/role',
        __reactive.dataForm
      )
      if (res.code !== 0) {
        return ElMessage.error(res.msg)
      }
      ElMessage({
        message: t('prompt.success'),
        type: 'success',
        duration: 500,
        onClose: () => {
          __reactive.visible = false
          emit('refreshPageHandle')
        }
      })
    })
  },
  1000,
  { leading: true, trailing: false }
)

defineExpose({
  init,
  dialogId
})
</script>
