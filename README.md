# こってり開発部 ホームサイト

`index.html`、`privacy.html`、`ads.txt` をサイトのルートに置く静的サイトです。ビルドや依存ライブラリは不要です。公開先は `kotteri-apps.com` を想定しています。

## アプリを追加する

`index.html` の末尾にある `const apps = [...]` に、`name`、`subtitle`、`description`、`url`、`status`、`features` を持つデータを1件追加してください。`status: "published"` のアプリだけ表示されます。公開前にはURLと機能説明を確認してください。

## 外部リソース

外部フォントや JavaScript ライブラリは使用していません。`hero-shiba-ramen.jpg` は、インスタ用の柴犬画像を参考に新たに生成したサイト専用の実写寄りビジュアルです。`thumbs-up-dog-600.webp`（PNGフォールバック付き） は以前制作したデフォルメ柴犬です。ホームから COFFEE LOG と Instagram にリンクしています。AdSense の所有権確認メタタグは各 HTML の head にあり、広告配信スクリプトはありません。

## 公開前に確認すること

- `https://kotteri-apps.com/`、`/privacy.html`、`/ads.txt` に直接アクセスできること。
- `ads.txt` がテキストとして返ること。
- COFFEE LOG 側のプライバシーポリシーを別途確認・整備すること。ホームサイトのポリシーはアプリ側の代わりにはなりません。
- ドメインの移管手順では、既存の `coffee` およびメール関連の DNS レコードを変更しないこと。
