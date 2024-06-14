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
  <div class="tccui-wrapper tccui-page__login">
    <div class="tccui-content__wrapper">
      <main class="tccui-content">
        <div class="login-body">
          <div class="login-header">
            <div class="logo-svg">
              <img src="@/assets/img/logo.svg" />
            </div>
            <h2 class="login-brand">{{ t('brand.lg') }}</h2>
          </div>
          <el-form
            :model="dataForm"
            :rules="rules"
            ref="dataFormRef"
            @keyup.enter="submitDataFormHandle()"
            status-icon
          >
            <el-form-item>
              <el-select v-model="$i18n.locale" class="w-percent-100">
                <el-option
                  v-for="(val, key) in i18nMessages"
                  :key="key"
                  :label="val._lang"
                  :value="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="username">
              <el-input v-model="dataForm.username" :placeholder="t('login.username')">
                <template #prefix>
                  <span class="el-input__icon">
                    <el-icon><User /></el-icon>
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="dataForm.password"
                type="password"
                :placeholder="t('login.password')"
              >
                <template #prefix>
                  <span class="el-input__icon">
                    <el-icon><Lock /></el-icon>
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20" style="width: 100%;">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" :placeholder="t('login.captcha')">
                    <template #prefix>
                      <span class="el-input__icon">
                        <el-icon><Lock /></el-icon>
                      </span>
                    </template>
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitDataFormHandle"
                :loading="loginLoading.value"
                class="w-percent-100"
              >
                {{ t('login.title') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="login-footer">
          <p>2022-2023 © timbercld.com</p>
        </div>
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import debounce from 'lodash/debounce'
import type { ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'
import { messages } from '@/i18n'
import { getUUID } from '@/utils'
import http from '@/utils/http'

const dataFormRef = ref<InstanceType<typeof ElForm>>()
const router = useRouter()
const { t } = useI18n()
const i18nMessages = ref(messages)
const captchaPath = ref('')
const loginLoading: any = ref(false)
const dataForm = reactive({
  username: '',
  password: '',
  uuid: '',
  captcha: ''
})
const rules = computed(() => {
  return {
    username: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    password: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    captcha: [{ required: true, message: t('validate.required'), trigger: 'blur' }]
  }
})
const getCaptcha = () => {
  const url = window.SITE_CONFIG.apiURL
  dataForm.uuid = getUUID()
  captchaPath.value = `${url}/captcha?uuid=${dataForm.uuid}`
}
// 表单提交
const submitDataFormHandle = debounce(
  () => {
    loginLoading.value = true
    dataFormRef.value?.validate(async (valid) => {
      if (!valid) {
        return false
      }
      const res:any = await http.post('/login', dataForm)
      loginLoading.value = false
      if (res.code !== 0) {
        getCaptcha()
        return ElMessage.error(res.msg)
      }
      Cookies.set('token', res.data.token)
      router.replace({ name: 'dashboard' }).catch(err => {})
    })
  },
  1000,
  { leading: true, trailing: false }
)
onMounted(() => {
  getCaptcha()
})
</script>
