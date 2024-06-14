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
  <el-config-provider :locale="locale === 'zh-CN' ? zhCn : locale === 'en-US' ? en : zhTw">
    <router-view v-slot="{ Component }">
      <transition name="el-fade-in-linear">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </el-config-provider>
</template>
<script setup lang="ts">
import Cookies from 'js-cookie'
import { useRoute } from 'vue-router'
import { watch, unref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { messages } from '@/i18n'
import { setThemeStyle } from '@/utils'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import zhTw from 'element-plus/dist/locale/zh-tw.mjs'
import useStore from '@/store'

const i18n = useI18n()
const route = useRoute()
const store = useStore()

const locale = unref(Cookies.get('language'))
const theme = unref(localStorage.getItem('theme'))
const themeColor = unref(localStorage.getItem('themeColor'))
const color = unref(localStorage.getItem('color'))
const menuDisplay = unref(localStorage.getItem('menuDisplay'))
if (theme && theme !== 'null') {
  store.$state.theme = theme
}
if (themeColor && themeColor !== 'null') {
  store.$state.themeColor = themeColor
}
if (color && color !== 'null') {
  store.$state.color = color
}
if (menuDisplay && menuDisplay !== 'null') {
  store.$state.menuDisplay = menuDisplay
}

const i18nHandle = (v1, v2?) => {
  Cookies.set('language', v1)
  document.title = messages[v1].brand.lg
  // 非登录页面，切换语言刷新页面
  if (route.name !== 'login' && v2) {
    window.location.reload()
  }
}
onMounted(() => {
  setThemeStyle(store.$state.color)
})
watch(
  () => i18n.locale.value,
  (val1, val2) => {
    i18nHandle(val1, val2)
  }
)
i18nHandle(i18n.locale.value)
</script>
