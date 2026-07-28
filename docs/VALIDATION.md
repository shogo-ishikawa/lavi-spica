# 検証記録 — LAVi-SPICA v1.0.0

検証日：2026-07-28

## 1. release構造とbranding

`npm run check`で次を検査します。

- 必須fileの存在
- `VERSION`、package、教材、Worker、Service Workerのversion整合
- app名が`LAVi-SPICA`で統一されていること
- **Structured Python Interactive Course and Activities**の表記
- READMEとapp homeで使用するhero imageの存在
- app icon、GitHub Pages workflow、HTTPS公開scriptの存在
- HTTPS公開scriptのshell構文
- 個人環境の絶対PATHが含まれないこと
- 旧app名、代表的な未処理markerが残っていないこと
- HTML・Markdownの相対linkがrelease内で解決できること

## 2. 教材構造

- 7 session
- 23 lesson
- 46 practice
- 49 after-class question
- 98 quiz question
- 各sessionに14問
- lesson ID、practice ID、question IDの一意性
- 指定された学習順序
- 全lessonが資料網羅表へ含まれること
- 選択肢と正答indexの整合

## 3. Python code片の構文検査

lesson、practice、小テストに含まれる253個のPython code片を`ast.parse()`で検査しました。

- 通常code片：すべて構文検査合格
- 意図的な`SyntaxError`教材：1件を想定どおり検出

## 4. 練習問題解答例の実行検査

`npm run validate:solutions`で46個すべての解答例を独立processで実行しました。

- 各実行は独立した一時directory
- 3つの同梱CSVを配置
- 1問20秒でtimeout
- Matplotlib backendは`Agg`
- 終了statusを確認
- 出力完全一致、部分一致、数値許容誤差、必須構文、禁止構文を検査

結果：**46 / 46件合格**

## 5. 小テスト問題の実行・整合検査

`npm run validate:quiz`で98問の構造と実行整合を検査しました。

- 難度、tag、選択肢重複、記述式acceptedの整合
- 標準出力を答える26問をCPythonで実行し、登録正答と照合
- 意図的な`SyntaxError`・`NameError`
- 修正後code、出力行数、型、NumPy shape

結果：**98 / 98件合格**

## 6. Git公開script

`publish-github-https.command`について次を確認しました。

- `bash -n`による構文検査
- 新規directoryでのGit初期化
- local author設定
- HTTPS remote登録
- release全fileのcommit
- `SPICA_PREPARE_ONLY=1`によるpush前dry run
- executable permissionの保持
- 独立した次version directoryから既存remote履歴へ接続し、2 commitの直線的な履歴として更新できること

履歴接続試験では使い捨てのlocal bare repositoryを用い、試験用script copyだけで`file://`を許可しました。配布script本体はHTTPS URLのみを受け付けます。実際のGitHub accountへのpushはcredentialを必要とするため、release作成環境では実行していません。

## 7. browser確認範囲

次を静的に確認しています。

- `index.html`の必須DOM ID
- JavaScript moduleの構文
- hero imageの実寸：1672 × 941 px
- app homeへのhero image組込み
- Service Workerのapp shellへのhero image登録
- manifest、favicon、stylesheet、module、data fileの相対path

作成環境のbrowser navigation policyにより、今回のrebrand後buildをheadless browserで再撮影する処理は遮断されました。公開前には実際に使用するbrowserでhome、lesson、practice、小テスト、教員modeを開き、表示を確認してください。

## 8. Pyodide実行の確認範囲

Worker API、module Worker、version固定、`loadPackagesFromImports()`、stdout/stderr、traceback、変数、Matplotlib figure、生成fileの処理を静的に確認しています。

作成環境では外部DNSが制限され、`cdn.jsdelivr.net`からPyodide本体を取得するend-to-end検査は行っていません。代わりに、全解答例をlocal CPythonで実行検証しています。

公開前には使用networkで次のpreflightを実行してください。

```python
print(42)
```

```python
import numpy as np
print(np.arange(5) ** 2)
```

```python
import numpy as np
import matplotlib.pyplot as plt
x = np.linspace(0, 1, 20)
plt.plot(x, x ** 2)
plt.show()
```

## 9. 既知の制約

- 初回Python実行はCDNとnetworkに依存
- Pyodide distributionはrelease ZIPへ同梱していない
- 小テストの正答は静的配信される
- server-side提出、本人認証、リアルタイム共同編集はない
- 自動確認は意味的な全正解を証明しない
- 40秒を超えるcodeはWorkerごと停止する
- 2 MBを超える生成fileはUIへ返さない
- `input()`は無効
