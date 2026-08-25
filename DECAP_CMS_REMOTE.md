# Decap CMS リモート認証

第2段階では、GitHub Pages上の`/admin/`からGitHubへログインできるようにします。
通常のサイトと管理画面は静的ファイルのままです。Cloudflare WorkerはGitHub OAuthの
開始とコールバックだけを処理します。

## 構成

```text
www.aoe1928.com/admin/
  -> Cloudflare Worker /auth
  -> GitHub OAuth
  -> Cloudflare Worker /callback
  -> Decap CMS
  -> GitHub repository
```

Workerの秘密情報はCloudflare側にだけ保存します。リポジトリ、ブラウザの
`localStorage`、公開JavaScriptには保存しません。

## Worker設定

設定ファイルは`oauth-worker/wrangler.jsonc`です。以下の2つをCloudflare Workerの
secretとして設定します。

```text
CLIENT_ID
CLIENT_SECRET
```

GitHub OAuth Appの設定値：

```text
Homepage URL: https://www.aoe1928.com
Authorization callback URL: https://<worker>.workers.dev/callback
```

WorkerのURLが確定したら、`static/admin/config.yml`のGitHub backendへ次を追加します。

```yaml
base_url: https://<worker>.workers.dev
auth_endpoint: auth
site_domain: www.aoe1928.com
```

第2段階の試験中は、CMSの保存先ブランチを`codex/decap-cms-trial`に固定します。
`main`への切り替えと自動公開は第3段階で行います。
