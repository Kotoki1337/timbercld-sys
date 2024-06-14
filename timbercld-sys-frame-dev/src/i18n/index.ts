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
import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import zhCNLocale from 'element-plus/es/locale/lang/zh-cn'
import zhTWLocale from 'element-plus/es/locale/lang/zh-tw'
import enLocale from 'element-plus/es/locale/lang/en'
import zhCN from './zh-CN'
import zhTW from './zh-TW'
import enUS from './en-US'

export const messages = {
  'zh-CN': {
    _lang: '简体中文',
    ...zhCN,
    ...zhCNLocale
  },
  'zh-TW': {
    _lang: '繁體中文',
    ...zhTW,
    ...zhTWLocale
  },
  'en-US': {
    _lang: 'English',
    ...enUS,
    ...enLocale
  }
}

const I18n = createI18n({
  legacy: import.meta.env.MODE === 'production',
  locale: Cookies.get('language') || 'zh-CN',
  globalInjection: true,
  warnHtmlMessage: false,
  messages
})
export default I18n
