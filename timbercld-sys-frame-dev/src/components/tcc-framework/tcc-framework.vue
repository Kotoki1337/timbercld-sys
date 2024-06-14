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
  <div
    v-loading.fullscreen.lock="frameworkData.loading"
    :element-loading-text="t('loading')"
    :class="['tccui-wrapper', { 'tccui-sidebar--fold': store.$state.menuFold, 'tccui-topbar--wrapper': store.$state.menuDisplay !== 'vertical' }]"
  >
    <template v-if="!frameworkData.loading">
      <navbar @refreshHandle="refresh" />
      <div class="tccui-content__wrapper">
        <tcc-menu v-if="store.$state.menuDisplay === 'vertical'" />
        <content v-if="!store.$state.isNeedRefresh" />
      </div>
      <theme-tools ref="themeToolsRef" />
    </template>
  </div>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce'
import { useRoute } from 'vue-router'
import { reactive, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import Navbar from './tcc-navbar.vue'
import TccMenu from './tcc-menu.vue'
import Content from './tcc-content.vue'
import ThemeTools from './tcc-theme-tools.vue'
import useStore from '@/store'
import useUserStore from '@/store/user'
import http from '@/utils/http'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const userStore = useUserStore()
const route = useRoute()
const refresh = async () => {
  store.$state.isNeedRefresh = true
  await nextTick()
  store.$state.isNeedRefresh = false
}
const frameworkData = reactive({
  loading: true
})
// 窗口改变大小
const windowResizeHandle = () => {
  store.$state.menuFold = document.documentElement.clientWidth <= 1200 || false
  window.addEventListener(
    'resize',
    debounce(() => {
      store.$state.menuFold = document.documentElement.clientWidth <= 1200 || false
    }, 150)
  )
}
// 路由, 监听
const routeHandle = (routes) => {
  if (!routes.meta.isTab) {
    return false
  }
  let tab = store.$state.contentTabList.filter((item) => item.name === routes.name)[0]
  if (!tab) {
    tab = {
      ...window.SITE_CONFIG.defaultTab,
      ...routes.meta,
      name: routes.name,
      params: { ...routes.params },
      query: { ...routes.query }
    }
    store.$state.contentTabList = store.$state.contentTabList.concat(tab)
  }
  store.$state.activeMenu = tab.menuId
  store.$state.activeTab = tab.name
}
watch([route, () => frameworkData.loading], async (val) => {
  if (val[0]) {
    routeHandle(val[0])
  }
})
// 获取当前管理员信息
const getUserInfo = async () => {
  const res:any = await http.get('/system/user/info')
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  userStore.$state.id = res.data.id
  userStore.$state.name = res.data.username
  userStore.$state.superAdmin = res.data.superAdmin
  userStore.$state.superSubSystem = res.data.superSubSystem
  userStore.$state.realName = res.data.realName
}
// 获取权限
const getPermissions = async () => {
  const res = await http.get('/system/menu/permissions')
  if (res.code !== 0) {
    return ElMessage.error(res.msg)
  }
  window.SITE_CONFIG.permissions = res.data
}

windowResizeHandle()
routeHandle(route)

Promise.all([getUserInfo(), getPermissions()]).then(() => {
  frameworkData.loading = false
})
</script>
