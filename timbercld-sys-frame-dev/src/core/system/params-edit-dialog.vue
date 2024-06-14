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
      <el-form-item prop="paramCode" :label="t('params.paramCode')">
        <el-input
          v-model="__reactive.dataForm.paramCode"
          :placeholder="t('params.paramCode')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="paramValue" :label="t('params.paramValue')">
        <el-input
          v-model="__reactive.dataForm.paramValue"
          :placeholder="t('params.paramValue')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="comment" :label="t('params.comment')">
        <el-input v-model="__reactive.dataForm.comment" :placeholder="t('params.comment')"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="__reactive.visible = false">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitDataFormHandle()">{{ t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import debounce from 'lodash/debounce'
import type { ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'
import http from '@/utils/http'

const dataFormRef = ref<InstanceType<typeof ElForm>>() as any

const { t } = useI18n()

const emit = defineEmits(['refreshPageHandle'])

const __reactive = reactive({
  visible: false,
  dataForm: {
    id: '',
    paramCode: '',
    paramValue: '',
    comment: ''
  }
})

const dialogId = ref(0)

const rules = computed(() => {
  return {
    paramCode: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    paramValue: [{ required: true, message: t('validate.required'), trigger: 'blur' }]
  }
})

// 获取信息
const getInfo = async () => {
  const res: any = await http.get(`/system/params/${__reactive.dataForm.id}`)
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
  if (__reactive.dataForm.id) {
    getInfo()
  }
}

// 表单提交
const submitDataFormHandle = debounce(
  () => {
    dataFormRef.value.validate(async (valid) => {
      if (!valid) {
        return false
      }
      const res = await http[!__reactive.dataForm.id ? 'post' : 'put']('/system/params', __reactive.dataForm)
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
