<p align="center">
  <img src="assets/lavi-spica-hero.png" alt="LAVi-SPICA — Structured Python Interactive Course and Activities" width="100%">
</p>

# LAVi-SPICA

**LAVi-SPICA** は、プログラミングを初めて学ぶ大学生のためのPython基礎学習アプリです。

**SPICA** は **Structured Python Interactive Course and Activities** の略です。文法を読むだけでなく、**処理を予想する → コードを書く → 実行する → 結果を説明する**という学習を繰り返し、Pythonの考え方と問題を解く力を身につけます。

Pythonはブラウザ内で動くため、端末へのインストールは不要です。授業中の演習、欠席した回の補習、自宅での復習を同じ教材で進められます。


## 講義補助モード

トップページでは、従来どおり詳しい教材を順に読む「通常学習モード」と、Google Colab / notebookを中心にした授業後の「講義補助モード」を選べます。講義補助モードは、notebook、今日の要点、振り返りカード、必修practice（未着手／実行済み／合格済み）、任意の外部実例を各回の1画面へまとめます。詳しい自習用解説は通常モードに残っています。

practiceのコードは問題IDごとにブラウザへ自動保存されます。同じ問題へ戻ると下書きが復元され、編集中に例題や別問題のコードを読み込む前には確認画面が表示されます。「開始コードへ戻す」はエディタの「初期化」から明示的に行います。

lessonでは **Compact View / 詳しい解説を表示** を切り替えられます。Compact Viewは長い自習用解説を隠し、目標、実行エディタ、練習、ヒントへ集中する表示です。選択は同じブラウザへ保存されます。

## 教員向け：講義構成を編集する

講義補助モードの内容は [`js/lecture-plan.js`](js/lecture-plan.js) に集約しています。バックエンドやビルドは不要です。各回の設定項目は次のとおりです。

| 項目 | 設定内容 |
|---|---|
| `sessionId` | 回を識別する一意の番号 |
| `title` | 講義補助画面の回タイトル |
| `notebookUrl` | 授業で使うColab notebookの共有URL |
| `summaryBullets` | 今日の要点（3〜6個程度を推奨） |
| `requiredLessonIds` | 詳しい復習先として表示するlesson ID |
| `requiredPracticeIds` | 「今日の必修練習」に表示するpractice ID |
| `reflectionCards` | `question`、任意の`hint`、折りたたむ`answer` |
| `optionalExampleLinks` | 任意実例の`label`、`url`、`description` |
| `optionalNotes` | その回の短い案内（空文字でも可） |

```js
{
  sessionId: 1,
  title: "変数・print・f-string",
  notebookUrl: "https://colab.research.google.com/drive/共有ID",
  summaryBullets: ["変数へ名前を付ける", "f-stringで結果を伝える"],
  requiredLessonIds: ["01-variables", "02-print"],
  requiredPracticeIds: ["01-p1", "02-p1"],
  reflectionCards: [
    { question: "変数を使う利点は？", hint: "読み手を意識します。", answer: "値の意味を名前で示せます。" },
  ],
  optionalExampleLinks: [
    { label: "Compose As You Are", url: "https://example.edu/music", description: "Pythonを音へつなぐ例" },
  ],
  optionalNotes: "必修問題の後に任意実例を紹介します。",
}
```

`notebookUrl`はColabの「共有」から学生が閲覧できるURLへ置き換えてください。lesson / practice IDは [`js/content.js`](js/content.js) の各`id`を使います。事後学習のコード問題には [`js/lesson-extensions.js`](js/lesson-extensions.js) のIDも指定できます。存在しないIDは検証でエラーになります。外部実例は本編へ埋め込まず、新しいタブで開きます。

編集後は次の手順で `http://localhost:4173/#lecture` を確認します。

```bash
npm run check
npm test
npm run serve
```

## 学べる内容

| 学習段階 | 主な内容 |
|---|---|
| Pythonの第一歩 | 変数、型、四則演算、`print()`、f-string |
| データをまとめる | `list`、`dict`、`tuple`、index、slice、メソッド |
| 計算を繰り返す | `math`、`range()`、`for`、累積計算 |
| 条件で処理を変える | 比較演算、`if`、`elif`、論理演算、抽出・分類 |
| 処理を再利用する | `def`、引数、`return`、関数分割、デバッグ |
| 科学計算へ進む | オブジェクト、class、NumPy、配列演算 |
| データを読み解く | CSV、欠損値、集計、保存、Matplotlib |

## lessonの進め方

各lessonは、アプリだけでも学び直せるように次の順序で構成されています。

1. **到達目標**で、できるようになることを確認します。
2. **詳しい解説**で、文法の役割、記号の意味、処理順序を読みます。
3. **処理の追跡**で、各行の実行後に変数と出力がどう変わるか確かめます。
4. **入力する例題**を実行し、予想と実際の結果を比べます。
5. **練習問題**で、短いコードを自分で完成させます。
6. **事後学習**の知識問題2問とコード問題2問で、理解を定着させます。
7. **エラー確認**で、よくある失敗と原因の探し方を確認します。

練習問題と事後学習のコード問題は、出力や必要な処理を自動確認できます。ヒントと解答例は、まず自分で試した後に開いてください。

## Pythonエディタ

lesson内のエディタでは、次の内容を確認できます。

- `print()`による出力とエラーメッセージ
- 実行後の主な変数、型、値
- Matplotlibで作成した図
- コードが作成した小さなファイル

エラーが出たときは、tracebackの最後、行番号、変数名、引用符、括弧、コロン、インデントの順に確認します。一度に多くの場所を直さず、1か所ずつ変更して再実行します。

## 学習記録

lessonの完了、コード下書き、予想、事後学習の回答、練習履歴は、使用中のブラウザへ自動保存されます。通常の再読み込みやブラウザ終了では消えません。

ただし、サイトデータを削除した場合、別のブラウザや端末を使った場合、端末を初期化した場合には記録を引き継げません。大切な記録は「進捗・保存」から進捗JSONを書き出してください。書き出したJSONは、別の端末でも読み込めます。

## 授業当日の確認テスト

確認テストは、学生用NUメールと教室内のQR認証を使って受験します。

1. スマートフォンで、教室のスクリーンに表示されたQRコードを読み取ります。
2. 初回だけ学籍番号と氏名を登録します。次回からはNUメールから復元されます。
3. PCで、教員から案内された「PC小テスト入口」を学生用NUメールで開きます。
4. 必要なQR認証が完了し、教員が開始操作をすると問題画面が開きます。
5. 選択・短答問題と短いPythonコード問題へ回答し、画面から提出します。
6. 第2認証が設定された回は、教員の案内に従ってもう一度QRコードを読み取ります。

スマートフォンを忘れた場合やQRを読み取れない場合は、PC待機画面から教員確認を依頼できます。教員が教室内の本人と学籍情報を確認した後、そのGoogleアカウントだけを個別に認証します。共通パスワードは使用しません。

回答はクラウドへ送信されるため、通常は回答JSONをGoogle Classroomへ添付する必要はありません。得点や返却方法は教員の指示に従ってください。

詳しい操作は [学生向けガイド](docs/STUDENT_GUIDE.md) を参照してください。

## 対応環境

最新のGoogle ChromeまたはMicrosoft Edgeを推奨します。FirefoxとSafariでも利用できます。閲覧やQR認証はスマートフォンでも可能ですが、Pythonコードの入力にはキーボードを使えるPCまたはタブレットが適しています。

## License

MIT License
