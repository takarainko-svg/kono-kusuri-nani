# Work用：薬剤追加・更新 標準手順

対象リポジトリ：`takarainko-svg/kono-kusuri-nani`

## 毎回最初に読むもの

1. `DRUG_DATA_SPEC.md`
2. `drugs.schema.json`
3. `drugs.json`

## 新規追加

1. 指定された薬名を一般名・商品名・別名のいずれかとして解決する。
2. `id / name / generic / brands / aliases` を横断し、既存薬との重複を確認する。
3. 商品名が既存の一般名レコードに属する場合は、新規レコードを作らず既存レコードとして扱う。
4. PMDAの最新電子添文を確認する。確認できない場合は推測で登録せず、理由を報告する。
5. `DRUG_DATA_SPEC.md` に従ってケアマネ向けに要約する。
6. `source.revision` と `source.checkedAt` を記録する。日付はAsia/Tokyoの実行日。
7. 新規レコードの `record.createdAt / updatedAt` は実行日、`version` は1。
8. `drugs.json` のみを変更する。データ追加だけの依頼でアプリ本体を変更しない。
9. `node scripts/validate-drugs.mjs` 相当の検証を行う。
10. 作業ブランチを作成し、PRを作る。検証が通れば原則としてmainへマージする。
11. GitHub Pagesのデプロイ完了を確認する。
12. 公開版で一般名・商品名の両方から検索できることを確認する。

## 既存薬の更新確認

1. PMDAの最新電子添文と現在のレコードを比較する。
2. 内容変更なし：`source.checkedAt` のみ更新。
3. 改訂時期のみ変更：`source.revision / checkedAt` を更新。
4. 要約内容変更：必要項目を更新し、`record.updatedAt` を実行日に変更、`record.version` を1増やす。
5. 変更点を報告する。変更なしの場合も「確認済み」と報告する。

## 完了報告

次を簡潔に報告する。

- 追加 / 更新 / 重複のためスキップした薬
- 一般名と代表商品名
- PMDA電子添文の改訂時期
- 情報確認日
- 変更したレコードのversion
- GitHub PR / マージ結果
- GitHub Pages公開確認結果

## ユーザーからの短い依頼例

- 「ロキソプロフェンを追加して」
- 「アセトアミノフェン、プレガバリン、ドネペジルを追加して」
- 「アムロジピンを最新のPMDAで更新確認して」
