# ちよじのホームページ

Gatsby 5で作成した個人サイトです。

## 必要なもの

- Node.js 20
- npm

## ローカルで見る

```sh
npm install
npm start
```

ブラウザで <http://localhost:8000> を開きます。編集内容は自動的に反映されます。

## 本番用ファイルを作る

```sh
npm run build
```

生成結果は `public/` に出力されます。

## GitHub Pagesへ公開する

```sh
npm run deploy
```

公開先のパスは `gatsby-config.js` の `pathPrefix` で設定しています。
