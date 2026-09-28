/**
 * Lecture Companion Mode の講義構成です。
 *
 * 教員はこのファイルだけを編集すれば、各回の notebook、復習対象、
 * 必修問題、振り返り、外部実例を差し替えられます。ID は content.js の
 * lesson / practice の id と一致させてください。
 */
export const LECTURE_PLAN = [
  {
    sessionId: 1,
    title: "変数・print・f-string",
    notebookUrl: "https://colab.research.google.com/#create=true",
    summaryBullets: ["値へ意味のある変数名を付ける", "代入と計算の順序を説明する", "print() と f-string で結果を伝える"],
    requiredLessonIds: ["01-variables", "02-print", "03-fstrings"],
    requiredPracticeIds: ["01-p1", "02-p1", "03-p1"],
    reflectionCards: [
      { question: "変数を使うと、数値を直接書く場合より何が分かりやすくなりますか？", hint: "値の意味と、後から変更する場面を考えます。", answer: "値の役割を名前で表せるため式を読みやすくでき、同じ値をまとめて変更できます。" },
      { question: "f-string の波括弧には何を書きますか？", hint: "表示したい値を作る式です。", answer: "変数名や計算式など、評価して文字列へ埋め込みたいPythonの式を書きます。" },
    ],
    optionalExampleLinks: [{ label: "Compose As You Are", url: "https://shogo-ishikawa.github.io/compose-as-you-are/", description: "変数や数値を音のパラメータとして扱う例を見ます。" }],
    optionalNotes: "notebookで説明を受けた後、振り返りから必修練習へ進みます。",
  },
  {
    sessionId: 2, title: "list・dict・tupleとメソッド", notebookUrl: "https://colab.research.google.com/#create=true",
    summaryBullets: ["複数の値をlistへまとめる", "dictのキーで値の意味を保つ", "変更するデータと変更しない組を使い分ける", "関数とメソッドの呼び方を区別する"],
    requiredLessonIds: ["04-list", "05-dict", "06-tuple", "07-methods"], requiredPracticeIds: ["04-p1", "05-p1", "07-p1"],
    reflectionCards: [
      { question: "listとdictは、値をどのように指定して取り出しますか？", answer: "listは位置を示すindex、dictは意味を表すkeyで指定します。" },
      { question: "append() を実行すると元のlistはどうなりますか？", hint: "戻り値ではなく対象のlistに注目します。", answer: "対象のlist自体へ要素が追加されます。append()の戻り値はNoneです。" },
    ], optionalExampleLinks: [{ label: "CGA²", url: "https://shogo-ishikawa.github.io/CGA2/", description: "データの並びを視覚表現へつなげる例です。" }], optionalNotes: "",
  },
  {
    sessionId: 3, title: "math・range・for", notebookUrl: "https://colab.research.google.com/#create=true",
    summaryBullets: ["標準ライブラリをimportする", "range()で整数列を設計する", "forで同じ規則を繰り返す", "インデントで処理の範囲を示す"],
    requiredLessonIds: ["08-math", "09-range", "10-for"], requiredPracticeIds: ["08-p1", "09-p1", "10-p1"],
    reflectionCards: [{ question: "range(2, 8, 2) が作る整数を順に説明してください。", answer: "2, 4, 6です。開始値を含み、終了値8は含みません。" }, { question: "for文でインデントが必要なのはなぜですか？", answer: "繰り返す処理のまとまりをPythonへ示すためです。" }],
    optionalExampleLinks: [{ label: "Compose As You Are", url: "https://shogo-ishikawa.github.io/compose-as-you-are/", description: "繰り返しからリズムや音列を作る例です。" }], optionalNotes: "",
  },
  {
    sessionId: 4, title: "if・比較・論理演算", notebookUrl: "https://colab.research.google.com/#create=true",
    summaryBullets: ["比較式がboolを返すことを確認する", "if / elif / elseで処理を選ぶ", "and / or / notで条件を組み立てる", "forとifで抽出・分類する"],
    requiredLessonIds: ["11-conditions", "12-if", "13-for-if"], requiredPracticeIds: ["11-p1", "12-p1", "13-p1"],
    reflectionCards: [{ question: "elifが調べられるのはどのようなときですか？", answer: "それより前のifまたはelifの条件がFalseだったときです。" }, { question: "境界値を使って条件式を確認する理由は何ですか？", hint: "ちょうど等しい値を考えます。", answer: "< と <= などの違いによる分類ミスを見つけやすいためです。" }],
    optionalExampleLinks: [{ label: "CGA²", url: "https://shogo-ishikawa.github.io/CGA2/", description: "条件によって色や形を変える表現例です。" }], optionalNotes: "",
  },
  {
    sessionId: 5, title: "def・return・デバッグ", notebookUrl: "https://colab.research.google.com/#create=true",
    summaryBullets: ["処理を関数へ分ける", "引数と戻り値を区別する", "小さな入力で関数を確かめる", "tracebackの末尾と行番号から直す"],
    requiredLessonIds: ["14-def", "15-decompose-debug", "16-integrated"], requiredPracticeIds: ["14-p1", "15-p1", "16-p1"],
    reflectionCards: [{ question: "printとreturnの役割の違いを説明してください。", answer: "printは人へ表示し、returnは呼び出し元へ値を返して後の計算に使えるようにします。" }, { question: "長い処理を関数へ分ける利点は何ですか？", answer: "役割ごとに読み、再利用し、小さくテストして原因を絞れます。" }],
    optionalExampleLinks: [{ label: "Compose As You Are", url: "https://shogo-ishikawa.github.io/compose-as-you-are/", description: "音を作る処理を関数として組み合わせる例です。" }], optionalNotes: "",
  },
  {
    sessionId: 6, title: "オブジェクトとNumPy基礎", notebookUrl: "https://colab.research.google.com/#create=true",
    summaryBullets: ["変数とオブジェクトの関係を捉える", "属性とメソッドを使う", "NumPy配列のshapeとdtypeを見る", "配列演算とブール抽出を使う"],
    requiredLessonIds: ["17-objects-memory", "18-class-oop", "19-numpy-array", "20-numpy-index-ufunc"], requiredPracticeIds: ["17-p1", "19-p1", "20-p1"],
    reflectionCards: [{ question: "Pythonの変数へlistを代入すると、変数は何を保持すると考えられますか？", answer: "listオブジェクトそのものではなく、それを参照する名前として考えられます。" }, { question: "NumPy配列でshapeとdtypeを最初に見る理由は何ですか？", answer: "データの次元・大きさと要素型を確認し、想定どおり計算できるか判断するためです。" }],
    optionalExampleLinks: [{ label: "CGA²", url: "https://shogo-ishikawa.github.io/CGA2/", description: "数値配列を生成表現へ利用する例です。" }], optionalNotes: "NumPyの実行時は初回だけ追加パッケージの準備に時間がかかります。",
  },
  {
    sessionId: 7, title: "データ解析とMatplotlib", notebookUrl: "https://colab.research.google.com/#create=true",
    summaryBullets: ["読み込んだデータのshape・dtype・先頭を確認する", "欠損値を検出して扱う", "目的に合う集計と保存形式を選ぶ", "軸・単位・凡例を付けて可視化する"],
    requiredLessonIds: ["21-data-io", "22-missing-save", "23-matplotlib"], requiredPracticeIds: ["21-p1", "22-p1", "23-p1"],
    reflectionCards: [{ question: "CSVを読み込んだ直後に確認する3項目は何ですか？", answer: "shape、dtype、先頭の数行です。" }, { question: "グラフに軸ラベルと単位が必要なのはなぜですか？", answer: "何をどの尺度で示す図なのかを、読み手が誤解なく判断できるようにするためです。" }],
    optionalExampleLinks: [{ label: "CGA²", url: "https://shogo-ishikawa.github.io/CGA2/", description: "データと可視表現をつなぐ発展例です。" }, { label: "Compose As You Are", url: "https://shogo-ishikawa.github.io/compose-as-you-are/", description: "Pythonで得た値を音楽表現へ展開する発展例です。" }], optionalNotes: "外部実例は必修練習が終わった後の任意教材です。",
  },
];
