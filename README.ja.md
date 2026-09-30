[English](README.md) | 日本語

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

## アプリ紹介

/apps/ と /en/apps/ に5つのツールを掲載。紹介文は src/pages/apps.tsx と src/components/more-tools.tsx で管理します。掲載は各ツールの全環境での動作保証を意味しません。

## ライセンス

既存のGatsby由来の0BSD LICENSEを維持しています。掲載ツールはそれぞれのリポジトリのライセンスに従います。画像・キャラクター・アイコン・ロゴ等の素材はコードのライセンスとは別扱いです。
