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
  <nav class="tccui-navbar tccui-navbar--colorful">
    <div class="tccui-navbar__header" @click="$router.push({ name: 'dashboard' })">
      <div class="logo-svg">
        <img src="@/assets/img/logo.svg" />
      </div>
      <div class="tccui-navbar__brand" v-if="!store.$state.menuFold">
        <span class="tccui-navbar__brand-lg" href="javascript:;">{{ t('brand.lg') }}</span>
        <span class="tccui-navbar__brand-mini" href="javascript:;">{{ t('brand.mini') }}</span>
      </div>
    </div>
    <div class="tccui-navbar__body">
      <el-menu class="tccui-navbar__menu mr-auto" mode="horizontal" :ellipsis="false" v-if="store.$state.menuDisplay === 'vertical'">
        <el-menu-item index="1" @click="store.$patch({ menuFold: !store.$state.menuFold })">
          <el-icon class="tccui-navbar__icon-menu tccui-navbar__icon-menu--switch"><Fold /></el-icon>
        </el-menu-item>
        <el-menu-item index="2" @click="emit('refreshHandle')">
          <el-icon class="tccui-navbar__icon-menu tccui-navbar__icon-menu--refresh"><Refresh /></el-icon>
        </el-menu-item>
      </el-menu>
      <tcc-menu v-if="store.$state.menuDisplay === 'horizontal'" />
      <el-menu class="tccui-navbar__menu tccui-navbar__menu__right" mode="horizontal" :ellipsis="false">
        <el-menu-item index="1">
          <el-dropdown placement="bottom" :hide-on-click="false" :show-timeout="0" popper-class="lang-popper">
            <span>{{ t('_lang') }}<el-icon size="14"><ArrowDown /></el-icon></span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(val, key) in __reactive.i18nMessages"
                  :key="key"
                  @click="$i18n.locale = val.locale"
                  >{{ val.data._lang }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-menu-item>
        <el-menu-item index="2">
          <a href="https://www.timbercld.com/#/" target="_blank">
            <el-icon><ChromeFilled /></el-icon>
          </a>
        </el-menu-item>
        <el-menu-item index="3" @click="fullscreenHandle()">
          <el-icon class="tccui-navbar__icon-menu"><FullScreen /></el-icon>
        </el-menu-item>
        <el-menu-item index="4" class="tccui-navbar__avatar">
          <el-dropdown placement="bottom" :show-timeout="0" popper-class="user-popper">
            <span class="el-dropdown-link">
              <img src="@/assets/img/man.png" />
              <span>{{ userStore.$state.name }}</span>
              <el-icon size="14"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="updatePasswordHandle()">{{
                  t('updatePassword.title')
                }}</el-dropdown-item>
                <el-dropdown-item @click="logoutHandle()">{{ t('logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password
      v-if="__reactive.updatePassowrdVisible"
      ref="updatePassowrdRef"
    ></update-password>
  </nav>
</template>

<script setup lang="ts">
import screenfull from 'screenfull'
import { reactive, nextTick, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { clearLogin } from '@/utils'
import UpdatePassword from './tcc-update-password.vue'
import { messages } from '@/i18n'
import http from '@/utils/http'
import useStore from '@/store'
import useUserStore from '@/store/user'
import TccMenu from './tcc-menu.vue'

const { proxy } = getCurrentInstance() as any

const store = useStore()
const userStore = useUserStore()

const { t } = useI18n()

const router = useRouter()

const emit = defineEmits(['refreshHandle'])

const messagesList = [] as any
for (const key in messages) {
  messagesList.push({
    locale: key,
    data: messages[key]
  })
}

const imgList = import.meta.glob('../../assets/img/**.png')

const __reactive = reactive({
  i18nMessages: messagesList,
  updatePassowrdVisible: false,
  avatarUrl: imgList[`../../assets/img/${userStore.$state.gender === 1 ? 'woman' : 'man'}.png`]
}) as any

// 全屏
const fullscreenHandle = () => {
  if (!screenfull.isEnabled) {
    return ElMessage({
      message: t('fullscreen.prompt'),
      type: 'warning',
      duration: 500
    })
  }
  screenfull.toggle()
}
// 修改密码
const updatePasswordHandle = async () => {
  __reactive.updatePassowrdVisible = true
  await nextTick()
  proxy.$refs.updatePassowrdRef.init()
}
// 退出
const logoutHandle = () => {
  ElMessageBox.confirm(t('prompt.info', { handle: t('logout') }), t('prompt.title'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  })
    .then(async () => {
      const res = await http.post('/logout')
      if (res.code !== 0) {
        return ElMessage.error(res.msg)
      }
      clearLogin()
      router.replace({ name: 'login' })
    })
    .catch(() => {})
}
</script>
