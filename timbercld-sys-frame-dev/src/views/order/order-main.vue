<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-order__order_main">
    订单列表
    </div>
  </el-card>
</template>

<script setup lang="ts">
import EditDialog from './order-main-edit-dialog.vue'
import { watch } from 'vue'
import useHooks from '@/hooks'
import { hasPermission } from '@/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const {
  hooksOptions,
  hooksData,
  getDataList,
  onPageSizeChange,
  onPageCurrentChange,
  deleteHandle,
  showEditDialogHandle
} = useHooks()

hooksOptions.getListURL = '/demo/product/page'
hooksOptions.needPage = true
hooksOptions.deleteURL = '/demo/product/'
hooksOptions.multiDelete = false

hooksData.dataForm = {
  name: ''
}

</script>

<style scoped>
</style>
