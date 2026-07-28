<p align="center">
  <img src="assets/lavi-spica-hero.png" alt="LAVi-SPICA — Structured Python Interactive Course and Activities" width="100%">
</p>

# LAVi-SPICA v1.0.0

**LAVi-SPICA** は、日本大学生産工学部「計算科学基礎」のために構成した、プログラミング初心者向けのブラウザ内完結型Python学習アプリです。

**SPICA** は **Structured Python Interactive Course and Activities** の略です。短い解説、一斉入力、実行前の予想、ブラウザ内でのPython実行、練習問題、事後学習、次回冒頭の20分小テストを一つの学習経路へまとめています。

> 対象：プログラミング経験を前提としない大学学部生  
> 授業：100分 × 7回分の基礎ユニットを内蔵  
> 実行：学生のブラウザ内。Pythonのローカルインストール不要  
> 配布：静的ファイルだけでGitHub Pagesへ公開可能  
> License：MIT

## 収録内容

- **7回分の授業設計**：原則として毎回、冒頭20分の前回範囲小テストを含む
- **23 lesson**：解説、到達目標、一斉入力例、実行前予想、エディタ、エラー解説
- **46練習問題**：ヒント、解答例、ブラウザ内実行、自動確認
- **49事後学習問題**：自分の言葉で説明する問いと解答例
- **98小テスト問題**：各回14問、単一選択・複数選択・短答
- **講義資料の統合**：オブジェクト指向、NumPy基礎、NumPyデータ解析、Matplotlib可視化
- **教員モード**：100分進行表、小テスト配布URL生成、結果JSON集計、CSV書き出し
- **進捗保存**：lesson、コード下書き、予想、練習履歴、小テスト履歴を端末内保存

## 学習順序

| 回 | 主題 | lesson | 次回冒頭の確認範囲 |
|---:|---|---|---|
| 1 | 変数・`print`・f-string | 01–03 | 変数、型、出力、書式指定 |
| 2 | `list`・`dict`・`tuple`・メソッド | 04–07 | コンテナ型、index、slice、更新 |
| 3 | `math`・`range`・`for` | 08–10 | 数学関数、整数列、反復、インデント |
| 4 | 比較・`if`・論理演算 | 11–13 | 真偽値、分岐、境界値、for-if |
| 5 | `def`・`return`・デバッグ | 14–16 | 関数、引数、戻り値、分解、統合問題 |
| 6 | オブジェクトとNumPy基礎 | 17–20 | 参照、class、ndarray、ベクトル化 |
| 7 | データ解析とMatplotlib | 21–23 | 入出力、欠損値、保存、可視化 |

第1回の冒頭20分は診断テストとして利用できます。第8回以降に別の数値計算アプリやグループ制作へ移る場合でも、第7回までで基礎範囲を一通り参照できます。

## ローカル起動

ES ModulesとWeb Workerを使うため、`index.html`を直接ダブルクリックせず、HTTPサーバーから開いてください。

```bash
cd v1.0.0
python3 -m http.server 4173
```

ブラウザで次を開きます。

```text
http://localhost:4173/
```

Node.js 20以上がある場合は次でも起動できます。

```bash
npm run serve
```

## GitHubへHTTPSで公開

1. GitHub上に空のrepositoryを作成します。推奨名は `lavi-spica` です。
2. このrelease directoryで `publish-github-https.command` を実行します。
3. 画面の指示に従い、repositoryのHTTPS URLを入力します。
4. 初回push後、GitHubの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定します。

macOS Terminalから実行する場合：

```bash
chmod +x publish-github-https.command
./publish-github-https.command
```

このscriptは、新規repositoryへの初回公開だけでなく、別の`vX.Y.Z` directoryから既存repositoryの履歴を引き継いで更新する運用にも対応しています。詳細は [`docs/GITHUB_HTTPS.md`](docs/GITHUB_HTTPS.md) と [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) を参照してください。

## 学生の基本操作

1. 「学習コース」からlessonを開く
2. 実行前の予想を書く
3. 教員と同じ短いコードを入力するか、「このコードをエディタへ」で読み込む
4. **実行**、または `Ctrl / ⌘ + Enter`
5. コンソール、変数、図、生成ファイルを確認する
6. 一度に一箇所だけ変更して再実行する
7. 練習問題を実行して確認する
8. 事後学習とExit Ticketを記録する

学生向けの詳しい説明は [`docs/STUDENT_GUIDE.md`](docs/STUDENT_GUIDE.md) にあります。

## Python実行環境

LAVi-SPICAは、WebAssembly版Pythonである **Pyodide 314.0.3** をmodule Web Worker内で読み込みます。

- 初回のPython実行にはインターネット接続が必要
- `numpy`、`matplotlib`などはコード中の`import`を検出して必要時に読み込む
- PythonコードはUIと別のWorkerで実行
- 40秒を超えた処理は停止
- `input()`は無効。値はコード内の変数へ代入
- 同梱CSVは `experiment.csv`、`experiment_missing.csv`、`projectile.csv`
- Matplotlibの図、主要変数、2 MB以下の生成ファイルをUIへ返す

CDNの許可が必要なネットワークでは、次のdomainを事前確認してください。

```text
cdn.jsdelivr.net
```

## 小テストの運用

教員モードで範囲、制限時間、問題数、Seedを設定すると、配布URLを生成できます。同じ範囲・問題数・Seedであれば、同じ問題構成を再現できます。

学生の結果はサーバーへ自動送信されません。提出方法は次のいずれかを使用します。

- 結果JSONをLMSへ提出
- 結果CSVをLMSへ提出
- 教員PCでJSONを複数読み込み、集計CSVを作成

問題と正答は静的配信ファイルに含まれるため、日常的な理解確認用です。監督を要する試験にはLMS等を使用してください。

## 保存されるデータ

| 保存先 | 内容 | 期間 |
|---|---|---|
| `localStorage` | 学籍番号・氏名、lesson進捗、コード下書き、予想、メモ、練習履歴、小テスト履歴 | ブラウザデータを削除するまで |
| `sessionStorage` | 受験中の小テスト、回答、締切時刻 | タブのsessionが続く間 |
| サーバー | なし | — |

別端末へ移す場合は「進捗・保存」から進捗JSONを書き出してください。

## ファイル構成

```text
v1.0.0/
├── index.html
├── assets/
│   ├── lavi-spica-hero.png
│   └── logo.svg
├── css/styles.css
├── js/
├── workers/
├── data/
├── docs/
├── scripts/
├── tests/
├── publish-github-https.command
├── sw.js
├── manifest.webmanifest
└── .github/workflows/deploy-pages.yml
```

## 検証

```bash
npm run verify
```

このcommandは静的構造、JavaScript構文、Pythonコード片、46個の解答例、98問の小テスト整合を確認します。検証範囲と実施結果は [`docs/VALIDATION.md`](docs/VALIDATION.md) に記録しています。

## 講義資料との対応

教材本文は、講義資料を単純に転載するのではなく、初学者向けブラウザ教材として再構成しています。網羅項目とlesson対応は [`docs/SOURCE_COVERAGE.md`](docs/SOURCE_COVERAGE.md) およびアプリ内「資料・用語集」で確認できます。

## 関連ガイド

- [教員向け授業運用ガイド](docs/INSTRUCTOR_GUIDE.md)
- [学生向け利用ガイド](docs/STUDENT_GUIDE.md)
- [講義資料の網羅表](docs/SOURCE_COVERAGE.md)
- [小テスト運用ガイド](docs/QUIZ_OPERATION.md)
- [GitHub HTTPS公開ガイド](docs/GITHUB_HTTPS.md)
- [GitHub Pages・学内配信](docs/DEPLOYMENT.md)
- [検証記録](docs/VALIDATION.md)
- [変更履歴](CHANGELOG.md)

## License

MIT License。詳細は [`LICENSE`](LICENSE) を参照してください。
