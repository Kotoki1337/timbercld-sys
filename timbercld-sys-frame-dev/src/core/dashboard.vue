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
  <el-card shadow="never" class="tccui-card--fill backimg nopad">
    <div class="dashboard">
      <el-row class="pad">
        <el-col>
          <h4 style="margin-top: 0">{{ userStore.$state.realName }}，欢迎使用！</h4>
          <h4 class="fc-blue"><b>温馨提示：</b></h4>
          <p>1.首次登录系统后，请及时修改密码；</p>
          <p>2.推荐使用Chrome浏览器；</p>
          <p>
            3.右上角点击
            <el-tooltip placement="right" effect="light">
              <template #content>
                <el-icon><FullScreen /></el-icon>
              </template>
              <span class="cursor-pointr" @click="fullscreenHandle()">“全屏”</span> </el-tooltip
            >使用，效果更佳。
          </p>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/user'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const userStore = useUserStore()

function fullscreenHandle() {
  if (!screenfull.isEnabled) {
    return ElMessage({
      message: t('fullscreen.prompt'),
      type: 'warning',
      duration: 500
    })
  }
  screenfull.toggle()
}
</script>
<style lang="scss" scoped></style>
