# 検索・SNS・AI検索の運用

公開URL: https://djnaoyaman.github.io/yoshida-farmer/

## 実装
- 検索を禁止していた noindex / nofollow を解除。canonical と日本語のページ情報を維持。
- OGP / Xカードを維持し、HTTPS画像指定を追加。X・LINE・対応端末の共有操作を追加。
- WebSite / WebPage / Organization / Product / FAQPage を関連付け。本文に農園・産地・品種・栽培・連絡先への導線を明記。
- 価格・在庫・評価・認証など未確認の情報は構造化データに追加しない。FAQのリッチリザルト表示は保証されない。
- 画像とアイコンのbase64埋め込みを廃止。画像に寸法・遅延読み込み・ヒーロー優先読み込みを指定。
- llms.txt は任意の補助情報として更新。AI検索での引用や順位を保証するものではない。

## 公開後に所有者が行うこと
1. Search Console にサイトを登録・所有権確認し、sitemap.xml を送信。トップページのURL検査でインデックス登録をリクエスト。
2. Bing Webmaster Tools に登録し、同じサイトマップを送信。
3. Google Rich Results Test / Schema Markup Validator で公開URLを確認。
4. Facebook Sharing Debugger や実際のLINE・X投稿でカードを確認。旧カードが残る場合は再取得を依頼。
5. PageSpeed Insights でスマートフォン表示を測定し、Search Console の掲載状況・検索語句・クリックを継続確認。

## ホスティングの注意
robots.txt はホスト直下のみ有効。このリポジトリの /yoshida-farmer/robots.txt は、GitHub Pages のプロジェクト配信ではクローラーの制御ファイルとして使われない。
ホスト全体の制御が必要なら djnaoyaman.github.io のリポジトリに /robots.txt を設置し、このサイトのサイトマップURLを記載する。他サイトにも影響するため、ここでは変更しない。
独自ドメインへ移行する場合、canonical、OGP、構造化データ、サイトマップ、llms.txt と共有URLをまとめて更新する。

## 更新時
販売状況・収穫年・価格・配送条件は農園に確認して本文を更新し、構造化データとllms.txtも同期。sitemap.xmlのlastmodは本文を実質的に更新した日だけ変更。
トップの予約案内は元の情報を維持しているため、最新シーズンの受付状況を確認する。
npm test でインデックス設定・構造化データ・FAQ一致・画像・リンクを検証。GitHub Actionsでも同じ検証を行う。

参考: https://developers.google.com/search/docs/appearance/ai-features
GoogleのAI検索でも通常のSEO・クロール可能な本文・本文に一致する構造化データが基礎。llms.txt等の特別なファイルは必須ではない。
