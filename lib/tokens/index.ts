/**
 * YAMI Design Tokens - 统一导出入口
 * 
 * 提供类型安全的 tokens 访问接口
 */

import tokens from '../../tokens/tokens.json';
import type { DesignTokens } from '../../tokens/tokens.d.ts';

/**
 * 导出 tokens 数据（类型安全）
 */
export const designTokens: DesignTokens = tokens as DesignTokens;

/**
 * 导出类型定义
 */
export type { DesignTokens } from '../../tokens/tokens.d.ts';

/**
 * 导出原始 tokens 对象（用于需要直接访问的场景）
 */
export default tokens;
