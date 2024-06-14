<div align="center">
  <h1>Timber Chain Cloud - System Framework</h1>
</div>

## ⚡ 简介

基于 Vue3、TypeScript、Element Plus、Pinia 和 Vite 等主流技术的一个后台管理系统.

## 💡 特性

- **Vue3**：采用 Vue3 + script setup 最新的 Vue3 组合式 API
- **Element Plus**：Element UI 的 Vue3 版本
- **Pinia**：状态管理
- **Vite**：前端构建工具
- **Vue Router**：路由
- **TypeScript**：JavaScript 语言的超集
- **Scss**：和 Element Plus 保持一致
- **CSS 变量**：主要控制项目的布局和颜色
- **ESlint**：代码校验
- **Axios**：发送网络请求

## 🖥 功能

- **用户管理**：登录、登出
- **权限管理**：内置页面权限（动态路由）、指令权限、权限函数、路由守卫
- **多环境**：开发环境（development）、测试环境（test）、正式环境（production）
- **多主题**：内置主题颜色选择、菜单栏展示切换（顶部、侧边）
- **多语言**：搭配vue-i18n切换多种语言显示

## 🚀 开发

```bash
# 配置
1. node 版本 16+

# 克隆项目
git clone https://gitee.com/timbercld/timbercld-sys-frame.git

# 进入项目目录
cd timbercld-sys-frame

# 安装依赖
npm i

# 启动服务
npm run dev
```

## 🔧 模块

### 新建模块及使用
- **core文件夹中新建：demo模块、demo.vue、demo-edit-dialog.vue。**
- **菜单设置中配置动态路由demo/demo**
- **刷新页面获取更新后的路由，进入模块页面进行编写**

## 📦️ 多环境打包

```bash
# 构建测试环境
npm run build:test

# 构建正式环境
npm run build:prod
```

## 📖 开源共建

### 开源协议

[木链云](timbercld.com)开源软件遵循 [Apache 2.0 协议](https://www.apache.org/licenses/LICENSE-2.0.html)。
允许商业使用，但务必保留类作者、Copyright 信息。

![](https://www.apache.org/img/asf-estd-1999-logo.jpg)

### 其他说明

1. 欢迎提交 [issue](https://gitee.com/timbercld/timbercld-sys-frame/issues)，请写清楚遇到问题的原因、开发环境、复现步骤。

2. 联系作者 <a href="mailto:jianglong@timbercld.com">jianglong@timbercld.com</a>
