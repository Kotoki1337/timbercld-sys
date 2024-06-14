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
import { RouteRecordRaw } from 'vue-router'
const modules = import.meta.glob("../core/**")
// 页面路由(独立页面)
export const pageRoutes: Array<RouteRecordRaw> = [
  {
    path: '/404',
    component: modules['../core/not-found.vue'],
    name: '404',
    meta: { title: '404未找到' },
    beforeEnter(to, from, next) {
      // 拦截处理特殊业务场景
      // 如果, 重定向路由包含__双下划线, 为临时添加路由
      if (/__.*/.test(to.redirectedFrom)) {
        return next(to.redirectedFrom.replace(/__.*/, ''))
      }
      next()
    }
  },
  {
    path: '/login',
    component: modules['../core/login.vue'],
    name: 'login',
    meta: { title: '登录' }
  }
] as any
export const moduleRoutes: Array<RouteRecordRaw> = {
  path: '/',
  component: () => import("@/components/tcc-framework/tcc-framework.vue"),
  name: 'tcc-framework',
  redirect: { name: 'dashboard' },
  meta: { title: '主入口布局' },
  children: [
    {
      path: '/dashboard',
      component: modules['../core/dashboard.vue'],
      name: 'dashboard',
      meta: { title: '首页', isTab: true }
    }
  ]
} as any

const routes = pageRoutes.concat(moduleRoutes)
export default routes
