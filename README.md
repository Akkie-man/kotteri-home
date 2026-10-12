# こってり開発部 ホームサイト

`index.html`、`privacy.html`、`ads.txt` をサイトのルートに置く静的サイトです。ビルドや依存ライブラリは不要です。公開先は `kotteri-apps.com` を想定しています。

## アプリを追加する

`build-content.cjs` のアプリ紹介を編集して再生成します。記事の追加は [ARTICLE-GUIDE.md](ARTICLE-GUIDE.md) を参照してください。

## 外部リソース

外部フォントや JavaScript ライブラリは使用していません。`hero-shiba-ramen.jpg` は、インスタ用の柴犬画像を参考に新たに生成したサイト専用の実写寄りビジュアルです。`thumbs-up-dog-600.webp`（PNGフォールバック付き） は以前制作したデフォルメ柴犬です。ホームから COFFEE LOG、BAR LOG、Instagram にリンクしています。AdSense の所有権確認メタタグは各 HTML の head にあります。広告は `ads.js` が管理します（下記「広告」）。

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

## 2026-10-02 ホーム刷新

アプリの実画面を使った2枚のカード、両アプリの使い方一覧、新着記事とおすすめ記事、BAR LOG紹介・コレクション解説・使い方を追加しました。

記事を更新するときだけ `node build-content.cjs` を実行し、生成HTMLも保存します。公開時のビルドや外部ライブラリは不要です。手順は [ARTICLE-GUIDE.md](ARTICLE-GUIDE.md) に記載しています。

## 広告（Google AdSense 手動広告）

- 設定（クライアントID、スロットID、有効/無効）は `ads.js` 冒頭の `AD_CONFIG` だけです。自動広告は使いません。
- 広告を出すページと位置は `build-content.cjs` の `adPlan` が決めます。`node build-content.cjs` を実行すると、広告枠（`<div class="ad-slot">`）と `<script src="/ads.js" defer>` が対象ページだけに入り、それ以外のページ（プライバシー、運営者情報、お知らせ、一覧）からは取り除かれます。
- 広告は `data-ad-status="filled"` になった後だけ「広告」ラベルと罫線を表示します。未配信・ブロック・読み込み失敗時は広告枠だけが非表示になります。`<html>`・`<body>` には広告用の class や属性を付けません。
- 本文が `AD_LONG_ARTICLE_CHARS`（3000文字）以上の読み物だけ、本文途中にも1枠入ります。
- `ads.txt` はルートに置いています（`google.com, pub-4960959858706803, DIRECT, f08c47fec0942fa0` の1行）。
