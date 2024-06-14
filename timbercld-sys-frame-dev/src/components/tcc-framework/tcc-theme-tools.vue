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
  <Transition>
    <div class="tccui-theme-tools__mask" v-if="__reactive.isOpen" @click="__reactive.isOpen = false"></div>
  </Transition>
  <div class="tccui-theme-tools" :class="{ 'tccui-theme-tools--open': __reactive.isOpen }">
    <div class="tccui-theme-tools__toggle" @click="__reactive.isOpen = !__reactive.isOpen">
      <el-icon><MagicStick /></el-icon>
    </div>
    <div class="tccui-theme-tools__content">
      <div class="tccui-theme-tools__item">
        <h3>{{ t('theme.current') }}</h3>
        <div class="color-list">
          <div class="color-item">
            <el-color-picker v-model="__reactive.color" @change="colorPickerChange" />
          </div>
        </div>
      </div>
      <div class="tccui-theme-tools__item">
        <h3>{{ t('theme.color') }}</h3>
        <div class="color-list">
          <div :class="{'color-item': true, 'disabled-item': item.name !== 'custom'}" v-for="(item, i) in __reactive.themeList" @click="item.name !== 'custom' && colorClickHandle(item)">
            <el-icon color="var(--text-color-set)" class="check-item" v-if="item.name === store.$state.themeColor && item.name !== 'custom'"><Check /></el-icon>
            <el-color-picker :key="i" v-model="item.color" :disabled="item.name !== 'custom'" v-if="item.name !== 'custom'"/>
          </div>
        </div>
      </div>
      <div class="tccui-theme-tools__item">
        <h3>{{ t('theme.menu') }}</h3>
        <div class="nav-style-list">
          <div :class="{item: true, 'active-item': store.$state.menuDisplay === 'vertical'}" @click="changeMenuDisplay('vertical')">
            <div class="__left __content">
              <div class="side"></div>
              <div class="head"></div>
              <div class="content"></div>
            </div>
          </div>
          <div :class="{item: true, 'active-item': store.$state.menuDisplay === 'horizontal'}" @click="changeMenuDisplay('horizontal')">
            <div class="__top __content">
              <div class="head"></div>
              <div class="content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { setThemeStyle } from '@/utils'

import useStore from '@/store'
import themeList from '@/theme/config'

const { t } = useI18n()

const store = useStore()
const __reactive = reactive({
  isOpen: false,
  themeList,
  color: store.$state.color || '#0052D9',
})

const customColor = themeList.filter(item => item.name === 'custom')[0]
const colorClickHandle = (item) => {
  __reactive.color = item.color
  customColor.color = item.color
  store.$state.themeColor = item.name
  store.$state.color = item.color
  localStorage.setItem('themeColor', store.$state.themeColor)
  localStorage.setItem('color', store.$state.color)
  setThemeStyle(__reactive.color)
}
const colorPickerChange = (e) => {
  __reactive.color = e
  customColor.color = e
  store.$state.themeColor = 'custom'
  store.$state.color = e
  localStorage.setItem('themeColor', store.$state.themeColor)
  localStorage.setItem('color', store.$state.color)
  setThemeStyle(__reactive.color)
}
const changeMenuDisplay = (val) => {
  store.$state.menuDisplay = val
  localStorage.setItem('menuDisplay', val)
}
</script>
<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

:deep(.el-color-picker__icon) {
  color: var(--text-color-set);
}
.color-list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  .color-item {
    margin-bottom: 8px;
    margin-right: 8px;
    position: relative;
    .check-item {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: block!important;
      z-index: 1;
      font-size: 12px;
    }
    &.disabled-item {
      :deep(.el-color-picker__trigger) {
        cursor: pointer!important;
      }
      :deep(.el-color-picker__mask) {
        display: none;
      }
      :deep(.el-icon) {
        display: none;
      }
    }
  }
}
.nav-style-list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .item {
    padding: 5px;
    cursor: pointer;
    border: 2px solid var(--el-border-color);
    border-radius: 4px;
    transition: border-color .2s ease-in-out;
    &:hover {
      border-color: var(--el-color-primary);
    }
    &.active-item {
      border-color: var(--el-color-primary);
    }
    & + .item {
      margin-left: 5px;
    }
    .__content {
      position: relative;
      height: 36px;
      width: 60px;
      border-radius: 4px;
      overflow: hidden;
      .head {
        height: 8px;
        background-color: rgb(188,196,208);
      }
      .side {
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 12px;
        background: rgb(19, 22, 27);
      }
      .content {
        height: 28px;
        background: rgb(214,219,227);
      }
      &.__top {
        .head {
          background: rgb(19, 22, 27);
        }
      }
    }
  }
}
</style>
