/**
 * 共享的预览组件 Props 类型定义
 */

export interface BasePreviewProps {
    tableData?: string;
}

export interface ColorPaletteProps extends BasePreviewProps {
    // ColorPalette 特定的 props 可以在这里扩展
}

// 其他预览组件的 props 类型可以在这里添加
export interface ButtonPreviewProps extends BasePreviewProps {
    // Button preview 特定的 props
}
