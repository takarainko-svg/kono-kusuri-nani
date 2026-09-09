「この薬、なに？」PWA Version 1.2.0

公開URL:
https://takarainko-svg.github.io/kono-kusuri-nani/

構成:
- index.html: 画面・スタイル
- app.js: 検索・表示ロジック
- drugs.json: 薬剤データ
- drugs.schema.json: データ形式
- DRUG_DATA_SPEC.md: 登録・更新ルール
- WORK_DRUG_MAINTENANCE.md: Work用標準手順
- scripts/validate-drugs.mjs: データ検証
- service-worker.js: オフライン対応・キャッシュ

薬剤追加:
原則として drugs.json のみを更新し、検証後にGitHub Pagesへ反映します。

重要:
本ツールはケアマネジメント上の情報整理を補助するものです。
診断、処方、服薬変更、中止等の判断には使用せず、実際の対応は医師・薬剤師等へ確認してください。
