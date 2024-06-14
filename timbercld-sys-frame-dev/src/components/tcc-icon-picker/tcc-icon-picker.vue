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
  <el-popover trigger="click" popper-class="icon-picker-popover" placement="bottom-start">
    <template #reference>
      <el-input readonly :icon="modelValue" placeholder="请选择图标" :value="modelValue"></el-input>
    </template>
    <div class="icon-picker">
      <div class="icon-list">
        <div :alert="icon" @click="emits('update:modelValue', icon)" :class="{'icon-item': true, 'icon-active': icon == modelValue}" v-for="icon in globalProperties.$icons" :key="icon">
          <el-tooltip
            effect="dark"
            :content="icon"
            placement="top-start"
          >
            <el-button :class="[icon, 'icon']" link :icon="icon"></el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { ComponentInternalInstance, getCurrentInstance } from 'vue'

const { appContext: {app: { config: { globalProperties } } } } = getCurrentInstance() as ComponentInternalInstance

interface Props {
  modelValue: string
}
const props = defineProps<Props>()

const emits = defineEmits(['update:modelValue'])
</script>

<style lang="scss">
.icon-picker-popover {
  width: 500px!important;
}
.icon-picker {
  width: 478px;
  max-height: 258px;
  overflow-y: scroll;
}

.icon-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .icon-item {
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    margin-right: 5px;
    margin-bottom: 5px;
    cursor: pointer;
    &:hover {
      background-color: var(--el-color-primary);
      .icon {
        color: var(--color-white);
      }
    }
    &.icon-active {
      background-color: var(--el-color-primary);
      .icon {
        color: var(--color-white);
      }
    }
    .icon {
      width: 24px;
      color: var(--el-text-color-regular);
      font-size: 20px;
      border-radius: 4px;
      text-align: center;
      line-height: 45px;
      margin: 5px;
    }
  }
}
</style>

