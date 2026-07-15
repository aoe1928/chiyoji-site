# chiyoji-site 更新・公開チートシート

このサイトは、`main` ブランチでソースを管理し、Gatsbyが生成した完成品を `gh-pages` ブランチから公開します。

## 全体の流れ

```text
mainで記事やページを編集
  ↓
ローカルで表示確認
  ↓
mainの変更を自分でコミット・プッシュ
  ↓
公開コマンドを実行
  ↓
public/の内容がgh-pagesへ自動コミット・プッシュされる
  ↓
www.aoe1928.comに反映
```

## 重要な注意

```sh
npm run deploy
```

このコマンドは確認用ではありません。実行すると次の処理が自動で行われます。

1. Gatsbyの本番ビルド
2. `public/` の内容を `gh-pages` ブランチへコミット
3. GitHubへプッシュ
4. 公開サイトを更新

公開したくないときは実行しないでください。

## 作業を始める

```sh
cd /Users/aoe1928/wk/chiyoji-site
git switch main
git pull --ff-only
npm install
```

`git pull --ff-only` がエラーになった場合は、無理に上書きせず状況を確認します。

## ローカルでサイトを確認する

```sh
npm start
```

ブラウザで次を開きます。

```text
http://localhost:8000
```

終了するときは、起動したターミナルで `Control + C` を押します。

## ブログ記事を追加する

`src/posts/` に `.mdx` ファイルを追加します。

例：

```mdx
---
title: "記事のタイトル"
date: "2026-07-15"
---

ここに本文を書きます。
```

ファイル名の例：

```text
src/posts/260715.mdx
```

記事ページと月別アーカイブはGatsbyが自動生成します。

### 記事へ階層タグを付ける

`categories` は大きい分類から順番に指定します。

```mdx
---
title: "ライブのお知らせ"
date: "2026-08-05"
categories: ["music", "second-waltz", "live"]
---
```

現在使える主な値：

```text
music          音楽
second-waltz   セカンドワルツ
purgatorio     Purgatorio
live           ライブ
merchandise    グッズ
release        リリース
site-news      サイトのお知らせ
lifestyle      ライフハック
technology     技術
```

タグ一覧は `/tags/` に、各階層の記事一覧は `/tags/music/second-waltz/live/` のようなURLに自動生成されます。

### 英語版の記事も追加する

日本語記事と同じファイル名で、`src/posts/en/` に英語版を作ります。英語版には `lang` と、日本語版と共通の `slug` を指定します。

```mdx
---
title: "English Article Title"
date: "2026-07-15"
lang: "en"
slug: "/260715/"
---

Write the English article here.
```

```text
日本語: src/posts/260715.mdx     → /260715/
英語:   src/posts/en/260715.mdx  → /en/260715/
```

日英で `date` と `slug` を揃えてください。非公開記事の場合は、両方に `draft: true` を指定します。

## 非公開の下書きを作る

公開前の記事には、先頭の設定へ `draft: true` を追加します。

```mdx
---
title: "公開前の記事"
date: "2026-07-15"
draft: true
---

ここに本文を書きます。
```

`draft: true` の記事は次の場所に表示・生成されません。

- トップページの記事一覧
- 月別アーカイブ
- 記事ページ

ただし、`npm start` で起動するlocalhostでは下書きを確認できます。本番ビルドと公開サイトだけが404になります。

```text
http://localhost:8000/260715-event/
```

公開するときは `draft: true` を `draft: false` に変更するか、その行を削除します。

### 公開前にURLとQRコードを準備する

記事URLはファイル名から決まります。

```text
src/posts/260715-event.mdx
↓
https://www.aoe1928.com/260715-event/
```

`draft: true` の間でも、この予定URLを使ってQRコードを作れます。公開前にQRコードを読み取ると404になり、記事公開後は同じQRコードで記事を開けます。

## 公開前の確認

### 1. 変更ファイルを確認

```sh
git status
git diff
```

意図していないファイルが含まれていたら、公開前に止めます。

### 2. 本番ビルドを確認

```sh
npm run build
```

`Done building` と表示され、エラーがないことを確認します。このコマンドだけではGitHubへ公開されません。

### 3. mainを自分でコミットする

追加するファイルを明示して実行します。

```sh
git add src/posts/260715.mdx
git commit -m "記事を追加"
git push origin main
```

`git add .` は、関係ない変更まで含める可能性があるため注意してください。

## gh-pagesへ公開する

公開してよいことを最終確認してから実行します。

```sh
npm run deploy
```

最後に次の表示が出れば、`gh-pages` への送信は完了です。

```text
Published
```

公開先：

- <https://www.aoe1928.com>
- <https://aoe1928.github.io/chiyoji-site/>

反映には数分かかる場合があります。

## 公開後の確認

```sh
git fetch origin
git log -1 --oneline origin/gh-pages
```

GitHub Pagesの状態を確認する場合：

```sh
gh api repos/aoe1928/chiyoji-site/pages \
  --jq '{status: .status, url: .html_url, source: .source}'
```

## 公開を元に戻す

まず、戻したい `gh-pages` のコミットを確認します。

```sh
git fetch origin
git log --oneline origin/gh-pages -10
```

`gh-pages` を過去の状態へ戻す操作は履歴を書き換えるため、コミットIDを確認してから実行します。

```sh
git push --force-with-lease origin <戻したいコミットID>:gh-pages
```

この操作は慎重に行ってください。判断に迷った場合は実行しません。

## よく使うコマンド

| 目的 | コマンド | GitHubへの変更 |
|---|---|---|
| 開発画面を起動 | `npm start` | なし |
| 本番ビルド確認 | `npm run build` | なし |
| 状態確認 | `git status` | なし |
| 差分確認 | `git diff` | なし |
| mainへ送信 | `git push origin main` | mainを更新 |
| サイト公開 | `npm run deploy` | gh-pagesを自動コミット・更新 |

## 迷ったときの安全ルール

- `npm run build` は確認用
- `npm run deploy` は本番公開用
- 公開前に必ず `git status` と `git diff` を見る
- コミット対象は `git add` でファイル名を明示する
- `gh-pages` は生成物なので直接編集しない
- `main` に最新のソースが揃っていることを確認してから公開する
- 意味が分からないまま `--force` を使わない
