/**
 * 最小 barrel：仅导出文档页按 type 调用预览所需。
 * 其他组件（DocComponentPreview、ButtonDemo 等）请从具体文件导入，例如：
 *   import DocComponentPreview from '@/components/doc-preview/DocComponentPreview'
 *   import ButtonDemo from '@/components/doc-preview/ButtonDemo'
 */
export { default as ComponentPreviewSlot } from './ComponentPreviewSlot';
export {
  COMPONENT_PREVIEW_REGISTRY,
  getPreviewTypes,
  hasPreviewType,
} from './component-preview-registry';
