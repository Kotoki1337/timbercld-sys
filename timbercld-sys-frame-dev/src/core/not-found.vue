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
  <div class="tccui-wrapper tccui-page__not-found">
    <div class="tccui-content__wrapper">
      <div class="tccui-content">
        <h2 class="title">404</h2>
        <p class="desc" v-html="t('notFound.desc')"></p>
        <div class="btn-bar">
          <el-button @click="router.go(-1)">{{ t('notFound.back') }}</el-button>
          <el-button type="primary" @click="router.push({ name: 'dashboard' })">{{
            t('notFound.dashboard')
          }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
</script>
