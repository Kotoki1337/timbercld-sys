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
import Cookies from 'js-cookie'
import * as echarts from 'echarts'
import '@/store/store'
import useStore from '@/store'
const store = useStore()
/**
 * 权限
 * @param {*} key
 */
export function hasPermission(key) {
  return window.SITE_CONFIG.permissions.indexOf(key) !== -1 || false
}

/**
 * 清除登录信息
 */
export function clearLogin() {
  store.resetStore()
  Cookies.remove('token')
  window.SITE_CONFIG.isDynamicRoutes = false
}

/**
 * 获取uuid
 */
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r0x3' as any | '0x8' as any).toString(16)
  })
}

/**
 * 获取svg图标(id)列表
 */
export function getIconList() {
  const res = [] as any
  const list = document.querySelectorAll('svg symbol')
  for (let i = 0; i < list.length; i += 1) {
    res.push(list[i].id)
  }

  return res
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = 'id', pid = 'pid') {
  const res = [] as any
  const temp = {} as any
  for (let i = 0; i < data.length; i += 1) {
    temp[data[i][id]] = data[i]
  }
  for (let k = 0; k < data.length; k += 1) {
    if (!temp[data[k][pid]] || data[k][id] === data[k][pid]) {
      res.push(data[k])
      continue
    }
    if (!temp[data[k][pid]].children) {
      temp[data[k][pid]].children = []
    }
    temp[data[k][pid]].children.push(data[k])
    data[k]._level = (temp[data[k][pid]]._level || 0) + 1
  }
  return res
}

/**
 * 修改主题
 * @param {*} primaryColor
 */
export function setThemeStyle (primaryColor) {
  const el = document.documentElement
  el.style.setProperty('--el-color-primary', primaryColor)
  el.style.setProperty('--el-color-primary-light-1', `color-mix(in srgb, #fff, ${primaryColor} 90%)`)
  el.style.setProperty('--el-color-primary-light-2', `color-mix(in srgb, #fff, ${primaryColor} 80%)`)
  el.style.setProperty('--el-color-primary-light-3', `color-mix(in srgb, #fff, ${primaryColor} 70%)`)
  el.style.setProperty('--el-color-primary-light-4', `color-mix(in srgb, #fff, ${primaryColor} 60%)`)
  el.style.setProperty('--el-color-primary-light-5', `color-mix(in srgb, #fff, ${primaryColor} 50%)`)
  el.style.setProperty('--el-color-primary-light-6', `color-mix(in srgb, #fff, ${primaryColor} 40%)`)
  el.style.setProperty('--el-color-primary-light-7', `color-mix(in srgb, #fff, ${primaryColor} 30%)`)
  el.style.setProperty('--el-color-primary-light-8', `color-mix(in srgb, #fff, ${primaryColor} 20%)`)
  el.style.setProperty('--el-color-primary-light-9', `color-mix(in srgb, #fff, ${primaryColor} 10%)`)
  el.style.setProperty('--el-color-primary-dark-1', `color-mix(in srgb, #000, ${primaryColor} 90%)`)
  el.style.setProperty('--el-color-primary-dark-2', `color-mix(in srgb, #000, ${primaryColor} 80%)`)
  el.style.setProperty('--el-color-primary-dark-3', `color-mix(in srgb, #000, ${primaryColor} 70%)`)
  el.style.setProperty('--el-color-primary-dark-4', `color-mix(in srgb, #000, ${primaryColor} 60%)`)
  el.style.setProperty('--el-color-primary-dark-5', `color-mix(in srgb, #000, ${primaryColor} 50%)`)
  el.style.setProperty('--el-color-primary-dark-6', `color-mix(in srgb, #000, ${primaryColor} 40%)`)
  el.style.setProperty('--el-color-primary-dark-7', `color-mix(in srgb, #000, ${primaryColor} 30%)`)
  el.style.setProperty('--el-color-primary-dark-8', `color-mix(in srgb, #000, ${primaryColor} 20%)`)
  el.style.setProperty('--el-color-primary-dark-9', `color-mix(in srgb, #000, ${primaryColor} 10%)`)

  el.style.setProperty('--text-color-set', `var(--color-${checkDark(primaryColor) ? 'black' : 'white'})`)
  el.style.setProperty('--tabs-text-color', `var(${isBlack(primaryColor) ? '--color-black' : '--el-color-primary'})`)
  el.style.setProperty('--timbercld-logo-color', `var(${checkDark(primaryColor) ? '--color-timbercld' : '--color-white'})`)
}

/**
 * 判断颜色深浅度 深 字体亮 浅 字体暗
 * @param color
 */
export function checkDark (color) {
  let r = parseInt(color.substring(1,3),16)* 0.299
  let g = parseInt(color.substring(3,5),16)* 0.587
  let b = parseInt(color.substring(5,7),16)* 0.114
  let isDark = r + g + b
  return isDark > 131
}

/**
 * 判断颜色深浅度 深 字体亮 浅 字体暗
 * @param color
 */
export function isBlack (color) {
  let r = parseInt(color.substring(1,3),16)* 0.299
  let g = parseInt(color.substring(3,5),16)* 0.587
  let b = parseInt(color.substring(5,7),16)* 0.114
  return r + g + b > 200
}

/**
 * 给el-upload组件回显添加文件
 * @param url
 * @param fileName
 * @param uploadRef
*/
export function uploadImgEcho(url, uploadRef) {
  let blob: any = null
  let xhr = new XMLHttpRequest()
  const fileFullName = url.substring(url.lastIndexOf('/'))
  const fileType = fileFullName.substring(fileFullName.lastIndexOf('.'))
  const fileName = fileFullName.substring(0, fileFullName.lastIndexOf('.'))
  xhr.open("get", url);
  xhr.setRequestHeader('Accept', `image/${fileType}`)
  xhr.responseType = "blob"
  xhr.onload = () => {
      blob = xhr.response
      let imageFile = new File([blob], fileName, {type: `image/${fileType}`})
      uploadRef.handleStart(imageFile)
  }
  xhr.onerror = (e) => {
    console.log(e)
  }
  xhr.send()
}
