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
      <el-form-item prop="subSystemCode" :label="t('subsys.subSystemCode')">
        <el-input
          v-model="__reactive.dataForm.subsysCode"
          :placeholder="t('subsys.subSystemCode')"
          :disabled="!!__reactive.dataForm.id"
        ></el-input>
      </el-form-item>
      <el-form-item prop="subSystemName" :label="t('subsys.subSystemName')">
        <el-input
          v-model="__reactive.dataForm.subsysName"
          :placeholder="t('subsys.subSystemName')"
          :disabled="!!__reactive.dataForm.id"
        ></el-input>
      </el-form-item>
      <el-form-item prop="username" :label="t('subsys.username')">
        <el-input
          v-model="__reactive.dataForm.username"
          :placeholder="t('subsys.username')"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="password"
        :label="t('subsys.password')"
        :class="{ 'is-required': !__reactive.dataForm.id }"
      >
        <el-input
          v-model="__reactive.dataForm.password"
          type="password"
          :placeholder="t('subsys.password')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="realName" :label="t('subsys.realName')">
        <el-input
          v-model="__reactive.dataForm.realName"
          :placeholder="t('subsys.realName')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="email" :label="t('subsys.email')">
        <el-input v-model="__reactive.dataForm.email" :placeholder="t('subsys.email')"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" :label="t('subsys.mobile')">
        <el-input v-model="__reactive.dataForm.mobile" :placeholder="t('subsys.mobile')"></el-input>
      </el-form-item>
      <el-form-item prop="comment" :label="t('subsys.comment')">
        <el-input v-model="__reactive.dataForm.comment" :placeholder="t('subsys.comment')"></el-input>
      </el-form-item>
      <el-form-item prop="roleIdList" :label="t('subsys.roleIdList')" class="role-list">
        <el-select
          v-model="__reactive.dataForm.roleIdList"
          multiple
          :placeholder="t('subsys.roleIdList')"
        >
          <el-option
            v-for="role in __reactive.roleList"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" :label="t('subsys.status')" size="small">
        <el-radio-group v-model="__reactive.dataForm.status">
          <el-radio :label="0">{{ t('subsys.status0') }}</el-radio>
          <el-radio :label="1">{{ t('subsys.status1') }}</el-radio>
        </el-radio-group>
      </el-form-item>
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
import type { ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'
import { isEmail, isMobile, isNumber } from '@/utils/validate'
import http from '@/utils/http'

const dataFormRef = ref<InstanceType<typeof ElForm>>()

const { t } = useI18n()

const emit = defineEmits(['refreshPageHandle'])

const dialogId = ref(0)

const __reactive = reactive({
  visible: false,
  roleList: [],
  roleIdListDefault: [],
  dataForm: {
    id: '',
    subsysCode: '',
    subsysName: '',
    username: '',
    password: '',
    realName: '',
    email: '',
    mobile: '',
    comment: '',
    roleIdList: [],
    status: 1
  }
}) as any

const rules = computed(() => {
  const validateNumber = (rule, value, callback) => {
    if (!isNumber(value)) {
      return callback(new Error(t('subsys.validate.number')))
    }
    callback()
  }
  const validatePassword = (rule, value, callback) => {
    if (!__reactive.dataForm.id && !/\S/.test(value)) {
      return callback(new Error(t('validate.required')))
    }
    callback()
  }
  const validateEmail = (rule, value, callback) => {
    if (!isEmail(value)) {
      return callback(new Error(t('validate.format', { attr: t('subsys.email') })))
    }
    callback()
  }
  const validateMobile = (rule, value, callback) => {
    if (!isMobile(value)) {
      return callback(new Error(t('validate.format', { attr: t('subsys.mobile') })))
    }
    callback()
  }
  return {
    username: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    subSystemCode: [
      { required: true, message: t('validate.required'), trigger: 'blur' },
      { validator: validateNumber, trigger: 'blur' }
    ],
    subSystemName: [{ required: true, message: t('validate.required'), trigger: 'change' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
    realName: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    email: [
      { required: true, message: t('validate.required'), trigger: 'blur' },
      { validator: validateEmail, trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: t('validate.required'), trigger: 'blur' },
      { validator: validateMobile, trigger: 'blur' }
    ]
  }
})

watch([() => dialogId.value], (val1) => {
  __reactive.dataForm.id = val1[0]
})

// 获取角色列表
const getRoleList = async () => {
  const res = await http.get('/sub/system/role/list')
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  __reactive.roleList = res.data
}

// 获取信息
const getInfo = async () => {
  const res: any = await http.get(`/sub/system/${__reactive.dataForm.id}`)
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  __reactive.dataForm = {
    ...__reactive.dataForm,
    ...res.data,
    roleIdList: []
  }
  // 角色配置, 区分是否为默认角色
  for (let i = 0; i < res.data.roleIdList.length; i++) {
    if (__reactive.roleList.filter((item) => item.id === res.data.roleIdList[i])[0]) {
      __reactive.dataForm.roleIdList.push(res.data.roleIdList[i])
      continue
    }
    __reactive.roleIdListDefault.push(res.data.roleIdList[i])
  }
}

const init = async () => {
  __reactive.visible = true
  await nextTick()
  dataFormRef.value?.resetFields()
  __reactive.roleIdListDefault = []
  Promise.all([getRoleList()]).then(() => {
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
      const res = await http[!__reactive.dataForm.id ? 'post' : 'put']('/sub/system', {
        ...__reactive.dataForm,
        roleIdList: [...__reactive.dataForm.roleIdList, ...__reactive.roleIdListDefault]
      })
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

<style lang="scss">
.subsys__subsys {
  .role-list {
    .el-select {
      width: 100%;
    }
  }
}
</style>
