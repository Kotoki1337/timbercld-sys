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
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import TccDeptTree from '@/components/tcc-dept-tree/src/tcc-dept-tree.vue'
import I18n from '@/i18n'
import App from './App.vue'
import http from '@/utils/http'
import router from '@/router/index'

const app = createApp(App)

const pinia = createPinia()

app.config.globalProperties.$http = http
app.config.globalProperties.$icons = []
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.config.globalProperties.$icons.push(key)
  app.component(key, component)
}

app
  .use(pinia)
  .use(router)
  .use(ElementPlus)
  .use(I18n)
  .component('tcc-dept-tree', TccDeptTree)
  .mount('#app')
