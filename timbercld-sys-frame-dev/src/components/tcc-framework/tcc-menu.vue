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
  <aside :class="`tccui-${store.$state.menuDisplayName[store.$state.menuDisplay]} tccui-${store.$state.menuDisplayName[store.$state.menuDisplay]}--dark`">
    <div :class="`tccui-${store.$state.menuDisplayName[store.$state.menuDisplay]}__inner`">
      <el-menu
        :mode="store.$state.menuDisplay"
        :default-active="store.$state.activeMenu"
        :collapse="store.$state.menuFold"
        :unique-opened="true"
        :collapse-transition="false"
        :ellipsis="false"
        :class="`tccui-${store.$state.menuDisplayName[store.$state.menuDisplay]}__menu`"
        router
      >
        <sub-menu v-for="(menu, index) in store.$state.menuList" :key="index" :menu="menu" />
      </el-menu>
    </div>
  </aside>
</template>

<script setup lang="ts">
import useStore from '@/store'

import SubMenu from './tcc-sub-menu.vue'

const store = useStore()
store.$state.menuList = window.SITE_CONFIG.menuList
</script>
