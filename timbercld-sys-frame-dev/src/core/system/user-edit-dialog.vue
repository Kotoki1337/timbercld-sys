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
    v-loading="__reactive.loading"
  >
    <el-form
      :model="__reactive.dataForm"
      :rules="rules"
      ref="dataFormRef"
      @keyup.enter="submitDataFormHandle()"
      label-width="120px"
    >
      <el-form-item prop="username" :label="t('user.username')">
        <el-input v-model="__reactive.dataForm.username" :placeholder="t('user.username')"></el-input>
      </el-form-item>
      <el-form-item prop="deptName" :label="t('user.deptName')">
        <tcc-dept-tree
          v-model="__reactive.dataForm.deptId"
          :placeholder="t('dept.title')"
          :dept-name.sync="__reactive.dataForm.deptName"
          @confirm="getTreeSelect"
        ></tcc-dept-tree>
      </el-form-item>
      <el-form-item
        prop="password"
        :label="t('user.password')"
        :class="{ 'is-required': !__reactive.dataForm.id }"
      >
        <el-input
          v-model="__reactive.dataForm.password"
          type="password"
          :placeholder="t('user.password')"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="confirmPassword"
        :label="t('user.confirmPassword')"
        :class="{ 'is-required': !__reactive.dataForm.id }"
      >
        <el-input
          v-model="__reactive.dataForm.confirmPassword"
          type="password"
          :placeholder="t('user.confirmPassword')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="realName" :label="t('user.realName')">
        <el-input v-model="__reactive.dataForm.realName" :placeholder="t('user.realName')"></el-input>
      </el-form-item>
      <el-form-item prop="gender" :label="t('user.gender')">
        <el-radio-group v-model="__reactive.dataForm.gender">
          <el-radio :label="item.value" v-for="(item, i) in __reactive.genderList" :key="i">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="email" :label="t('user.email')">
        <el-input v-model="__reactive.dataForm.email" :placeholder="t('user.email')"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" :label="t('user.mobile')">
        <el-input v-model="__reactive.dataForm.mobile" :placeholder="t('user.mobile')"></el-input>
      </el-form-item>
      <el-form-item prop="roleIdList" :label="t('user.roleIdList')" class="role-list">
        <el-select
          v-model="__reactive.dataForm.roleIdList"
          multiple
          :placeholder="t('user.roleIdList')"
        >
          <el-option
            v-for="role in __reactive.roleList"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" :label="t('user.status')" size="small">
        <el-radio-group v-model="__reactive.dataForm.status">
          <el-radio :label="0">{{ t('user.status0') }}</el-radio>
          <el-radio :label="1">{{ t('user.status1') }}</el-radio>
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
import { isEmail, isMobile } from '@/utils/validate'
import http from '@/utils/http'

const dataFormRef = ref<InstanceType<typeof ElForm>>() as any

const { t } = useI18n()

const emit = defineEmits(['refreshPageHandle'])

const dialogId = ref()

const __reactive = reactive({
  loading: false,
  visible: false,
  roleList: [] as any,
  roleIdListDefault: [] as any,
  genderList: [
    {
      value: 0,
      label: '男'
    },
    {
      value: 1,
      label: '女'
    },
    {
      value: 2,
      label: '保密'
    }
  ],
  dataForm: {
    id: '',
    username: '',
    deptId: '',
    deptName: '',
    password: '',
    confirmPassword: '',
    realName: '',
    gender: 0,
    email: '',
    mobile: '',
    roleIdList: [],
    status: 1
  } as any
})

const rules = computed(() => {
  const validatePassword = (rule, value, callback) => {
    if (!__reactive.dataForm.id && !/\S/.test(value)) {
      return callback(new Error(t('validate.required')))
    }
    callback()
  }
  const validateConfirmPassword = (rule, value, callback) => {
    if (!__reactive.dataForm.id && !/\S/.test(value)) {
      return callback(new Error(t('validate.required')))
    }
    if (__reactive.dataForm.password !== value) {
      return callback(new Error(t('user.validate.confirmPassword')))
    }
    callback()
  }
  const validateEmail = (rule, value, callback) => {
    if (value && !isEmail(value)) {
      return callback(new Error(t('validate.format', { attr: t('user.email') })))
    }
    callback()
  }
  const validateMobile = (rule, value, callback) => {
    if (value && !isMobile(value)) {
      return callback(new Error(t('validate.format', { attr: t('user.mobile') })))
    }
    callback()
  }
  return {
    username: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    deptName: [{ required: true, message: t('validate.required'), trigger: 'change' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
    confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
    realName: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    email: [{ validator: validateEmail, trigger: 'blur' }],
    mobile: [{ validator: validateMobile, trigger: 'blur' }]
  }
})

watch([() => dialogId.value], (val1) => {
  __reactive.dataForm.id = val1[0]
})

// 获取角色列表
const getRoleList = async () => {
  const res = await http.get('/system/role/list')
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  __reactive.roleList = res.data
}

// 获取信息
const getInfo = async () => {
  __reactive.loading = true
  const res: any = await http.get(`/system/user/${__reactive.dataForm.id}`)
  __reactive.loading = false
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
  __reactive.dataForm.deptId = ''
  await nextTick()
  dataFormRef.value.resetFields()
  __reactive.roleIdListDefault = []
  Promise.all([getRoleList()]).then(() => {
    if (__reactive.dataForm.id) {
      getInfo()
    }
  })
}

const getTreeSelect = (e) => {
  __reactive.dataForm.deptId = e.id
  __reactive.dataForm.deptName = e.name
}

// 表单提交
const submitDataFormHandle = debounce(
  () => {
    dataFormRef.value.validate(async (valid) => {
      if (!valid) {
        return false
      }
      const res = await http[!__reactive.dataForm.id ? 'post' : 'put']('/system/user', {
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
.system__user {
  .dept-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
  .role-list {
    .el-select {
      width: 100%;
    }
  }
}
</style>
