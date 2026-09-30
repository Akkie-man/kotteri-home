# こってり開発部 ホームサイト

`index.html`、`privacy.html`、`ads.txt` をサイトのルートに置く静的サイトです。ビルドや依存ライブラリは不要です。公開先は `kotteri-apps.com` を想定しています。

## アプリを追加する

トップの `app-feature` に静的HTMLとして紹介を追加します。公開前にはURLと機能説明を確認してください。

## 外部リソース

外部フォントや JavaScript ライブラリは使用していません。`hero-shiba-ramen.jpg` は、インスタ用の柴犬画像を参考に新たに生成したサイト専用の実写寄りビジュアルです。`thumbs-up-dog-600.webp`（PNGフォールバック付き） は以前制作したデフォルメ柴犬です。ホームから COFFEE LOG と Instagram にリンクしています。AdSense の所有権確認メタタグは各 HTML の head にあり、広告配信スクリプトはありません。

## 公開前に確認すること

- `https://kotteri-apps.com/`、`/privacy.html`、`/ads.txt` に直接アクセスできること。
- `ads.txt` がテキストとして返ること。
- COFFEE LOG 側のプライバシーポリシーを別途確認・整備すること。ホームサイトのポリシーはアプリ側の代わりにはなりません。
- ドメインの移管手順では、既存の `coffee` およびメール関連の DNS レコードを変更しないこと。


## サイト構成（2026-09-30 追加分）

- `/index.html`：ホーム
- `/stories.html`：読み物一覧
- `/about-kotteri.html`：読み物1「こってり開発部という名前ができるまで」
- `/story-start.html`：読み物2「営業の僕が、趣味でアプリを作り始めた話」
- `/bar-to-coffee.html`：読み物3「BAR LOGからCOFFEE LOGへ」
- `/passport.html`：読み物4「産地パスポートを作った理由」
- `/coffee-log-guide.html`：COFFEE LOGの使い方ガイド
- `/operator.html`：運営者情報・広告方針
- `/updates.html`：お知らせ
- `/privacy.html`：プライバシーポリシー
- `/site.css`：全ページ共通スタイル
- JavaScriptなしでトップのアプリ紹介と読み物の導線が表示されます。
- `/sitemap.xml`, `/robots.txt`

読み物を追加する場合は、既存の記事ファイルをコピーして本文と`nav_links`相当のリンクを差し替えてください。
