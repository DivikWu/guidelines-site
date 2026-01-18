import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const repoRoot = process.cwd();
const errors = [];

const allowedRootMd = new Set(["README.md", "CHANGELOG.md"]);
const rootEntries = fs.readdirSync(repoRoot, { withFileTypes: true });

for (const entry of rootEntries) {
  if (!entry.isFile()) continue;
  const ext = path.extname(entry.name).toLowerCase();
  if (ext === ".md" && !allowedRootMd.has(entry.name)) {
    errors.push(
      `根目录不允许新增 Markdown：${entry.name}（请移入 docs/ 子目录）`
    );
  }
  if (ext === ".html") {
    errors.push(`根目录不允许新增 HTML：${entry.name}（请移入 docs/_legacy/）`);
  }
}

const disallowedTracked = [".next/", "out/", "node_modules/", ".npm-cache/", ".DS_Store"];
try {
  const output = execSync(
    `git ls-files -z -- ${disallowedTracked.map((item) => `"${item}"`).join(" ")}`,
    { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"] }
  );
  const tracked = output.toString("utf8").split("\0").filter(Boolean);
  if (tracked.length > 0) {
    errors.push(
      `发现不应提交的目录/文件已被追踪：\n` +
        tracked.map((file) => `- ${file}`).join("\n") +
        `\n处理方式：git rm -r --cached ${tracked
          .map((file) => `"${file}"`)
          .join(" ")}`
    );
  }
} catch (error) {
  errors.push(`无法运行 git ls-files，请在 git 仓库内执行该检查。`);
}

if (errors.length > 0) {
  console.error("结构检查失败：");
  errors.forEach((message) => {
    console.error(`\n${message}`);
  });
  process.exit(1);
}

console.log("结构检查通过：未发现根目录与追踪文件问题。");
