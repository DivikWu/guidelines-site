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

## 本地模拟线上构建

```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/guidelines-site npm run build
```

构建完成后 `out/` 即静态站点；可用任意静态服务器在本地挂载 `out/` 并加上 basePath 前缀做验证。
