# 配布・公開ガイド

## 1. 公開方式

LAVi-SPICAは静的ファイルだけで動作します。次の公開先を利用できます。

- GitHub Pages
- 学内Web server
- Netlify、Cloudflare Pages等の静的hosting
- 教員PC上の一時HTTP server

`file://`での直接起動は、ES ModulesとWeb Workerの制約により非対応です。

## 2. version directory

release ZIPの最上位directoryは`vX.Y.Z`です。任意のapp directory直下へ展開すると、次の構成になります。

```text
SPICA/
├── v1.0.0/
├── v1.1.0/
└── v2.0.0/
```

各versionは独立して保存します。公開repositoryを更新するときは、新しいversion directoryに移動して同梱の`publish-github-https.command`を実行します。

公開物、source code、log、設定fileには個人環境の絶対PATHを含めないでください。本releaseは相対PATHだけを使用します。

## 3. GitHub Pages

HTTPSによるpush手順は [`GITHUB_HTTPS.md`](GITHUB_HTTPS.md) を参照してください。

同梱workflowは次を行います。

- Node.js 20で静的検査
- Python構文検査
- 46解答例の実行検査
- 98問の小テスト構造・実行整合検査
- Pages artifactのupload
- deployment

GitHub上で **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。

## 4. ローカル確認

```bash
python3 -m http.server 4173
```

```text
http://localhost:4173/
```

次を確認します。

- READMEとアプリhomeにLAVi-SPICAのhero imageが表示される
- 全navigationが開く
- lessonのエディタが表示される
- Pythonで`print(42)`が実行できる
- `numpy`をimportできる
- Matplotlibの図が表示される
- 小テストの開始・提出・JSON保存
- 進捗JSONの書出し・読込み

## 5. ネットワーク要件

アプリ本体と教材はhosting先から配信されます。Python実行時にPyodideを取得します。

許可が必要なdomain：

```text
cdn.jsdelivr.net
```

初回読込の負荷を避けるため、授業開始前に学生へページを開かせ、`print(42)`を一度実行させる運用が有効です。

## 6. version更新

新しいreleaseでは、少なくとも次を更新します。

- `VERSION`
- `package.json`
- `COURSE_CONTENT.meta.version`
- `index.html`の表示
- `sw.js`のcache name
- `CHANGELOG.md`

Service Workerはcache nameが変わると旧cacheを削除します。更新後に古い画面が残る場合は、ブラウザの再読込またはsite data削除を行います。

## 7. Pyodideをself-hostする場合

学内networkでCDNが使えない場合、Pyodide distributionを同じoriginへ置き、`workers/python-worker.mjs`の`PYODIDE_BASE`を変更します。distributionは容量が大きいため、本releaseには同梱していません。

self-host時もmodule Workerとして読み込めるHTTP headerとMIME typeを確認してください。
