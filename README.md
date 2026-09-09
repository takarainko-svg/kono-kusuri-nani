# この薬、なに？

ケアマネ向け薬剤クイックメモ（PWA）です。

- GitHub Pages: https://takarainko-svg.github.io/kono-kusuri-nani/
- PC / Androidでインストール可能
- Service Workerによるオフライン利用に対応
- PMDA電子添文をもとに、ケアマネ向けの観察ポイントを中心に要約

## 構成

- `index.html`: 画面・スタイル
- `app.js`: 検索・表示ロジック
- `drugs.json`: 薬剤データ
- `drugs.schema.json`: 薬剤データの形式
- `DRUG_DATA_SPEC.md`: 登録・更新ルール
- `WORK_DRUG_MAINTENANCE.md`: Work用の標準手順
- `scripts/validate-drugs.mjs`: 薬剤データ検証
- `service-worker.js`: オフライン対応・キャッシュ
- `manifest.webmanifest`: PWA設定

現在は薬剤5剤を収録しています。薬剤情報は診断・処方・服薬変更・中止の判断を目的としたものではありません。

薬剤追加・更新時は原則として `drugs.json` のみを変更し、標準手順と自動検証を通して反映します。
