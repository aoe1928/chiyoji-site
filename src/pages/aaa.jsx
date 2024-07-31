// 必要なモジュールをインポート
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Markdownコンテンツの例
const markdown = `
# 見出し
これは**太字**です。
- 箇条書き
- 箇条書き
- 箇条書き

| ヘッダー1 | ヘッダー2 |
| --------- | --------- |
| セル1     | セル2     |
`;

// コンポーネントで使用
const MarkdownComponent = () => (
  <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
);

export default MarkdownComponent;