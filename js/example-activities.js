/**
 * 例題活動の正規定義。
 * ID は lesson / 表示位置から安定して生成し、練習問題の採点条件とは分離しつつ
 * 実行結果の正規化・構文条件は app.js の共通判定器を利用します。
 */
export const EXAMPLE_ACTIVITY_OVERRIDES = Object.freeze({
  "01-variables-walkthrough": {
    question: "実行すると表示される stars の値を予想してください。",
    expected: "5",
    explanation: "右辺の stars は更新前の3として読み出され、3 + 2 の結果5が同じ名前へ再代入されます。",
    hints: ["代入文は右辺を先に計算します。", "2行目の右辺の stars は3です。"],
    changeTask: "加える数を10へ変更し、出力を13にしてください。",
    changeCheck: { outputEquals: "13", required: ["stars", "="], forbidden: ["print(13)"] },
  },
  "01-variables-live-0": {
    question: "出力される値と型を「25.0, float」の形で予想してください。",
    expected: "25.0, float",
    explanation: "12.5 / 0.5 は25.0です。/ による除算結果は、この場合も float になります。表示値だけでなく型も確認します。",
    hints: ["distance_km を time_hour で割ります。", "Python の / の結果の型も考えます。"],
    changeTask: "distance_km を15.0へ変更し、速度30.0を計算してください。",
    changeCheck: { numericOutput: 30, required: ["distance_km", "time_hour", "/"], forbidden: ["print(30)", "print(30.0)"] },
  },
  "01-variables-live-1": {
    question: "実行後に表示される b の値を予想してください。",
    expected: "3",
    explanation: "b = a の時点で整数3への参照がbへ代入されます。その後aへ8を代入しても、bが参照する整数は変わりません。",
    hints: ["b = a が実行される時点のaを確認します。", "a = 8 はaという名前の参照先だけを更新します。"],
    changeTask: "bが8になるように代入の順序を変更してください。print(8)へ置き換えるだけでは達成になりません。",
    changeCheck: { outputEquals: "8", required: ["a", "b", "b = a", "a = 8"], forbidden: ["print(8)"] },
  },
});

export function exampleActivity(lesson, kind, index, source) {
  const id = `${lesson.id}-${kind}${kind === "live" ? `-${index}` : ""}`;
  const override = EXAMPLE_ACTIVITY_OVERRIDES[id] || {};
  return {
    id,
    question: override.question || source.predict || `「${source.title}」の出力・値・型を予想してください。`,
    expected: override.expected || "実行結果を解答例の処理順と照合してください。",
    explanation: override.explanation || (source.steps || []).join(" ") || source.instruction,
    hints: override.hints || ["コードを上から一行ずつ追います。", "変数の値と型、print の回数を表にしてみます。"],
    changeTask: override.changeTask || source.try || "数値または条件を1か所変え、変化を予想してから再実行してください（自由実験）。",
    changeCheck: override.changeCheck || null,
    baselineCode: source.code,
  };
}
