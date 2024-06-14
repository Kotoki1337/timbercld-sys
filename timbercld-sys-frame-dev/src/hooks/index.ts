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
import { ref, reactive, nextTick, onActivated, getCurrentInstance, Component } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import qs from 'qs'
import http from '@/utils/http'

const useHooks = () => {
  const { proxy } = getCurrentInstance() as any

  const { t } = useI18n()

  // 设置属性
  const hooksOptions = reactive({
    activatedIsNeed: true, // 此页面是否在激活（进入）时，调用查询数据列表接口？
    getListURL: '', // 数据列表接口，API地址
    needPage: false, // 数据列表接口，是否需要分页？
    deleteURL: '', // 删除接口，API地址
    multiDelete: false, // 删除接口，是否需要批量？
    multiDeleteKey: 'id', // 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
    exportURL: ''
  }) as any

  const hooksData = reactive({
    // 默认属性
    dataForm: {}, // 查询条件
    dataList: [], // 数据列表
    order: '', // 排序，asc／desc
    orderField: '', // 排序，字段
    page: 1, // 当前页码
    limit: 10, // 每页数
    total: 0, // 总条数
    dataListLoading: false, // 数据列表，loading状态
    tableDataSelectedList: [], // 数据列表，多选项
    editDialogVisible: false, // 新增／更新，弹窗visible状态
    configVisible: false, // 弹窗visible状态
    sendVisible: false, // 弹窗visible状态
    uploadVisible: false, // 弹窗visible状态
    visible: false
  }) as any

  // 获取数据列表
  const query = async () => {
    hooksData.dataListLoading = true
    await http
      .get(hooksOptions.getListURL, {
        order: hooksData.order,
        orderField: hooksData.orderField,
        page: hooksOptions.needPage ? hooksData.page : null,
        limit: hooksOptions.needPage ? hooksData.limit : null,
        ...hooksData.dataForm
      })
      .then((res: any) => {
        hooksData.dataListLoading = false
        if (res.code !== 0) {
          hooksData.dataList = []
          hooksData.total = 0
          return ElMessage.error(res.msg)
        }
        hooksData.dataList = hooksOptions.needPage ? res.data.list : res.data
        hooksData.total = hooksOptions.needPage ? res.data.total : 0
      })
      .catch((err) => {
        ElMessage.error(err.msg)
      })
  }

  // 多选
  const onListSelectionChange = (val) => {
    hooksData.tableDataSelectedList = val
  }

  // 排序
  const onListOrderChange = (data?) => {
    if (!data.order || !data.prop) {
      hooksData.order = ''
      hooksData.orderField = ''
      return false
    }
    hooksData.order = data.order.replace(/ending$/, '')
    hooksData.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
    query()
  }

  // 分页, 每页条数
  const onPageSizeChange = (val) => {
    hooksData.page = 1
    hooksData.limit = val
    query()
  }

  // 分页, 当前页
  const onPageCurrentChange = (val) => {
    hooksData.page = val
    query()
  }

  const getDataList = () => {
    hooksData.page = 1
    query()
  }

  // 新增 / 修改
  const showEditDialogHandle = async (id?) => {
    hooksData.editDialogVisible = true
    await nextTick()
    proxy.$refs.editDialogRef.dialogId = id
    proxy.$refs.editDialogRef.init()
  }

  // 删除
  const deleteHandle = (id?) => {
    if (hooksOptions.multiDelete && !id && hooksData.tableDataSelectedList.length <= 0) {
      return ElMessage({
        message: t('prompt.deleteBatch'),
        type: 'warning',
        duration: 500
      })
    }
    ElMessageBox.confirm(t('prompt.info', { handle: t('delete') }), t('prompt.title'), {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      type: 'warning'
    }).then(async () => {
      await http
        .delete(
          `${hooksOptions.deleteURL}${hooksOptions.multiDelete ? '' : `/${id}`}`,
          hooksOptions.multiDelete
            ? {
                data: id
                  ? [id]
                  : hooksData.tableDataSelectedList.map((item) => item[hooksOptions.multiDeleteKey])
              }
            : {}
        )
        .then((res) => {
          if (res.code !== 0) {
            return ElMessage.error(res.msg)
          }
          ElMessage({
            message: t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              query()
            }
          })
        })
        .catch((err) => {
          ElMessage.error(err.msg)
        })
    })
  }

  // 导出
  const exportHandle = () => {
    const params = qs.stringify({
      token: Cookies.get('token'),
      ...hooksData.dataForm
    })
    window.location.href = `${window.SITE_CONFIG.apiURL}${hooksOptions.exportURL}?${params}`
  }

  onActivated(() => {
    if (hooksOptions.activatedIsNeed) {
      query()
    }
  })

  return {
    hooksOptions,
    hooksData,
    getDataList,
    showEditDialogHandle,
    onListSelectionChange,
    onListOrderChange,
    onPageSizeChange,
    onPageCurrentChange,
    getSelection,
    deleteHandle,
    exportHandle
  }
}
export default useHooks
