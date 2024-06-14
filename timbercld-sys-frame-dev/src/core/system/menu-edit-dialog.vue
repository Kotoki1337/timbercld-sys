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
      <el-form-item prop="type" :label="t('menu.type')" size="small">
        <el-radio-group v-model="__reactive.dataForm.type" :disabled="!!__reactive.dataForm.id">
          <el-radio :label="0">{{ t('menu.type0') }}</el-radio>
          <el-radio :label="1">{{ t('menu.type1') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="name" :label="t('menu.name')">
        <el-input v-model="__reactive.dataForm.name" :placeholder="t('menu.name')"></el-input>
      </el-form-item>
      <el-form-item prop="parentName" :label="t('menu.parentName')" class="menu-list">
        <el-popover
          v-model="__reactive.menuListVisible"
          placement="bottom-start"
          trigger="click"
          ref="menuListPopover"
          :virtual-ref="menuListPopoverBtn"
          virtual-triggering
          width="auto"
        >
          <el-tree
            :data="__reactive.menuList"
            :props="__reactive.defaultProps"
            node-key="id"
            ref="menuListTreeRef"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="menuListTreeCurrentChangeHandle"
          >
          </el-tree>
        </el-popover>
        <el-input
          v-model="__reactive.dataForm.parentName"
          ref="menuListPopoverBtn"
          :readonly="true"
          :placeholder="t('menu.parentName')"
        >
          <template #suffix v-if="__reactive.dataForm.pid !== '0'">
            <el-icon @click.stop="deptListTreeSetDefaultHandle()"><CircleClose /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="__reactive.dataForm.type === 0" prop="url" :label="t('menu.url')">
        <el-input v-model="__reactive.dataForm.url" :placeholder="t('menu.url')"></el-input>
      </el-form-item>
      <el-form-item prop="order" :label="t('menu.order')">
        <el-input-number
          v-model="__reactive.dataForm.order"
          controls-position="right"
          :min="0"
          :label="t('menu.order')"
        ></el-input-number>
      </el-form-item>
      <el-form-item prop="permissions" :label="t('menu.permissions')">
        <el-input
          v-model="__reactive.dataForm.permissions"
          :placeholder="t('menu.permissionsTips')"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="__reactive.dataForm.type === 0"
        prop="icon"
        :label="t('menu.icon')"
        class="icon-list"
      >
        <tcc-icon-picker v-model="__reactive.dataForm.icon" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="__reactive.visible = false">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitDataFormHandle">{{ t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import debounce from 'lodash/debounce'
import type { ElForm, ElTree } from 'element-plus'
import TccIconPicker from '@/components/tcc-icon-picker/tcc-icon-picker.vue'
import { ElMessage } from 'element-plus'
import http from '@/utils/http'
import { getIconList } from '@/utils'

const dataFormRef = ref<InstanceType<typeof ElForm>>() as any

const menuListTreeRef = ref<InstanceType<typeof ElTree>>() as any

const menuListPopoverBtn = ref() as any
const menuListPopover = ref() as any

const { t } = useI18n()

const emit = defineEmits(['refreshPageHandle'])

const dialogId = ref(0)

const __reactive = reactive({
  visible: false,
  menuListVisible: false,
  iconList: [] as any,
  iconListVisible: false,
  menuList: [] as any,
  defaultProps: { label: 'name', children: 'children' },
  dataForm: {
    id: '',
    type: 0,
    name: '',
    pid: '0',
    parentName: '',
    url: '',
    permissions: '',
    order: 0,
    icon: ''
  } as any
})

watch([() => __reactive.dataForm.type, () => dialogId.value], (val1) => {
  dataFormRef.value?.clearValidate()
  __reactive.dataForm.id = val1[1]
})
const rules = computed(() => {
  return {
    name: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    parentName: [{ required: true, message: t('validate.required'), trigger: 'change' }]
  }
})

// 获取菜单列表
const getMenuList = async () => {
  const res = await http.get('/system/menu/list?type=0')
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  __reactive.menuList = res.data
}
// 上级菜单树, 设置默认值
const deptListTreeSetDefaultHandle = () => {
  __reactive.dataForm.pid = '0'
  __reactive.dataForm.parentName = t('menu.parentNameDefault')
}
// 上级菜单树, 选中
const menuListTreeCurrentChangeHandle = (data) => {
  __reactive.dataForm.pid = data.id
  __reactive.dataForm.parentName = data.name
  __reactive.menuListVisible = false
}
// 获取信息
const getInfo = async () => {
  const res: any = await http.get(`/system/menu/${__reactive.dataForm.id}`)
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
  menuListTreeRef.value?.setCurrentKey(__reactive.dataForm.pid)
}

const init = async () => {
  __reactive.visible = true
  await nextTick()
  dataFormRef.value?.resetFields()
  __reactive.iconList = getIconList()
  __reactive.dataForm.parentName = t('menu.parentNameDefault')
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
      const res = await http[!__reactive.dataForm.id ? 'post' : 'put']('/system/menu', __reactive.dataForm)
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
.system__menu {
  .menu-list,
  .icon-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
  &-icon-popover {
    width: 458px;
    overflow: hidden;
  }
  &-icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &-icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
}
.el-input__suffix-inner {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
