# 开发流程与检查清单

本文档说明 YDS 站点的日常开发流程、变更后检查项及常见问题处理，面向参与站点维护与扩展的开发者。设计规范内容见 `content/docs/`，勿与本开发流程混淆。

---

## 日常开发

### 安装与启动

```bash
npm install
npm run dev
```

可选（pnpm）：

```bash
pnpm install
pnpm dev
```

开发服务器默认监听 `http://127.0.0.1:3000`。

### 构建与检查

```bash
npm run build        # 生产构建
npm run lint:structure   # 结构校验
npm run docs:check   # 文档链接校验
```

---

## 开发前 / 变更后检查清单

以下项来自性能优化与问题修复总结（详见 [OPTIMIZATION_SUMMARY_REPORT.md](OPTIMIZATION_SUMMARY_REPORT.md)），建议在依赖变更、性能优化或大改后执行。

### 构建与缓存

| 检查项 | 说明 |
|--------|------|
| 清理缓存后再验证 | 优化或依赖变更后，优先执行 `rm -rf .next .next-dev` 再 `npm run dev`，避免 stale chunk 问题 |
| 单实例 dev server | 避免同一项目多处启动 dev server，减少多实例抢占端口、缓存不一致的情况 |

### 框架与依赖

| 检查项 | 说明 |
|--------|------|
| 谨慎使用 React.cache | 在 Next.js 14.x 静态导出场景下，`React.cache()` 可能引发序列化错误；可待 Next.js 升级后重新评估 |
| 保持 Next.js 版本跟踪 | 关注官方对 `React.cache`、hydration、chunk 加载的修复与说明 |

### 主题与 hydration

| 检查项 | 说明 |
|--------|------|
| 修改 `<html>` 时考虑 suppressHydrationWarning | 凡在服务端无法预知或由脚本修改的 `<html>` 属性，建议使用 `suppressHydrationWarning` 以消除 hydration 警告 |
| 首屏逻辑优先用 beforeInteractive 脚本 | 主题等需在首屏生效的逻辑，尽量通过 `beforeInteractive` 同步脚本执行，避免与 hydrate 时序冲突 |

### 开发流程

| 检查项 | 说明 |
|--------|------|
| 分步验证 | 每完成一小批改动即做一次本地构建与页面访问验证 |
| 记录回滚点 | 对高风险改动（如 `React.cache`、序列化相关）保留清晰回滚步骤，便于快速恢复 |

---

## 常见问题速查

| 现象 | 处理方式 |
|------|----------|
| `Cannot find module './xxx.js'` | 删除 `.next`、`.next-dev` 后重新 `npm run dev` |
| `Warning: Extra attributes from the server: data-theme` | 在 `<html>` 上添加 `suppressHydrationWarning` |
| 页面样式未加载 | 清理 `.next`、硬刷新；确认主题脚本使用 `next/script` 且 `strategy="beforeInteractive"` |
| 404 或路由异常 | 检查环境变量，本地开发勿设置 `GITHUB_PAGES=true`，见 [DEPLOYMENT.md](DEPLOYMENT.md) |

---

## 相关文档

- [DEPLOYMENT.md](DEPLOYMENT.md)：GitHub Pages 部署与本地开发约定
- [OPTIMIZATION_SUMMARY_REPORT.md](OPTIMIZATION_SUMMARY_REPORT.md)：性能优化改动、问题与建议详情
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)：项目结构与目录说明
