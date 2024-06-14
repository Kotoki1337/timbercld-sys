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
    :title="t('updatePassword.title')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
  >
    <el-form
      :model="__reactive.dataForm"
      :rules="rules"
      ref="dataFormRef"
      @keyup.enter="submitDataFormHandle(undefined)"
      label-width="120px"
    >
      <el-form-item :label="t('updatePassword.username')">
        <span>{{ userStore.$state.name }}</span>
      </el-form-item>
      <el-form-item prop="password" :label="t('updatePassword.password')">
        <el-input
          v-model="__reactive.dataForm.password"
          type="password"
          :placeholder="t('updatePassword.password')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="newPassword" :label="t('updatePassword.newPassword')">
        <el-input
          v-model="__reactive.dataForm.newPassword"
          type="password"
          :placeholder="t('updatePassword.newPassword')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword" :label="t('updatePassword.confirmPassword')">
        <el-input
          v-model="__reactive.dataForm.confirmPassword"
          type="password"
          :placeholder="t('updatePassword.confirmPassword')"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="__reactive.visible = false">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitDataFormHandle(undefined)">{{ t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce'
import { reactive, nextTick, computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { ElForm } from 'element-plus'
import http from '@/utils/http'
import { clearLogin } from '@/utils'
import useUserStore from '@/store/user'
import useStore from '@/store'

const userStore = useUserStore()
const store = useStore()

const dataFormRef = ref<InstanceType<typeof ElForm>>()
const router = useRouter()
const { t } = useI18n()
const __reactive = reactive({
  visible: false,
  dataForm: {
    password: '',
    newPassword: '',
    confirmPassword: ''
  }
})
const rules = computed(() => {
  const validateConfirmPassword = (rule, value, callback) => {
    if (__reactive.dataForm.newPassword !== value) {
      return callback(new Error(t('updatePassword.validate.confirmPassword')))
    }
    callback()
  }
  return {
    password: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    newPassword: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    confirmPassword: [
      { required: true, message: t('validate.required'), trigger: 'blur' },
      { validator: validateConfirmPassword, trigger: 'blur' }
    ]
  }
})
const init = async () => {
  __reactive.visible = true
  await nextTick()
  dataFormRef.value?.resetFields()
}
// 表单提交
const submitDataFormHandle = (el: InstanceType<typeof ElForm> | undefined) => {
  debounce(
    () => {
      if (!el) return
      dataFormRef.value?.validate(async (valid) => {
        if (!valid) return false

        const res = await http.put('/system/user/password', __reactive.dataForm)
        if (res.code !== 0) {
          return ElMessage.error(res.msg)
        }
        ElMessage({
          message: t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            __reactive.visible = false
            clearLogin()
            router.replace({ name: 'login' })
          }
        })
      })
    },
    1000,
    { leading: true, trailing: false }
  )
}
defineExpose({
  init
})
</script>
