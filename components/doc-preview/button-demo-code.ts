/**
 * 按钮预览的 React / Flutter 代码片段，按按钮类型与平台返回。
 */

export function getButtonDemoCodeReact(buttonType: string): string {
  const snippets: Record<string, string> = {
    default: `"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon">←</Button>
      <Button variant="outline">Archive</Button>
      <Button variant="outline">Report</Button>
      <Button variant="outline">Snooze</Button>
      <Button variant="outline" size="icon">…</Button>
    </ButtonGroup>
  )
}`,
    emphasis: `import { Button } from "@/components/ui/button";

<Button variant="emphasis">立即使用</Button>`,
    primary: `import { Button } from "@/components/ui/button";

<Button variant="primary">提交</Button>`,
    secondary: `import { Button } from "@/components/ui/button";

<Button variant="secondary">取消</Button>`,
    ghost: `import { Button } from "@/components/ui/button";

<Button variant="ghost">更多</Button>`,
    text: `import { Button } from "@/components/ui/button";

<Button variant="text">链接操作</Button>`,
    danger: `import { Button } from "@/components/ui/button";

<Button variant="danger">删除</Button>`,
    'with-icon': `import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

<Button>
  <PlusIcon className="size-4" />
  添加
</Button>`,
    'icon-only': `import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";

<Button variant="ghost" size="icon">
  <SettingsIcon className="size-4" />
</Button>`,
    disabled: `import { Button } from "@/components/ui/button";

<Button disabled>不可用</Button>`,
    loading: `import { Button } from "@/components/ui/button";

<Button loading>提交中…</Button>`,
  };
  return snippets[buttonType] ?? snippets.emphasis;
}

export function getButtonDemoCodeFlutter(buttonType: string): string {
  const snippets: Record<string, string> = {
    default: `YamiButtonGroup(
  children: [
    YamiIconButton(icon: Icons.arrow_back),
    YamiButton(child: Text('Archive')),
    YamiButton(child: Text('Report')),
    YamiButton(child: Text('Snooze')),
    YamiIconButton(icon: Icons.more_horiz),
  ],
)`,
    emphasis: `YamiButton.emphasis(
  onPressed: () {},
  child: Text('立即使用'),
)`,
    primary: `YamiButton.primary(
  onPressed: () {},
  child: Text('提交'),
)`,
    secondary: `YamiButton.secondary(
  onPressed: () {},
  child: Text('取消'),
)`,
    ghost: `YamiButton.ghost(
  onPressed: () {},
  child: Text('更多'),
)`,
    text: `YamiButton.text(
  onPressed: () {},
  child: Text('链接操作'),
)`,
    danger: `YamiButton.danger(
  onPressed: () {},
  child: Text('删除'),
)`,
    'with-icon': `YamiButton(
  onPressed: () {},
  icon: Icon(Icons.add),
  label: Text('添加'),
)`,
    'icon-only': `YamiIconButton(
  onPressed: () {},
  icon: Icon(Icons.settings),
)`,
    disabled: `YamiButton(
  onPressed: null,
  child: Text('不可用'),
)`,
    loading: `YamiButton(
  onPressed: () {},
  isLoading: true,
  child: Text('提交中…'),
)`,
  };
  return snippets[buttonType] ?? snippets.emphasis;
}

/** 按按钮类型返回样式与交互的 CSS 片段（默认 / hover / active / disabled） */
export function getButtonStyleCode(buttonType: string): string {
  const styles: Record<string, string> = {
    emphasis: `.doc-preview-button--emphasis {
  border-radius: var(--Button-Emphasis, 8px);
  color: var(--yami-color-overlay-white, #fff);
  background: var(--Fill-Button-Emphasis, #F00);
  border-color: var(--Fill-Button-Emphasis, #F00);
}

.doc-preview-button--emphasis:hover:not(:disabled) {
  background: var(--Fill-Button-Emphasis-Active, #EB0000);
  border-color: var(--Fill-Button-Emphasis-Active, #EB0000);
}

.doc-preview-button--emphasis:active:not(:disabled) {
  background: var(--Fill-Button-Emphasis-Active, #EB0000);
  border-color: var(--Fill-Button-Emphasis-Active, #EB0000);
}

.doc-preview-button--emphasis:disabled {
  color: var(--yami-color-palette-neutral-400, #949494);
  background: var(--yami-color-palette-neutral-100, #F5F5F5);
  border-color: var(--yami-color-palette-neutral-200, #EBEBEB);
  opacity: 1;
}`,
    primary: `.doc-preview-button--primary {
  border-radius: var(--yami-border-radius-medium, 8px);
  color: #fff;
  background: #000;
  border-color: #000;
}

.doc-preview-button--primary:hover:not(:disabled) {
  filter: brightness(0.92);
}

.doc-preview-button--primary:active:not(:disabled) {
  filter: brightness(0.85);
}

.doc-preview-button--primary:disabled {
  color: var(--yami-color-palette-neutral-400, #949494);
  background: var(--yami-color-palette-neutral-100, #F5F5F5);
  border-color: var(--yami-color-palette-neutral-200, #EBEBEB);
  opacity: 1;
}`,
    secondary: `.doc-preview-button--secondary {
  border-radius: var(--yami-border-radius-full, 999px);
  color: #fff;
  background: #000;
  border-color: #000;
}

.doc-preview-button--secondary:hover:not(:disabled) {
  filter: brightness(0.92);
}

.doc-preview-button--secondary:active:not(:disabled) {
  filter: brightness(0.85);
}

.doc-preview-button--secondary:disabled {
  color: var(--yami-color-palette-neutral-400, #949494);
  background: var(--yami-color-palette-neutral-100, #F5F5F5);
  border-color: var(--yami-color-palette-neutral-200, #EBEBEB);
  opacity: 1;
}`,
  };
  return styles[buttonType] ?? styles.emphasis;
}

export const BUTTON_TYPES = [
  { id: 'emphasis', label: 'Emphasis 强调按钮' },
  { id: 'primary', label: 'Primary 主要按钮' },
  { id: 'secondary', label: 'Secondary 次级按钮' },
] as const;

export const PLATFORMS = [
  { id: 'mobile', label: 'Mobile' },
  { id: 'web', label: 'Web' },
] as const;
