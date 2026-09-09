「この薬、なに？」PWA Version 1.1.0

公開URL:
https://takarainko-svg.github.io/kono-kusuri-nani/

iPhone / iPad:
Safariで公開URLを開く → 共有 → 「ホーム画面に追加」

Android / Chrome:
公開URLを開く → ブラウザメニュー → 「アプリをインストール」または「ホーム画面に追加」

構成:
- index.html: 画面・スタイル
- app.js: 検索・表示ロジック
- drugs.json: 薬剤データ
- service-worker.js: オフライン対応・キャッシュ
- manifest.webmanifest: PWA設定

内容:
- ケアマネ向け薬剤クイックメモ
- 現在は薬剤5剤を収録
- PMDA電子添文をもとにケアマネ向けに要約
- standalone表示
- オフライン利用

薬剤追加:
原則として drugs.json の薬剤データを更新します。

重要:
本ツールはケアマネジメント上の情報整理を補助するものです。
診断、処方、服薬変更、中止等の判断には使用せず、実際の対応は医師・薬剤師等へ確認してください。
