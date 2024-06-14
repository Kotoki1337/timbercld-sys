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
      <el-form-item prop="id" :label="t('order.id')">
        <el-input disabled v-model="__reactive.dataForm.id" :placeholder="t('order.id')"></el-input>
      </el-form-item>
      <el-form-item prop="quantity" :label="t('order.quantity')">
        <el-input v-model="__reactive.dataForm.quantity" :placeholder="t('order.quantity')"></el-input>
      </el-form-item>
      <el-form-item prop="amount" :label="t('order.amount')">
        <el-input v-model="__reactive.dataForm.amount" :placeholder="t('order.amount')"></el-input>
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
import { ElLoading, ElMessage } from 'element-plus'
import type { ElForm, UploadProps, UploadUserFile } from 'element-plus'
import http from '@/utils/http'
// import { uploadImgEcho } from '@/utils'
import _ from 'lodash'

const dataFormRef = ref<InstanceType<typeof ElForm>>() as any
const { t } = useI18n()
const emit = defineEmits(['refreshPageHandle'])
const dialogId = ref(0)
const __reactive = reactive({
  visible: false,
  previewVisible: false,
  loading: false,
  // uploadUrl: `${window.SITE_CONFIG.apiURL}/demo/product/upload/`,
  // fileList: [] as UploadUserFile[],
  // fileObj: {},
  // previewImgUrl: '',
  // uploadImageLoading: false,
  dataForm: {
    id: '',
    quantity: '',
    amount: '',
    productId: '',
    buyerId: '',
    sellerId: '',
    address: '',
    phoneNum: '',
    recvName: '',
    creatorId: '',
    createDate: '',
    updateDate: '',
    updaterId: ''
  }
}) as any

const rules = computed(() => {
  // const validatePic = (rule, value, callback) => {
  //   if (__reactive.dataForm.pic === 'null' || !__reactive.dataForm.pic) {
  //     return callback(new Error(t('validate.required')))
  //   }
  //   callback()
  // }
  return {
    quantity: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    amount: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
    productId: [{ required: true, message: t('validate.required'), trigger: 'blur' }],
  }
})

watch([() => dialogId.value], (val1) => {
  __reactive.dataForm.id = val1[0]
})

async function init() {
  __reactive.visible = true
  resetDataForm()
  await nextTick()
  if (__reactive.dataForm.id) {
    getInfo()
  }
}

const resetDataForm = () => {
  dataFormRef.value?.resetFields()
  // uploadRef.value?.clearFiles()
  // __reactive.fileList = []
  // __reactive.fileObj = {}
  // __reactive.previewImgUrl = ''
}

// 获取信息
const getInfo = async () => {
  __reactive.loading = true
  const res = await http.get(`/order/main/${__reactive.dataForm.id}`)
  __reactive.loading = false
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  __reactive.dataForm = _.pick(res.data, [
    'id',
    'quantity',
    'amount',
    'productId',
    'buyerId',
    'sellerId',
    'address',
    'phoneNum',
    'recvName',
    'creatorId',
    'createDate',
    'updateDate',
    'updaterId'])
  // uploadImgEcho(__reactive.dataForm.pic, uploadRef.value)
}

const submitDataFormHandle = _.debounce(() => {
    dataFormRef.value?.validate(async (valid) => {
      if (!valid) {
        return false
      }
      __reactive.loading = true
      const res = await http[!__reactive.dataForm.id ? 'post' : 'put']('/order/main', __reactive.dataForm, { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
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

<style scoped>

</style>
