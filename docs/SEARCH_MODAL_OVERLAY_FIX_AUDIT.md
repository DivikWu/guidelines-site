# SearchModal 遮罩层未覆盖 Header - 排查清单

## 1. 根因结论

**问题：z-index 层级冲突导致遮罩层无法覆盖 Header**

### 当前 z-index 层级

| 元素 | z-index | 值 |
|------|---------|-----|
| **Header** | `calc(var(--yami-z-index-modal, 1050) + 20)` | **1070** |
| **弹窗容器** | `var(--yami-z-index-modal, 1050)` | **1050** |
| **遮罩层** | `var(--yami-z-index-modal-backdrop, 1040)` | **1040** |

### 层级关系

```
Header (1070) > 弹窗容器 (1050) > 遮罩层 (1040)
```

**结论**：Header 的 z-index (1070) 高于遮罩层 (1040)，导致遮罩层无法覆盖 Header。

### 其他排查项（已确认正常）

✅ **Portal 挂载点**：正确挂载到 `document.body`
✅ **遮罩层定位**：使用 `position: fixed` + `top:0; left:0; right:0; bottom:0`
✅ **父容器影响**：无 transform/filter/perspective 影响 fixed 定位
✅ **高度设置**：使用 `bottom: 0` 而非 `height: 100%`，覆盖完整

### 设计规范中的 z-index tokens

根据 `styles/tokens.css`：
- `--yami-z-index-tooltip: 1070`
- `--yami-z-index-popover: 1060`
- `--yami-z-index-modal: 1050`
- `--yami-z-index-modal-backdrop: 1040`
- `--yami-z-index-fixed: 1030`
- `--yami-z-index-sticky: 1020`
- `--yami-z-index-dropdown: 1000`

**注意**：Header 使用了 `1050 + 20 = 1070`，与 tooltip 同层级，这是为了确保 Header 始终在最上层。

## 2. 修复方案

### 2.1 调整 z-index 层级

将 SearchModal 的层级调整为：
- **遮罩层 z-index**: `1080`（高于 Header 的 1070）
- **弹窗容器 z-index**: `1090`（高于遮罩层）

### 2.2 优化样式

- 遮罩层使用 `inset: 0` 代替 `top:0; left:0; right:0; bottom:0`（更简洁）
- 确保遮罩层有 `pointer-events: auto`（拦截点击）

### 2.3 考虑长期方案

如果需要遵循设计规范，可以考虑：
- 在 tokens 中新增 `--yami-z-index-modal-overlay: 1080` 和 `--yami-z-index-modal-content: 1090`
- 或者调整 Header 的 z-index 策略（但不推荐，可能影响其他功能）

## 3. 实现优先级

**当前修复**：直接设置 z-index 值（1080/1090）
**长期优化**：考虑在 tokens 中新增专门的 overlay 层级 token
