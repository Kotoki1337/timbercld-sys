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
      <el-form-item prop="name" :label="t('dept.name')">
        <el-input v-model="__reactive.dataForm.name" :placeholder="t('dept.name')"></el-input>
      </el-form-item>
      <el-form-item prop="parentName" :label="t('dept.parentName')" class="dept-list">
        <el-popover
          v-model="__reactive.deptListVisible"
          ref="popoverRef"
          placement="bottom-start"
          trigger="click"
        >
          <el-tree
            :data="__reactive.deptList"
            :props="__reactive.defaultProps"
            node-key="id"
            ref="deptListTreeRef"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="deptListTreeCurrentChangeHandle"
          >
          </el-tree>
          <template #reference>
            <el-input
              v-model="__reactive.dataForm.parentName"
              v-popover="popoverRef"
              :readonly="true"
              :placeholder="t('dept.parentName')"
            >
              <template
                #suffix
                v-if="userStore.$state.superAdmin === 1 && __reactive.dataForm.pid !== '0'"
              >
                <el-icon @click.stop="deptListTreeSetDefaultHandle()"><CircleClose /></el-icon>
              </template>
            </el-input>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item prop="order" :label="t('dept.order')">
        <el-input-number
          v-model="__reactive.dataForm.order"
          controls-position="right"
          :min="0"
          :label="t('dept.order')"
        ></el-input-number>
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
import type { ElForm, ElTree } from 'element-plus'
import { ElMessage } from 'element-plus'
import useUseStore from '@/store/user'
import http from '@/utils/http'

const userStore = useUseStore()

const dataFormRef = ref<InstanceType<typeof ElForm>>()
const popoverRef = ref()
const deptListTreeRef = ref<InstanceType<typeof ElTree>>()

const { t } = useI18n()

const emit = defineEmits(['refreshPageHandle'])

const dialogId = ref(0)

const __reactive = reactive({
  visible: false,
  deptList: [] as any,
  deptListVisible: false,
  dataForm: {
    id: '',
    name: '',
    pid: '',
    parentName: '',
    order: 0
  } as any,
  defaultProps: { label: 'name', children: 'children' }
})

const rules = computed(() => {
  return {
    name: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    parentName: [{ required: true, message: t('validate.required'), trigger: 'change' }]
  }
})

watch([() => dialogId.value], (val1) => {
  __reactive.dataForm.id = val1[0]
})

// 上级部门树, 设置默认值
const deptListTreeSetDefaultHandle = () => {
  __reactive.dataForm.pid = '0'
  __reactive.dataForm.parentName = t('dept.parentNameDefault')
}
// 上级部门树, 选中
const deptListTreeCurrentChangeHandle = (data) => {
  __reactive.dataForm.pid = data.id
  __reactive.dataForm.parentName = data.name
  __reactive.deptListVisible = false
}
// 获取部门列表
const getDeptList = async () => {
  const res = await http.get('/system/dept/list')
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  __reactive.deptList = res.data
}

// 获取信息
const getInfo = async () => {
  const res: any = await http.get(`/system/dept/${__reactive.dataForm.id}`)
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  __reactive.dataForm = {
    ...__reactive.dataForm,
    ...res.data
  }
  if (__reactive.dataForm.pid === '0') {
    return deptListTreeSetDefaultHandle()
  }
  deptListTreeRef.value?.setCurrentKey(__reactive.dataForm.pid)
}

const init = async () => {
  __reactive.visible = true
  await nextTick()
  dataFormRef.value?.resetFields()
  Promise.all([getDeptList()]).then(() => {
    if (__reactive.dataForm.id) {
      getInfo()
    } else if (userStore.$state.superAdmin === 1 || userStore.$state.superSubSystem === 1) {
      deptListTreeSetDefaultHandle()
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
      const res = await http[!__reactive.dataForm.id ? 'post' : 'put']('/system/dept', __reactive.dataForm)
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
.system__dept {
  .dept-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
}
.el-popper {
  width: initial !important;
}
</style>
