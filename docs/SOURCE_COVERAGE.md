# 講義資料の網羅表

LAVi-SPICA v1.0.0は、Python基礎文法に加え、File Libraryで確認できた「計算科学基礎」の追加講義資料4件をブラウザ教材向けに再構成しています。

原資料のPDFそのものをアプリへ複製したのではなく、主要概念、コード、注意点、練習、事後学習へ分解し、lessonに割り当てています。

## 1. Python基礎文法

| 項目 | lesson |
|---|---|
| 変数、代入、型、四則演算 | 01 |
| `print()`、`sep`、`end`、コメント | 02 |
| f-string、表示桁、単位 | 03 |
| `list`、index、slice、更新 | 04 |
| `dict`、key、`get()` | 05 |
| `tuple`、アンパック、1要素tuple | 06 |
| 関数とメソッド、文字列・listメソッド | 07 |
| `math`、円周率、平方根、三角関数 | 08 |
| `range(start, stop, step)` | 09 |
| `for`、インデント、累積 | 10 |
| 比較、`bool`、論理演算 | 11 |
| `if`、`elif`、`else`、境界値 | 12 |
| `for`と`if`、抽出・分類 | 13 |
| `def`、引数、`return` | 14 |
| 分解、traceback、デバッグ | 15 |
| 基礎文法の統合問題 | 16 |

## 2. オブジェクト指向プログラミングの基礎概念

対応原資料：`introducing_oop.pdf`

| 原資料の主要項目 | lessonでの扱い |
|---|---|
| 変数とメモリ、Pythonの参照 | 17で`id()`、共有参照、copyを実行して観察 |
| オブジェクト＝値・型情報・操作 | 17の解説と変数tab |
| attributeとmethod | 07、17 |
| ドットによるメソッド呼出し | 07 |
| 演算子と特殊メソッド | 17の発展解説 |
| `dir()`で機能を調べる | 17 |
| Pythonではすべてがオブジェクト | 17 |
| 手続き型とOOP | 18 |
| class、instance、`self`、`__init__` | 18 |
| 継承の入口 | 18の発展解説 |
| Pythonの利便性とメモリ負荷 | 17の概念説明 |

初学者に過剰な内部実装を要求しないよう、参照カウントやbyte数は背景として扱い、共有参照による実際の挙動を中心にしています。

## 3. NumPyの基本操作

対応原資料：`numpy_basic.pdf`

| 原資料の主要項目 | lessonでの扱い |
|---|---|
| 科学計算での`math` | 08 |
| listの柔軟性と数値計算上の負荷 | 19の導入 |
| `import numpy as np` | 19 |
| `ndarray`、`shape`、`dtype` | 19 |
| `np.array()`、`np.arange()`、`np.linspace()` | 19 |
| index、slice、多次元配列 | 19、20 |
| ベクトル化 | 19 |
| 配列には`math`ではなく`np`関数 | 20 |
| `np.sqrt()`、`np.sin()`等のufunc | 20 |
| `sum`、`mean`、`min`、`max` | 20 |
| ブールインデックス | 20 |
| `np.where()` | 20 |
| list+forとNumPyの速度差 | 19の背景・発展課題 |

## 4. NumPyを用いたデータ解析

対応原資料：`numpy_data_analysis.pdf`

| 原資料の主要項目 | lessonでの扱い |
|---|---|
| `np.loadtxt()` | 21 |
| `np.genfromtxt()` | 21、22 |
| 読込直後の`shape`、`dtype`、`data[:5]` | 21の共通手順 |
| 行・列のslice | 21 |
| 欠損値とNaN | 22 |
| `np.isfinite()`によるmask | 22 |
| 異常値・範囲選択 | 20、22 |
| `sort`、`argsort` | 22 |
| `np.savetxt()` | 21 |
| `np.save()`、`np.load()` | 22 |
| `.npy`、`.npz`の目的 | 22 |
| 巨大データとDask | 22の発展解説 |
| awk等の前処理ツールの位置付け | 22の発展解説 |

アプリには、通常データ、欠損値を含むデータ、運動データの3つのCSVを同梱しています。

## 5. Matplotlibを用いたデータ可視化

対応原資料：`visualization.pdf`

| 原資料の主要項目 | lessonでの扱い |
|---|---|
| 可視化の必要性 | 23 |
| `plot()` | 23 |
| `scatter()` | 23 |
| `hist()` | 23 |
| `bar()` | 23の解説 |
| 軸ラベルと単位 | 23の必須条件 |
| title、legend、grid | 23 |
| `subplots()` | 23 |
| `tight_layout()` | 23 |
| `savefig()` | 23、生成ファイルtab |
| 外れ値と相関の読み方 | 23の事後学習 |

## 6. アプリ独自に追加した教育要素

- 各lessonの実行前予想
- 一度に一条件だけ変える比較
- 練習問題の自動確認
- エラー名別の確認手掛かり
- 事後学習とExit Ticket
- 20分小テスト問題バンク
- 教員用配布URLと結果JSON集計
- localStorageによる進捗・下書き保存
- AI生成コードの説明・変更・検証を重視する運用
