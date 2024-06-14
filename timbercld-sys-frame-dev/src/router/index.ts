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
import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import routes, { moduleRoutes, pageRoutes } from './routes'
import http from '@/utils/http'
import { isURL } from '@/utils/validate'
const coreModules = import.meta.glob("../core/**")
const demoModules = import.meta.glob("../views/**")
const modules = Object.assign(coreModules, demoModules)
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { top: 0 }
  }
}) as any

router.beforeEach(async (to, from, next) => {
  // 添加动态(菜单)路由
  // 已添加或者当前路由为页面路由, 可直接访问
  if (window.SITE_CONFIG.isDynamicRoutes || isPageRoute(to, pageRoutes)) {
    return next()
  }
  try {
    // 获取菜单列表, 添加并全局变量保存
    const navRes = await http.get('/system/menu/nav')
    if (navRes.code !== 0) {
      ElMessage.error(navRes.msg)
      next({ name: 'login' })
    }
    window.SITE_CONFIG.menuList = navRes.data
    getDynamicRoutes(window.SITE_CONFIG.menuList)
    next({ ...to, replace: true })
  } catch (err) {
    next('/login')
  }
})
/**
 * 判断当前路由是否为页面路由
 * @param {*} route 当前路由
 * @param {*} pageRouteArr 页面路由
 */
const isPageRoute = (route, pageRouteArr = [] as any) => {
  let temp = []
  for (let i = 0; i < pageRouteArr.length; i++) {
    const item = pageRouteArr[i]
    if (route.path === item.path) {
      return true
    }
    if (item.children && item.children.length >= 1) {
      temp = temp.concat(item.children)
    }
  }
  return temp.length >= 1 ? isPageRoute(route, temp) : false
}
/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routeArr 递归创建的动态(菜单)路由
 */
const getDynamicRoutes = (menuList = [] as any, routeArr = [] as any) => {
  let temp = []
  for (let i = 0; i < menuList.length; i++) {
    const item = menuList[i]
    if (item.children && item.children.length >= 1) {
      temp = temp.concat(item.children)
      continue
    }
    // 组装路由
    const routeObj = {
      path: '',
      component: '',
      name: '',
      meta: {
        ...window.SITE_CONFIG.defaultTab,
        menuId: item.id,
        title: item.name
      }
    } as any
    // eslint-disable-next-line
    let URL = item.url.replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
    if (isURL(URL)) {
      routeObj.path = routeObj.name = `i-${item.id}`
      routeObj.meta.iframeURL = URL
      routeObj.component = modules['../core/web-view.vue']
    } else {
      URL = URL.replace(/^\//, '').replace(/_/g, '-')
      routeObj.path = URL.replace(/\//g, '-')
      routeObj.name = URL.replace(/\//g, '-')
      let modulesUrl = `../${URL.indexOf('demo') > -1 ? 'views' : 'core'}/${URL.indexOf('.html') > -1 ? URL : `${URL}.vue`}`
      routeObj.component = modules[modulesUrl]
    }
    routeArr.push(routeObj)
  }
  if (temp.length >= 1) {
    return getDynamicRoutes(temp, routeArr)
  }
  // 添加路由
  router.addRoute({
    ...moduleRoutes,
    name: 'dynamic-menu',
    children: routeArr
  })
  router.addRoute({
    path: '/:path(.*)*',
    redirect: { name: '404' }
  })
  window.SITE_CONFIG.dynamicMenuRoutes = routeArr
  window.SITE_CONFIG.isDynamicRoutes = true
}
export default router
