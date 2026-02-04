'use client';

import React, { useMemo, useState } from 'react';
import Icon from './Icon';

interface FileTreeProps {
    content: string;
}

interface TreeItem {
    name: string;
    depth: number;
    isFolder: boolean;
    comment?: string;
}

/**
 * FileTree component that parses ASCII tree structures and renders them as UI.
 * Supports:
 * tokens/
 * ├── base/                    # Comment
 * │   ├── colors.json
 * └── themes/
 */
const FileTree: React.FC<FileTreeProps> = ({ content }) => {
    const treeItems = useMemo(() => {
        const lines = content.split('\n');
        const items: TreeItem[] = [];

        lines.forEach((line) => {
            // Clean line from tree characters (├──, └──, │, etc.)
            // Example: "  │   ├── colors.json          # Comment"
            const cleanLine = line.trim();
            if (!cleanLine) return;

            // Extract comment
            let comment: string | undefined;
            let namePart = line;
            if (line.includes('#')) {
                const parts = line.split('#');
                namePart = parts[0];
                comment = parts[1].trim();
            }

            // Calculate depth based on the position of the first non-tree character
            // We look for the first alphanumeric character or the folder/file name
            const nameMatch = namePart.match(/[a-zA-Z0-9._\-/📁]+.*/);
            if (!nameMatch) return;

            const name = nameMatch[0].trim();
            const depth = Math.floor(nameMatch.index! / 4); // Assuming 4-space indentation for tree structure
            const isFolder = name.endsWith('/') || name.startsWith('📁');

            items.push({
                name: name.replace(/^📁\s*/, ''), // Clean emoji if present
                depth,
                isFolder,
                comment,
            });
        });

        return items;
    }, [content]);

    return (
        <div className="file-tree">
            <div className="file-tree__inner">
                {treeItems.map((item, index) => (
                    <FileTreeItem key={`${item.name}-${index}`} item={item} />
                ))}
            </div>
        </div>
    );
};

const FileTreeItem: React.FC<{ item: TreeItem }> = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    // Get file icon based on extension
    const getFileIcon = (name: string) => {
        if (name.endsWith('.json')) return 'ds-icon-code-01';
        if (name.endsWith('.css') || name.endsWith('.scss')) return 'ds-icon-file-attachment-03';
        if (name.endsWith('.swift') || name.endsWith('.xml')) return 'ds-icon-file-attachment-03';
        return 'ds-icon-file-01';
    };

    return (
        <div
            className={`file-tree__item ${item.isFolder ? 'file-tree__item--folder' : 'file-tree__item--file'}`}
            style={{ paddingLeft: `${item.depth * 24}px` }}
        >
            <div className="file-tree__item-content">
                <span className="file-tree__item-icon" aria-hidden="true">
                    <Icon
                        name={item.isFolder ? (isExpanded ? 'ds-icon-folder-check' : 'ds-icon-folder-02') : getFileIcon(item.name)}
                        size={18}
                    />
                </span>
                <span className="file-tree__item-name">{item.name}</span>
                {item.comment && (
                    <span className="file-tree__item-comment"># {item.comment}</span>
                )}
            </div>
        </div>
    );
};

export default FileTree;
