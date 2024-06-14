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
  <el-sub-menu
    v-if="$props.menu.children && $props.menu.children.length >= 1"
    :index="$props.menu.id"
    :teleported="false"
  >
    <template #title>
      <el-tooltip
        effect="dark"
        :content="$props.menu.name"
        placement="right-start"
      >
        <div>
          <el-icon class="tccui-sidebar__menu-icon"><component :is="$props.menu.icon" /></el-icon>
          <span style="padding-left: 5px;" v-if="!store.$state.menuFold">{{ $props.menu.name }}</span>
        </div>
      </el-tooltip>
    </template>
    <tcc-sub-menu v-for="item in $props.menu.children" :key="item.id" :menu="item"></tcc-sub-menu>
  </el-sub-menu>
  <el-menu-item
    v-else-if="$props.menu.target !== '_blank'"
    :index="$props.menu.id"
    :route="{ path: '/dashboard' }"
    @click="gotoRouteHandle($props.menu.id, $props.menu.target)"
  >
    <el-icon class="tccui-sidebar__menu-icon"><component :is="$props.menu.icon" /></el-icon>
    <span style="padding-left: 5px;">{{ $props.menu.name }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import TccSubMenu from './tcc-sub-menu.vue'
import useStore from '@/store'
const store = useStore()

const router = useRouter()

const props = defineProps({
  menu: {
    type: Object,
    required: true
  }
})
// 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
const gotoRouteHandle = (menuId, menuTarget) => {
  const routeObj = window.SITE_CONFIG.dynamicMenuRoutes.filter(
    (item) => item.meta.menuId === menuId
  )[0]
  if (routeObj) {
    if (menuTarget === 'blank') {
      const routeData:any = router.resolve({ name: routeObj.name })
      window.open(routeData.meta.iframeURL, '_blank')
    } else {
      router.push({ name: routeObj.name })
    }
  }
}
</script>
