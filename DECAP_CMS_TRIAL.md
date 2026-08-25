# Decap CMS ローカル試用

この段階ではDecap CMSをローカルでだけ試します。GitHub認証、自動公開、本番の
`/admin/`公開はまだ有効にしません。

## 起動

ターミナルを2つ開き、リポジトリのルートでそれぞれ実行します。

```sh
# ターミナル1: Gatsby
npm start
```

```sh
# ターミナル2: ローカルのファイル読み書き用プロキシ
npx decap-server
```

次をブラウザで開きます。

```text
http://localhost:8000/admin/
```

## 安全な試し方

1. 「ブログ記事」から新しい記事を作ります。
2. `draft`はオンのままにします。
3. 公開用に縮小した2MB以下の画像を本文へ追加します。
4. 保存後、`git status`と`git diff`で追加されたMDXと画像を確認します。
5. Gatsbyの画面で下書き記事を確認します。

保存先は次の2か所だけです。

```text
src/posts/*.mdx
static/images/blog/*
```

Decap CMSのローカルプロキシはEditorial Workflowに対応しないため、試用中の保存は
ローカルファイルへ直接反映されます。意図しない変更があればコミットせずに戻します。

## 試用版を撤去する場合

このブランチを使わず`main`へ戻せば、本番サイトへの影響はありません。試用版の
追加物は次のとおりです。

```text
static/admin/
static/images/blog/.gitkeep
DECAP_CMS_TRIAL.md
```
