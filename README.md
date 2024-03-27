# Remix Vite on Cloudflare Pages

Remid Vite で基本的な CRUD 機能を実装したテンプレート

## 技術スタック

- フレームワーク:Remix + Vite
- デザイン:TailwindCSS + shadcn/ui
- データベース:D1(Cloudflare)
- ORM:Drizzle ORM
- バリデーション:Zod

## 環境構築手順

- クローン後、ライブラリのインストール
```sh
git clone "https://github.com/ShunsukeHanai/remix-vite-example.git"
cd remix-vite-example.git
npm install
```

-  Cloudflareアカウントでwranglerへ認証を通す
```sh
npx wrangler login
```
- Cloudflare D1の作成
```sh
npx wrangler d1 create remix-practice-db
```
上記、実行後にデータベース情報が表示されるため、wrangler.tomlを修正する
```
[[d1_databases]]
binding = "DB"
database_name = remix-practice-db"
database_id = "<unique-ID-for-your-database>"
```
※database_idは公開しても問題ないとのこと
（DiscordのCloudflare D1コミュニティにて確認）

- Drizzleを使用して、migrationsファイルを作成し、localのDBへ反映
```sh
npm run generate
npm run apply-local
```
DBにテーブルやカラムの変更がある場合、
app/db/schema.ts のファイルを修正後、上記のコマンドを実行することでDBの更新が可能
migrationsファイルは、migrationsディレクトリ内のsqlファイルで確認できる

ローカル環境の起動・動作確認
```sh
npm run dev
```

## デプロイ
- 変更内容をmainブランチにコミットしておく
```sh
git add .
git commit -m "commit message"
```

- リモート先のD1へmigrationsの内容を反映
```sh
npm run apply-remote
```

- デプロイ

新規プロジェクトを作成して進める
```sh
npm run deploy
No project selected. Would you like to create one or use an existing project?
❯ Create a new project
  Use an existing project
```

※初回デプロイ時は、作成したプロジェクトとD1 databaseが紐づいていないため、
紐づけを行った後に、再度デプロイする必要有り

- Bindings

デプロイしたプロジェクトとD1を紐づける
Cloudflare ダッシュボードのPages & Workersから下記の通りに進む

<作成したプロジェクト>→Settings→Functinos→D1 database bindings

Edit bindingsから下記の通り設定する
```
Variable name:DB
D1 database:remix-practice-db
```

- 再デプロイ
初回のみ再デプロイを実行
```sh
npm run deploy
```

ドメインにアクセスし、動作確認する


