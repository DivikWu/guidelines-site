#!/usr/bin/env python3
"""
Generate derived token artifacts from tokens.json.

Single Source of Truth: tokens.json
Outputs:
  - tokens.css  (CSS custom properties)
  - tokens.d.ts (TypeScript types)

Usage:
  python3 generate-tokens.py
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Iterable, Tuple


ROOT = Path(__file__).resolve().parent
TOKENS_JSON = ROOT / "tokens.json"
TOKENS_CSS = ROOT / "tokens.css"
TOKENS_DTS = ROOT / "tokens.d.ts"


def is_token_leaf(obj: Any) -> bool:
    return (
        isinstance(obj, dict)
        and "value" in obj
        and set(obj.keys()).issubset({"value", "description"})
    )


def kebab(s: str) -> str:
    s = s.replace("_", "-")
    s = re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", s)
    return s.lower()


def var_name(path: Tuple[str, ...]) -> str:
    return "-".join(kebab(p) for p in path)


def walk_tokens(obj: Any, path: Tuple[str, ...] = ()) -> Iterable[Tuple[Tuple[str, ...], str, str | None]]:
    if isinstance(obj, dict):
        if is_token_leaf(obj):
            yield path, str(obj["value"]), obj.get("description")
        else:
            for k, v in obj.items():
                yield from walk_tokens(v, path + (str(k),))


def ts_key(k: str) -> str:
    if re.match(r"^[$A-Z_a-z][0-9A-Z_a-z$]*$", k):
        return k
    return repr(k)


def ts_type(obj: Any) -> str:
    if isinstance(obj, dict):
        if is_token_leaf(obj):
            return "TokenValue"
        parts = []
        for k, v in obj.items():
            parts.append(f"  {ts_key(str(k))}: {ts_type(v)};")
        return "{\n" + "\n".join(parts) + "\n}"
    if isinstance(obj, list):
        if not obj:
            return "any[]"
        return f"Array<{ts_type(obj[0])}>"
    if isinstance(obj, bool):
        return "boolean"
    if isinstance(obj, (int, float)):
        return "number"
    if obj is None:
        return "null"
    return "string"


def generate_css(data: dict) -> str:
    version = data.get("version", "")
    lines: list[str] = []
    lines.append("/**")
    lines.append(" * YAMI Design Tokens CSS 变量")
    lines.append(f" * 版本: {version}")
    lines.append(" * 描述: 由 tokens.json 自动生成，请勿手工编辑")
    lines.append(" */")
    lines.append("")
    lines.append(":root {")

    items = list(walk_tokens(data))
    items.sort(key=lambda x: (x[0][0] if x[0] else "", x[0]))

    current_section: str | None = None
    for path, value, _desc in items:
        if not path:
            continue
        section = path[0]
        if section != current_section:
            current_section = section
            lines.append("")
            lines.append(f"  /* {section} */")
        lines.append(f"  --yami-{var_name(path)}: {value};")

    lines.append("}")
    lines.append("")
    return "\n".join(lines)


def generate_dts(data: dict) -> str:
    version = data.get("version", "")

    # We keep a concrete object-shape type, but also export an interface DesignTokens
    # that extends that shape, to support `interface X extends DesignTokens {}` usage.
    root_shape = ts_type(data)

    out: list[str] = []
    out.append("/**")
    out.append(" * YAMI Design Tokens TypeScript 类型定义")
    out.append(f" * 版本: {version}")
    out.append(" * 描述: 由 tokens.json 自动生成，请勿手工编辑")
    out.append(" */")
    out.append("")
    out.append("export interface TokenValue {")
    out.append("  value: string;")
    out.append("  description?: string;")
    out.append("}")
    out.append("")
    out.append(f"type TokensRoot = {root_shape};")
    out.append("")
    out.append("export interface DesignTokens extends TokensRoot {}")
    out.append("")
    out.append("export type DesignTokensShape = TokensRoot;")
    out.append("")
    return "\n".join(out)


def main() -> None:
    data = json.loads(TOKENS_JSON.read_text(encoding="utf-8"))

    TOKENS_CSS.write_text(generate_css(data), encoding="utf-8")
    TOKENS_DTS.write_text(generate_dts(data), encoding="utf-8")

    print("Generated:")
    print(f"- {TOKENS_CSS.name}")
    print(f"- {TOKENS_DTS.name}")


if __name__ == "__main__":
    main()

