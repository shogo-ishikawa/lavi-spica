/** 区分番号は授業日ではありません。lesson IDをそのままトピックIDとして使います。 */
const topic = (id, materialRefs = [], application = null) => ({ id, materialRefs, application });

const cga = (lesson, relation, change, observe) => ({ app: "CGA²", lesson, relation, prediction: `変更前の結果を見て、${observe}を予想します。`, change, observe, url: "https://shogo-ishikawa.github.io/cga-atelier/", steps: `アプリを開く → レッスン一覧 →「${lesson}」を選ぶ → 例題を実行` });
const music = (lesson, relation, change, observe) => ({ app: "Compose As You Are", lesson, relation, prediction: `変更前の音を聴き、${observe}を予想します。`, change, observe, url: "https://shogo-ishikawa.github.io/compose-as-you-are/", steps: `アプリを開く → レッスン一覧から「${lesson}」に対応する例題を選ぶ` });

export const LECTURE_PLAN = [
  { sessionId: 1, title: "変数・print・f-string", topics: [
    topic("01-variables", [{ materialId: "colab-variables", coverage: "変数、代入、型" }], music("テンポを変える例", "変数の値が音楽の速さへ反映される", "テンポを表す変数を1つ変更", "再生速度がどう変わるか")),
    topic("02-print", [{ materialId: "colab-variables", coverage: "printによる出力" }, { materialId: "colab-basic-features", coverage: "コメントなどの補足" }]),
    topic("03-fstrings", [{ materialId: "colab-variables", coverage: "値を分かりやすく出力する方法" }]),
  ]},
  { sessionId: 2, title: "list・dict・tupleとメソッド", topics: [
    topic("04-list", [{ materialId: "colab-basic-features", coverage: "リストと添字" }], music("音列の一部を変える例", "リストの要素が音の並びになる", "音列の特定の要素を1つ変更", "何番目の音が変わるか")),
    topic("05-dict", [{ materialId: "colab-basic-features", coverage: "辞書" }]), topic("06-tuple", [{ materialId: "colab-basic-features", coverage: "notebookで詳しく扱わないためSPICAの補足" }]), topic("07-methods", [{ materialId: "colab-basic-features", coverage: "リスト・辞書の操作。未掲載部分はSPICAの補足" }]),
  ]},
  { sessionId: 3, title: "math・range・for", topics: [
    topic("08-math", [{ materialId: "colab-basic-features", coverage: "import、math" }], cga("Sine & Pi Lab", "sin、cos、piが波や配置を作る", "式の係数を1つ変更", "波や配置がどう変わるか")),
    topic("09-range", [{ materialId: "colab-loop-branch", coverage: "range" }], cga("Range Parade", "rangeが反復に使う数列を作る", "rangeの終了値またはstepを変更", "個数と間隔がどう変わるか")),
    topic("10-for", [{ materialId: "colab-loop-branch", coverage: "forによる反復" }], cga("For Loop Lab", "forが同じ描画を繰り返す", "反復回数を変更", "図形の数と配置がどう変わるか")),
  ]},
  { sessionId: 4, title: "if・比較・論理演算", topics: [topic("11-conditions", [{ materialId: "colab-loop-branch", coverage: "比較と論理演算" }]), topic("12-if", [{ materialId: "colab-loop-branch", coverage: "if、elif、else" }], cga("If Rule Bands", "条件によって色や形を切り替える", "比較する境界値を変更", "どの帯が切り替わるか")), topic("13-for-if", [{ materialId: "colab-loop-branch", coverage: "反復と条件分岐の組合せ" }])]},
  { sessionId: 5, title: "def・return・デバッグ", topics: [topic("14-def", [{ materialId: "colab-functions", coverage: "def、引数、return" }], music("短い音型を関数にする例", "関数が音型を再利用可能にする", "引数を1つ変更", "音高や長さがどう変わるか")), topic("15-decompose-debug", [{ materialId: "colab-functions", coverage: "関数を小さく分けて確認する" }]), topic("16-integrated", [{ materialId: "colab-functions", coverage: "関数の総合演習" }, { materialId: "colab-loop-branch", coverage: "総合問題で使う反復と条件分岐" }])]},
  { sessionId: 6, title: "オブジェクトとNumPy基礎", topics: [topic("17-objects-memory", [{ materialId: "pdf-oop", coverage: "オブジェクトと参照" }]), topic("18-class-oop", [{ materialId: "pdf-oop", coverage: "属性、メソッド、クラス" }]), topic("19-numpy-array", [{ materialId: "pdf-numpy-basic", coverage: "配列、shape、dtype" }]), topic("20-numpy-index-ufunc", [{ materialId: "pdf-numpy-basic", coverage: "添字と配列演算" }])]},
  { sessionId: 7, title: "データ解析とMatplotlib", topics: [topic("21-data-io", [{ materialId: "pdf-numpy-analysis", coverage: "データ読み込みと確認" }]), topic("22-missing-save", [{ materialId: "pdf-numpy-analysis", coverage: "データ処理と解析" }]), topic("23-matplotlib", [{ materialId: "pdf-numpy-analysis", coverage: "関連するデータ処理。Matplotlib自体はSPICAの補足" }])]},
];
