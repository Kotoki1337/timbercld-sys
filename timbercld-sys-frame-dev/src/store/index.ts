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
import { defineStore } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'

export default defineStore({
  id: 'globalState',
  state: () => ({
    // 主题色
    theme: 'light',
    themeColor: 'timbercld',
    color: '#0052D9',
    menuDisplay: 'horizontal', // vertical侧边栏 horizontal顶部导航栏
    menuDisplayName: {
      'vertical': 'sidebar',
      'horizontal': 'topbar'
    },
    navLogoUrl: new URL('../assets/img/logo_2.png', import.meta.url).href,
    // 侧边栏, 折叠状态
    menuFold: false,
    // 侧边栏, 菜单
    menuList: [],
    activeMenu: '',
    // 内容, 是否需要刷新
    isNeedRefresh: false,
    // 内容, 标签页(默认添加首页)
    contentTabList: [
      {
        ...window.SITE_CONFIG.defaultTab,
        name: 'dashboard',
        title: 'dashboard'
      }
    ],
    activeTab: 'dashboard'
  }),
  getters: {},
  actions: {
    // 重置vuex本地储存状态
    resetStore() {
      Object.keys(this).forEach((key) => {
        this[key] = cloneDeep(window.SITE_CONFIG.storeState[key])
      })
    }
  }
})
