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
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import axios, { AxiosRequestConfig } from 'axios'
import NProgress from 'nprogress'
import Cookies from 'js-cookie'
import isPlainObject from 'lodash/isPlainObject'
import qs from 'qs'
import router from '@/router'
import { clearLogin } from '@/utils'

// 设置请求头和请求路径
axios.defaults.baseURL = window.SITE_CONFIG.apiURL
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.interceptors.request.use(
  (config: any): AxiosRequestConfig<any> => {
    config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN'
    config.headers.token = Cookies.get('token') || ''
    const defaults = {}
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        ...{ _t: new Date().getTime() }
      }
    }
    if (isPlainObject(config.params)) {
      config.params = {
        ...defaults,
        ...config.params
      }
    }
    if (isPlainObject(config.data)) {
      config.data = {
        ...defaults,
        ...config.data
      }
      if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
        config.data = qs.stringify(config.data)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 响应拦截
axios.interceptors.response.use(
  (response) => {
    if (response.data.code === 401 || response.data.code === 10001) {
      clearLogin()
      router.replace({ name: 'login' }).catch(err => {})
      return Promise.reject(response.data.msg)
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

interface ResType<T> {
  code: number
  data?: T
  msg: string
  err?: string
}
interface Http {
  get<T>(url: string, params?: unknown): Promise<ResType<T>>
  post<T>(url: string, params?: unknown, headers?: any): Promise<ResType<T>>
  put<T>(url: string, params?: unknown, headers?: any): Promise<ResType<T>>
  delete<T>(url: string, params?: unknown): Promise<ResType<T>>
  upload<T>(url: string, params: unknown, headers?: any): Promise<ResType<T>>
  download(url: string): void
}

const http: Http = {
  get(url, params) {
    return new Promise((resolve, reject) => {
      NProgress.start()
      axios
        .get(url, { params })
        .then((res) => {
          NProgress.done()
          resolve(res.data)
        })
        .catch((err) => {
          NProgress.done()
          reject(err.data)
        })
    })
  },
  post(url, params, headers = { 'Content-Type': 'application/json;charset=UTF-8' }) {
    return new Promise((resolve, reject) => {
      NProgress.start()
      axios
        .post(url, params, {
          headers
        })
        .then((res) => {
          NProgress.done()
          resolve(res.data)
        })
        .catch((err) => {
          NProgress.done()
          reject(err.data)
        })
    })
  },
  put(url, params, headers?) {
    return new Promise((resolve, reject) => {
      NProgress.start()
      axios
        .put(url, params, {
          headers
        })
        .then((res) => {
          NProgress.done()
          resolve(res.data)
        })
        .catch((err) => {
          NProgress.done()
          reject(err.data)
        })
    })
  },
  delete(url, data: any) {
    return new Promise((resolve, reject) => {
      NProgress.start()
      axios
        .delete(url, data)
        .then((res) => {
          NProgress.done()
          resolve(res.data)
        })
        .catch((err) => {
          NProgress.done()
          reject(err.data)
        })
    })
  },
  upload(url, file, headers = { 'Content-Type': 'multipart/form-data' }) {
    return new Promise((resolve, reject) => {
      NProgress.start()
      axios
        .post(url, file, {
          headers
        })
        .then((res) => {
          NProgress.done()
          resolve(res.data)
        })
        .catch((err) => {
          NProgress.done()
          reject(err.data)
        })
    })
  },
  download(url) {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    iframe.onload = function () {
      document.body.removeChild(iframe)
    }
    document.body.appendChild(iframe)
  }
}
export default http
