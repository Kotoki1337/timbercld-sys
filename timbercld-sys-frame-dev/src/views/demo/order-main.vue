<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-order__order_main">
      <el-form :inline="true" :model="hooksData.dataForm" @keyup.enter="getDataList()">
        <el-form-item>
          <el-input
              v-model="hooksData.dataForm.address"
              :placeholder="t('order.address')"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showEditDialogHandle()">{{ t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
          v-loading="hooksData.dataListLoading"
          :data="hooksData.dataList"
          border
          style="width: 100%">
        <el-table-column
            type="index"
            :label="t('index')"
            header-align="center"
            align="center"
            width="50"
        ></el-table-column>
        <el-table-column
            :label="t('handle')"
            header-align="center"
            align="center"
            width="150">
          <template #default="scope">
            <el-button link size="small" @click="showEditDialogHandle(scope.row.id)">{{
              t('update')
              }}</el-button>
            <el-button link size="small" @click="deleteHandle(scope.row.id)">{{
              t('delete')
              }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
            prop="id"
            :label="t('order.id')"
            header-align="center"
            width="180"
            align="center"
        ></el-table-column>
        <el-table-column
            prop="quantity"
            :label="t('order.quantity')"
            header-align="center"
            align="center"
            min-width="200"
        ></el-table-column>
        <el-table-column
            prop="amount"
            :label="t('order.amount')"
            header-align="center"
            align="center"
            width="100"
        ></el-table-column>
        <el-table-column
            prop="productId"
            :label="t('order.productId')"
            header-align="center"
            align="center"
            width="180">
        </el-table-column>
        <el-table-column
            prop="creatorId"
            :label="t('order.creatorId')"
            header-align="center"
            align="center"
            width="180"
        ></el-table-column>
        <el-table-column
            prop="createDate"
            :label="t('order.createDate')"
            header-align="center"
            align="center"
            width="180"
        ></el-table-column>
        <el-table-column
            prop="updaterId"
            :label="t('order.updaterId')"
            header-align="center"
            align="center"
            width="180"
        ></el-table-column>
        <el-table-column
            prop="updateDate"
            :label="t('order.updateDate')"
            header-align="center"
            align="center"
            width="180"
        ></el-table-column>
      </el-table>
      <el-pagination
          :current-page="hooksData.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="hooksData.limit"
          :total="hooksData.total"
          layout="total, sizes, prev, pager, next, jumper"
          :small="true"
          @size-change="onPageSizeChange"
          @current-change="onPageCurrentChange">
      </el-pagination>
      <edit-dialog
          v-if="hooksData.editDialogVisible"
          ref="editDialogRef"
          @refreshPageHandle="getDataList">
      </edit-dialog>
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

hooksOptions.getListURL = '/order/main/page'
hooksOptions.needPage = true
hooksOptions.deleteURL = '/order/main/'
hooksOptions.multiDelete = false

hooksData.dataForm = {
  address: ''
}

watch([() => hooksData.daterange], (val1) => {
  hooksData.dataForm.startDate = val1[0][0]
  hooksData.dataForm.endDate = val1[0][1]
})

</script>

<style scoped>
</style>
