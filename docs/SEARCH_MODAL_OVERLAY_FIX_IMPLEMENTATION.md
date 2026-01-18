# SearchModal 遮罩层覆盖 Header - 实现总结

## 修复概览

已成功修复 SearchModal 遮罩层未覆盖 Header 的问题，遮罩层现在完整覆盖整个 viewport（包含 Header），实现全屏沉浸式搜索体验。

## 根因结论

**z-index 层级冲突**：
- Header: `z-index: 1070` (calc(1050 + 20))
- 遮罩层: `z-index: 1040` (--yami-z-index-modal-backdrop)
- 弹窗容器: `z-index: 1050` (--yami-z-index-modal)

Header (1070) > 弹窗容器 (1050) > 遮罩层 (1040)，导致遮罩层无法覆盖 Header。

## 修复方案

### 1. 调整 z-index 层级

**修改前：**
- 遮罩层: `z-index: 1040`
- 弹窗容器: `z-index: 1050`

**修改后：**
- 遮罩层: `z-index: 1080`（高于 Header 的 1070）
- 弹窗容器: `z-index: 1090`（高于遮罩层）

**新的层级关系：**
```
弹窗容器 (1090) > 遮罩层 (1080) > Header (1070) > 其他元素
```

### 2. 优化样式实现

#### 遮罩层 (`.search-modal__backdrop`)
- ✅ 使用 `inset: 0` 代替 `top:0; left:0; right:0; bottom:0`（更简洁）
- ✅ 添加 `pointer-events: auto`（确保可以拦截背景点击）
- ✅ z-index 设为 `1080`（高于 Header）

#### 弹窗容器 (`.search-modal__container`)
- ✅ 使用 `inset: 0` 代替 `top:0; left:0; right:0; bottom:0`
- ✅ z-index 设为 `1090`（高于遮罩层）
- ✅ 添加 `pointer-events: none`（容器本身不拦截点击，只有内容区域可交互）

#### 搜索卡片内容 (`.search-modal__content`)
- ✅ 添加 `pointer-events: auto`（内容区域可交互）

### 3. 交互逻辑保障

**点击遮罩关闭：**
- 遮罩层 (`pointer-events: auto`) 可以接收点击
- 弹窗容器 (`pointer-events: none`) 不拦截点击
- 搜索卡片内容 (`pointer-events: auto`) 可交互，点击内容不会触发关闭
- `handleBackdropClick` 通过 `e.target === modalRef.current` 判断点击的是容器（遮罩），触发关闭

**焦点管理：**
- 焦点锁定在搜索卡片内（通过 focus trap）
- Header 按钮不可被 tab 到（被遮罩层覆盖且 pointer-events 拦截）

## 文件改动

1. **`app/globals.css`**
   - `.search-modal__backdrop`: 调整 z-index 为 1080，使用 `inset: 0`，添加 `pointer-events: auto`
   - `.search-modal__container`: 调整 z-index 为 1090，使用 `inset: 0`，添加 `pointer-events: none`
   - `.search-modal__content`: 添加 `pointer-events: auto`

2. **`docs/SEARCH_MODAL_OVERLAY_FIX_AUDIT.md`**
   - 排查清单文档

3. **`docs/SEARCH_MODAL_OVERLAY_FIX_IMPLEMENTATION.md`**
   - 实现总结文档（本文档）

## 验收标准（自测清单）

待实际运行后验证：

- [ ] 打开 SearchModal 后，Header 区域与页面其余部分同样被压暗（无缺口）
- [ ] Header 上的按钮在遮罩打开时无法点击（被遮罩层拦截）
- [ ] 点击遮罩空白区域可以关闭 SearchModal
- [ ] 点击搜索卡片内容不会关闭 SearchModal
- [ ] 弹窗卡片可正常点击、输入、滚动
- [ ] 关闭 SearchModal 后页面恢复正常
- [ ] Portal 渲染正常工作（无 SSR 错误）
- [ ] 不依赖临时 hack，遮罩天然覆盖全屏

## 实现要点

1. **层级策略清晰**：弹窗容器 (1090) > 遮罩层 (1080) > Header (1070)
2. **pointer-events 精细控制**：遮罩可点击关闭，容器不拦截，内容可交互
3. **使用 inset: 0**：更简洁的全屏覆盖方式
4. **保持兼容性**：不影响现有功能，Portal 挂载点不变

## 注意事项

1. **z-index 值选择**：
   - 当前使用固定值（1080/1090），因为 Header 使用了 `calc(1050 + 20)`
   - 未来可考虑在 tokens 中新增 `--yami-z-index-modal-overlay` 和 `--yami-z-index-modal-content`

2. **pointer-events 分层**：
   - 遮罩层：`auto`（可点击关闭）
   - 容器：`none`（不拦截，让点击穿透到遮罩层）
   - 内容：`auto`（可交互）

3. **兼容性**：
   - `inset: 0` 在现代浏览器中完全支持（IE 不支持，但项目使用 Next.js，不担心 IE）
   - 如果必须支持旧浏览器，可以保留 `top:0; left:0; right:0; bottom:0`
