---
title: Token 平台映射
description: Design Token 在 Web、iOS、Android 等平台的输出格式
category: 资源
status: Draft
last_updated: 2026-01-31
---

# 🔗 Token 平台映射

本文档说明 YAMI 设计系统 Design Token 在不同平台（Web、iOS、Android）的输出格式与使用方式。

---

## 颜色 Token

### 源定义

```json
{
  "text/primary": "rgba(0,0,0,0.87)",
  "ui/primary": "#E00000"
}
```

### Web (CSS Variables)

```css
:root {
  --color-text-primary: rgba(0, 0, 0, 0.87);
  --color-ui-primary: #E00000;
}

/* 使用 */
.text {
  color: var(--color-text-primary);
}
```

### Web (SCSS)

```scss
$color-text-primary: rgba(0, 0, 0, 0.87);
$color-ui-primary: #E00000;

// 使用
.text {
  color: $color-text-primary;
}
```

### iOS (Swift)

```swift
extension UIColor {
    static let textPrimary = UIColor(red: 0, green: 0, blue: 0, alpha: 0.87)
    static let uiPrimary = UIColor(hex: "#E00000")
}

// SwiftUI
extension Color {
    static let textPrimary = Color(.textPrimary)
    static let uiPrimary = Color(.uiPrimary)
}

// 使用
Text("Hello").foregroundColor(.textPrimary)
```

### Android (XML)

```xml
<!-- res/values/colors.xml -->
<resources>
    <color name="text_primary">#DE000000</color>  <!-- 87% alpha -->
    <color name="ui_primary">#E00000</color>
</resources>

<!-- 使用 -->
<TextView android:textColor="@color/text_primary" />
```

### Android (Compose)

```kotlin
object YamiColors {
    val textPrimary = Color(0xDE000000)
    val uiPrimary = Color(0xFFE00000)
}

// 使用
Text("Hello", color = YamiColors.textPrimary)
```

---

## 间距 Token

### 源定义

```json
{
  "space-100": "8px",
  "space-200": "16px"
}
```

### Web (CSS)

```css
:root {
  --space-100: 8px;
  --space-200: 16px;
}

.card {
  padding: var(--space-200);
  gap: var(--space-100);
}
```

### iOS (Swift)

```swift
enum Spacing {
    static let space100: CGFloat = 8
    static let space200: CGFloat = 16
}

// 使用
.padding(Spacing.space200)
```

### Android

```xml
<!-- res/values/dimens.xml -->
<resources>
    <dimen name="space_100">8dp</dimen>
    <dimen name="space_200">16dp</dimen>
</resources>

<!-- 使用 -->
<View android:padding="@dimen/space_200" />
```

---

## 字体 Token

### 源定义

```json
{
  "heading-l": {
    "fontSize": "20px",
    "lineHeight": "28px",
    "fontWeight": "500"
  }
}
```

### Web (CSS)

```css
.heading-l {
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  font-family: 'GT Walsheim', sans-serif;
}
```

### iOS (Swift)

```swift
extension UIFont {
    static let headingL = UIFont.systemFont(ofSize: 20, weight: .medium)
}

// SwiftUI
extension Font {
    static let headingL = Font.custom("GTWalsheim-Medium", size: 20)
}
```

### Android

```xml
<!-- res/values/styles.xml -->
<style name="TextAppearance.Yami.HeadingL">
    <item name="android:textSize">20sp</item>
    <item name="android:lineHeight">28sp</item>
    <item name="android:fontFamily">@font/gt_walsheim_medium</item>
</style>

<!-- 使用 -->
<TextView style="@style/TextAppearance.Yami.HeadingL" />
```

---

## 圆角 Token

### 源定义

```json
{
  "radius/small": "4px",
  "radius/medium": "8px",
  "radius/large": "12px"
}
```

### Web (CSS)

```css
:root {
  --radius-small: 4px;
  --radius-medium: 8px;
  --radius-large: 12px;
}

.button {
  border-radius: var(--radius-medium);
}
```

### iOS (Swift)

```swift
enum CornerRadius {
    static let small: CGFloat = 4
    static let medium: CGFloat = 8
    static let large: CGFloat = 12
}

// 使用
.cornerRadius(CornerRadius.medium)
```

### Android

```xml
<!-- res/values/dimens.xml -->
<resources>
    <dimen name="radius_small">4dp</dimen>
    <dimen name="radius_medium">8dp</dimen>
    <dimen name="radius_large">12dp</dimen>
</resources>
```

---

## 阴影 Token

### 源定义

```json
{
  "elevation-200": "0px 2px 4px -2px rgba(0,0,0,0.08)"
}
```

### Web (CSS)

```css
:root {
  --elevation-200: 0px 2px 4px -2px rgba(0, 0, 0, 0.08);
}

.card {
  box-shadow: var(--elevation-200);
}
```

### iOS (Swift)

```swift
extension CALayer {
    func applyElevation200() {
        shadowColor = UIColor.black.cgColor
        shadowOpacity = 0.08
        shadowOffset = CGSize(width: 0, height: 2)
        shadowRadius = 2  // blur / 2
    }
}
```

### Android

```xml
<!-- 使用 elevation 属性 -->
<CardView
    android:elevation="2dp"
    app:cardElevation="2dp" />
```

---

## 单位映射表

| 设计 Token | Web | iOS | Android |
|-----------|-----|-----|---------|
| px (间距/字号) | px / rem | pt / CGFloat | dp / sp |
| color (hex) | hex / rgba | UIColor / Color | @color / Color |
| color (rgba) | rgba() | UIColor(alpha:) | #AARRGGBB |
| shadow | box-shadow | CALayer.shadow* | elevation |
| radius | border-radius | cornerRadius | cornerRadius |

---

## 命名转换规则

| Token 命名 | Web (CSS) | iOS (Swift) | Android (XML) |
|-----------|-----------|-------------|---------------|
| `text/primary` | `--color-text-primary` | `textPrimary` | `text_primary` |
| `space-200` | `--space-200` | `space200` | `space_200` |
| `radius/medium` | `--radius-medium` | `medium` | `radius_medium` |
| `elevation-300` | `--elevation-300` | `elevation300` | `elevation_300` |

---
