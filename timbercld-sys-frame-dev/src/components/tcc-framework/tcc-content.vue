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
  <main :class="['tccui-content', { 'tccui-content--tabs': route.meta.isTab }]">
    <!-- tab展示内容 -->
    <template v-if="route.meta.isTab">
      <el-dropdown class="tccui-content--tabs-tools" popper-class="tabs-tools-popper">
        <el-icon><ArrowDown /></el-icon>
        <template #dropdown>
          <el-dropdown-menu :show-timeout="0">
            <el-dropdown-item @click="onRemoveTab(store.$state.activeTab)">{{
              t('contentTabList.closeCurrent')
            }}</el-dropdown-item>
            <el-dropdown-item @click="onCloseOtherTab()">{{
              t('contentTabList.closeOther')
            }}</el-dropdown-item>
            <el-dropdown-item @click="onCloseAllTab()">{{
              t('contentTabList.closeAll')
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-tabs
        v-model="store.$state.activeTab"
        @tab-click="onTabSelecte"
        @tab-remove="onRemoveTab"
      >
        <el-tab-pane
          v-for="item in store.$state.contentTabList"
          :key="item.name"
          :name="item.name"
          :label="item.title"
          :closable="item.name !== 'dashboard'"
          :class="{ 'is-iframe': tabIsIframe(item.iframeURL) }"
        >
          <template v-if="item.name === 'dashboard'" #label>
            <el-icon class="tccui-content--tabs-icon-nav"><HomeFilled /></el-icon>
          </template>
          <template v-if="tabIsIframe(item.iframeURL)">
            <iframe
              :src="item.iframeURL"
              width="100%"
              height="100%"
              frameborder="0"
              scrolling="yes"
            ></iframe>
          </template>
          <template v-else>
            <router-view
              v-slot="{ Component }"
              v-if="item.name === store.$state.activeTab"
            >
              <keep-alive>
                <component :is="Component"></component>
              </keep-alive>
            </router-view>
          </template>
        </el-tab-pane>
      </el-tabs>
    </template>
    <!-- 其他方式, 展示内容 -->
    <template v-else>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </template>
  </main>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import useStore from '@/store'
import { isURL } from '@/utils/validate'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const route = useRoute()
// tabs, 是否通过iframe展示
const tabIsIframe = (url) => {
  return isURL(url)
}
// tabs, 选中tab
const onTabSelecte = (tabData) => {
  const tab = store.$state.contentTabList.filter((item) => item.name === tabData.props.name)[0]
  if (tab) {
    router.push({
      name: tab.name,
      params: { ...tab.params },
      query: { ...tab.query }
    })
  }
}
// tabs, 删除tab
const onRemoveTab = (tabName) => {
  if (tabName === 'dashboard') {
    return false
  }
  store.$patch({ contentTabList: store.$state.contentTabList.filter((item) => item.name !== tabName) })
  if (store.$state.contentTabList.length <= 0) {
    store.$patch({ activeMenu: 'dashboard' })
    return false
  }
  // 当前选中tab被删除
  if (tabName === store.$state.activeTab) {
    router.push({ name: store.$state.contentTabList[store.$state.contentTabList.length - 1].name })
  }
}
// tabs, 关闭其它
const onCloseOtherTab = () => {
  store.$patch({
    contentTabList: store.$state.contentTabList.filter((item) => {
      return item.name === 'dashboard' || item.name === store.$state.activeTab
    })
  })
}
// tabs, 关闭全部
const onCloseAllTab = () => {
  store.$patch({
    contentTabList: store.$state.contentTabList.filter((item) => item.name === 'dashboard')
  })
  router.push({ name: 'dashboard' })
}
</script>
