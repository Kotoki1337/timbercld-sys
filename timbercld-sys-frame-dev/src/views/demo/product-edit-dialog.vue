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
    :closed="resetDataForm">
    <el-form
      v-loading="__reactive.loading"
      :model="__reactive.dataForm"
      :rules="rules"
      ref="dataFormRef"
      @keyup.enter="submitDataFormHandle()"
      label-width="180px">
      <el-form-item prop="productName" :label="t('product.productName')">
        <el-input v-model="__reactive.dataForm.productName" :placeholder="t('product.productName')"></el-input>
      </el-form-item>
      <el-form-item prop="marks" :label="t('product.marks')">
        <el-input type="textarea" v-model="__reactive.dataForm.marks" :placeholder="t('product.marks')"></el-input>
      </el-form-item>
      <el-form-item prop="price" :label="t('product.price')">
        <el-input v-model="__reactive.dataForm.price" :placeholder="t('product.price')"></el-input>
      </el-form-item>
      <el-form-item prop="pic" :label="t('product.pic')" v-loading="__reactive.uploadImageLoading">
        <el-upload
          action="#"
          ref="uploadRef"
          list-type="picture-card"
          :file-list="__reactive.fileList"
          :on-remove="handleRemove"
          :http-request="handleUpload"
          :auto-upload="true"
          :on-change="handleChange"
          :limit="1"
          :on-preview="handlePictureCardPreview">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="__reactive.visible = false">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitDataFormHandle()">{{ t('confirm') }}</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="__reactive.previewVisible" :title="t('product.preview')" append-to-body >
    <img :src="__reactive.previewImgUrl" style="background-color: rgb(0,0,0);width:100%;" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElLoading, ElMessage } from 'element-plus'
import type { ElForm, UploadProps, UploadUserFile } from 'element-plus'
import http from '@/utils/http'
import { uploadImgEcho } from '@/utils'
import _ from 'lodash'

const dataFormRef = ref<InstanceType<typeof ElForm>>() as any

const { t } = useI18n()

const emit = defineEmits(['refreshPageHandle'])

const dialogId = ref(0)
const uploadRef = ref()
const __reactive = reactive({
  visible: false,
  previewVisible: false,
  loading: false,
  uploadUrl: `${window.SITE_CONFIG.apiURL}/demo/product/upload/`,
  fileList: [] as UploadUserFile[],
  fileObj: {},
  previewImgUrl: '',
  uploadImageLoading: false,
  dataForm: {
    id: '',
    productName: '',
    marks: '',
    price: '',
    pic: ''
  }
}) as any

const rules = computed(() => {
  const validatePic = (rule, value, callback) => {
    if (__reactive.dataForm.pic === 'null' || !__reactive.dataForm.pic) {
      return callback(new Error(t('validate.required')))
    }
    callback()
  }
  return {
    productName: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    marks: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    price: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    pic: [{ required: true, message: t('validate.required'), valiator: validatePic, trigger: 'blur' }]
  }
})

watch([() => dialogId.value], (val1) => {
  __reactive.dataForm.id = val1[0]
})
const resetDataForm = () => {
  dataFormRef.value?.resetFields()
  uploadRef.value?.clearFiles()
  __reactive.fileList = []
  __reactive.fileObj = {}
  __reactive.previewImgUrl = ''
}
async function init() {
  __reactive.visible = true
  resetDataForm()
  await nextTick()
  if (__reactive.dataForm.id) {
    getInfo()
  }
}
// 获取信息
const getInfo = async () => {
  __reactive.loading = true
  const res = await http.get(`/demo/product/${__reactive.dataForm.id}`)
  __reactive.loading = false
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  __reactive.dataForm = _.pick(res.data, ['id', 'productName', 'marks', 'price', 'pic'])
  uploadImgEcho(__reactive.dataForm.pic, uploadRef.value)
}

const handleChange = (file, fileLists) => {
  // console.log(file, fileLists)
}
const handleUpload = async (e: any) => {
  __reactive.uploadImageLoading = true
  const formData = new FormData()
  formData.append('file', e.file)
  formData.append('fileName', e.file.name.substring(0, e.file.name.lastIndexOf('.')))
  const res: any = await http.post(__reactive.uploadUrl, formData)
  __reactive.uploadImageLoading = false
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  __reactive.fileObj.url = res.data
  __reactive.dataForm.pic = res.data
  ElMessage({
    type: 'success',
    message: '上传成功',
    duration: 500
  })
}
const handleRemove = (file, fileLists) => {
  // console.log(file, fileLists)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  __reactive.previewImgUrl = uploadFile.url!
  __reactive.previewVisible = true
}
// 表单提交
const submitDataFormHandle = _.debounce(
  () => {
    dataFormRef.value?.validate(async (valid) => {
      if (!valid) {
        return false
      }
      __reactive.loading = true
      const res = await http[!__reactive.dataForm.id ? 'post' : 'put'](
        '/demo/product',
        __reactive.dataForm,
        { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
      )
      __reactive.loading = false
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
