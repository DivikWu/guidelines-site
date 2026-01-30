# GitHub Pages 部署说明

## 访问地址

- 项目站点（仓库名 `guidelines-site`）：**https://divikwu.github.io/guidelines-site/**
- 请使用单斜杠结尾，避免 `//` 导致 404。

## 发布前检查

1. **Pages 源**：仓库 **Settings → Pages → Build and deployment → Source** 必须为 **GitHub Actions**（不要选 “Deploy from a branch”）。
2. **Actions**：**Actions** 页中 “Deploy Next.js site to Pages” 最近一次运行应为绿色；若有失败，查看日志中 Build / Upload / Deploy 步骤。
3. **产物**：workflow 中有 “Verify export root”，可确认 `out/index.html` 存在；部署后站点根路径应能返回首页 HTML。

## 若线上 404

- 确认访问的是 **https://divikwu.github.io/guidelines-site/**（无多余 `//`）。
- 确认 Pages 源为 **GitHub Actions** 且最近一次部署成功。
- 若控制台出现 React #418/#423（hydration）或 FetchError，多为资源路径或 basePath 不一致：构建时需设置 `GITHUB_PAGES=true` 与 `NEXT_PUBLIC_BASE_PATH=/guidelines-site`（与 workflow 一致）。

## 本地开发与 GitHub Pages 部署约定

- **本地开发（`npm run dev`）时不要设置 `GITHUB_PAGES=true`**。该变量仅用于 GitHub Pages / CI 的 production 构建；在本地 dev 下若被设为 `true`，Next 会误启用静态导出（`output: 'export'`），导致首页或文档路由返回 404。
- **若本地访问 `/` 或 `/docs/...` 出现 404**，按下面步骤排查：
  1. 在终端执行 `unset GITHUB_PAGES`（或确保当前 shell 与 `.env*` 中未设置 `GITHUB_PAGES=true`）。
  2. 删除项目根目录下的 `.next`（以及如有 `.next-dev` 可一并删除）。
  3. 重新执行 `npm run dev`，再访问 `http://127.0.0.1:3000/` 或具体文档路径验证。
- **仅在 GitHub Pages / CI 的 production build 中启用 `GITHUB_PAGES=true`**；日常开发请勿在环境变量中保留该设置。

## 本地模拟线上构建

```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/guidelines-site npm run build
```

构建完成后 `out/` 即静态站点；可用任意静态服务器在本地挂载 `out/` 并加上 basePath 前缀做验证。
