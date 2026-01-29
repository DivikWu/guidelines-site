import fs from "node:fs";
import path from "node:path";

/** 项目内 content 目录（仓库内内容快照） */
export const DEFAULT_CONTENT_DIR = path.join(process.cwd(), "content");

/** 本地 Obsidian 库路径（仅当 .env.local 配置 YDS_CONTENT_DIR 时存在） */
export const LOCAL_CONTENT_DIR: string | undefined = process.env.YDS_CONTENT_DIR;

/**
 * 返回当前应使用的内容根目录。
 * - 若配置了 YDS_CONTENT_DIR 且该路径存在 → 返回 Obsidian 路径（本地 dev）
 * - 否则 → 返回项目内 content/（build/CI 或未配置时）
 */
export function getContentRoot(): string {
  if (LOCAL_CONTENT_DIR && fs.existsSync(LOCAL_CONTENT_DIR)) {
    return LOCAL_CONTENT_DIR;
  }
  return DEFAULT_CONTENT_DIR;
}
