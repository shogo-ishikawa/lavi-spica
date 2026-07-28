export const QUIZ_DATA = {
  "meta": {
    "title": "LAVi-SPICA 20分小テスト問題バンク",
    "version": "1.0.0",
    "defaultMinutes": 20,
    "defaultCount": 10,
    "securityNote": "問題・正答は静的配信されるため、理解確認用の低〜中 stakes 小テスト向け。厳格な試験にはLMS等を使用する。"
  },
  "questions": [
    {
      "id": "s1-q01",
      "session": 1,
      "type": "single",
      "prompt": "Pythonの代入文 x = 3 + 4 で、先に行われる処理はどれですか。",
      "code": "",
      "options": [
        "xという値を計算する",
        "右辺3+4を計算する",
        "左右が等しいか比較する",
        "xを文字列へ変換する"
      ],
      "answer": 1,
      "explanation": "代入では右辺を評価し、その結果を左辺の変数名へ結び付けます。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "変数",
        "代入"
      ]
    },
    {
      "id": "s1-q02",
      "session": 1,
      "type": "single",
      "prompt": "次の出力はどれですか。",
      "code": "a = 5\na = a + 3\nprint(a)\n",
      "options": [
        "5",
        "8",
        "13",
        "NameError"
      ],
      "answer": 1,
      "explanation": "a=5の後、a+3の結果8をaへ再代入し、print(a)で8を表示します。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "変数",
        "更新"
      ]
    },
    {
      "id": "s1-q03",
      "session": 1,
      "type": "single",
      "prompt": "文字列型になる代入はどれですか。",
      "code": "",
      "options": [
        "x = 3",
        "x = 3.0",
        "x = \"3\"",
        "x = True"
      ],
      "answer": 2,
      "explanation": "引用符で囲まれた3はstrです。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "型"
      ]
    },
    {
      "id": "s1-q04",
      "session": 1,
      "type": "multi",
      "prompt": "Pythonの有効な変数名をすべて選んでください。",
      "code": "",
      "options": [
        "temperature_c",
        "2nd_value",
        "sample 1",
        "_count",
        "class"
      ],
      "answer": [
        0,
        3
      ],
      "explanation": "変数名は英字または_で始め、空白や予約語classは使えません。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "変数名"
      ]
    },
    {
      "id": "s1-q05",
      "session": 1,
      "type": "text",
      "prompt": "次のコードの出力を、空白も含めて入力してください。",
      "code": "print(2026, 7, 28, sep=\"-\")\n",
      "accepted": [
        "2026-7-28"
      ],
      "answerDisplay": "2026-7-28",
      "explanation": "sep='-'により3つの値がハイフンで区切られます。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "print"
      ]
    },
    {
      "id": "s1-q06",
      "session": 1,
      "type": "single",
      "prompt": "f-stringとして正しいものはどれですか。",
      "code": "",
      "options": [
        "print(\"{name}\")",
        "print(f\"{name}\")",
        "print(format{name})",
        "print(f(name))"
      ],
      "answer": 1,
      "explanation": "引用符の直前にfを付け、{}へ式を書きます。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "f-string"
      ]
    },
    {
      "id": "s1-q07",
      "session": 1,
      "type": "text",
      "prompt": "次のコードの出力を入力してください。",
      "code": "temperature = 23.456\nprint(f\"温度: {temperature:.2f} degC\")\n",
      "accepted": [
        "温度: 23.46 degC"
      ],
      "answerDisplay": "温度: 23.46 degC",
      "explanation": ".2fは小数点以下2桁で表示します。保存値は変わりません。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "f-string",
        "書式"
      ]
    },
    {
      "id": "s1-q08",
      "session": 1,
      "type": "single",
      "prompt": "f'{ratio:.1%}'でratio=0.875を表示した結果はどれですか。",
      "code": "",
      "options": [
        "0.9%",
        "8.8%",
        "87.5%",
        "875.0%"
      ],
      "answer": 2,
      "explanation": "%書式は100倍してパーセント記号を付けます。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "f-string",
        "書式"
      ]
    },
    {
      "id": "s1-q09",
      "session": 1,
      "type": "single",
      "prompt": "次のコードを実行したときのエラー原因はどれですか。",
      "code": "2nd_value = 3.5\nprint(2nd_value)\n",
      "expectsSyntaxError": true,
      "options": [
        "変数名を数字で始めた",
        "文字列に引用符がない",
        "printが使えない",
        "小数を代入できない"
      ],
      "answer": 0,
      "explanation": "変数名は数字から始められません。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "エラー",
        "変数名"
      ]
    },
    {
      "id": "s1-q10",
      "session": 1,
      "type": "multi",
      "prompt": "読みやすい科学計算コードの出力として望ましい情報をすべて選んでください。",
      "code": "",
      "options": [
        "値の意味",
        "単位",
        "必要な表示桁数",
        "必ず変数のメモリアドレス",
        "比較条件"
      ],
      "answer": [
        0,
        1,
        2,
        4
      ],
      "explanation": "値の意味・単位・妥当な桁数・条件は解釈と再現に役立ちます。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "出力",
        "再現性"
      ]
    },
    {
      "id": "s1-q11",
      "session": 1,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "x = 2.0\nprint(type(x))\n",
      "accepted": [
        "<class 'float'>",
        "float"
      ],
      "answerDisplay": "<class 'float'>",
      "explanation": "2.0はfloatです。UIでは完全表記または型名のみを正解として受け付けます。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "型"
      ]
    },
    {
      "id": "s1-q12",
      "session": 1,
      "type": "single",
      "prompt": "{value:.2f}について正しい説明はどれですか。",
      "code": "",
      "options": [
        "value自体を小数2桁へ永久に丸める",
        "表示だけを小数2桁にする",
        "valueを整数へ変換する",
        "小数点を2倍する"
      ],
      "answer": 1,
      "explanation": "書式指定は表示方法を変えるだけです。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "f-string",
        "精度"
      ]
    },
    {
      "id": "s2-q01",
      "session": 2,
      "type": "single",
      "prompt": "scores=[72,88,65]の最初の要素を取り出す式はどれですか。",
      "code": "",
      "options": [
        "scores[1]",
        "scores[0]",
        "scores[-0]",
        "scores.first"
      ],
      "answer": 1,
      "explanation": "Pythonのインデックスは0始まりです。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "list",
        "index"
      ]
    },
    {
      "id": "s2-q02",
      "session": 2,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "data = [10, 20, 30, 40, 50]\nprint(data[1:4])\n",
      "accepted": [
        "[20, 30, 40]"
      ],
      "answerDisplay": "[20, 30, 40]",
      "explanation": "スライス1:4は位置1,2,3を含み、4は含みません。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "list",
        "slice"
      ]
    },
    {
      "id": "s2-q03",
      "session": 2,
      "type": "single",
      "prompt": "listの末尾へ値5を追加する正しいコードはどれですか。",
      "code": "",
      "options": [
        "values.add(5)",
        "append(values,5)",
        "values.append(5)",
        "values = append(5)"
      ],
      "answer": 2,
      "explanation": "appendはlistオブジェクトのメソッドです。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "list",
        "method"
      ]
    },
    {
      "id": "s2-q04",
      "session": 2,
      "type": "single",
      "prompt": "values = values.append(3)の後でvaluesがNoneになり得る理由はどれですか。",
      "code": "",
      "options": [
        "appendはlistを変更し、戻り値はNoneだから",
        "appendは3を削除するから",
        "listへ整数を追加できないから",
        "Noneは常にlistを表すから"
      ],
      "answer": 0,
      "explanation": "appendは破壊的にlistを変更し、戻り値を返しません。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "list",
        "append"
      ]
    },
    {
      "id": "s2-q05",
      "session": 2,
      "type": "single",
      "prompt": "試料のID・質量・材質を、各値の意味を保って保存するのに最も自然な型はどれですか。",
      "code": "",
      "options": [
        "int",
        "list",
        "dict",
        "bool"
      ],
      "answer": 2,
      "explanation": "異なる意味を持つ値はキーと値のdictで表すと明確です。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "dict"
      ]
    },
    {
      "id": "s2-q06",
      "session": 2,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "sample = {\"mass_g\": 2.5}\nsample[\"mass_g\"] = 2.6\nprint(sample[\"mass_g\"])\n",
      "accepted": [
        "2.6"
      ],
      "answerDisplay": "2.6",
      "explanation": "同じキーへ再代入すると値が更新されます。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "dict",
        "update"
      ]
    },
    {
      "id": "s2-q07",
      "session": 2,
      "type": "single",
      "prompt": "存在しないキーpressureを読み、なければ'未測定'としたいときの式はどれですか。",
      "code": "",
      "options": [
        "record[\"pressure\", \"未測定\"]",
        "record.get(\"pressure\", \"未測定\")",
        "record.pressure or \"未測定\"",
        "get(record.pressure)"
      ],
      "answer": 1,
      "explanation": "dict.get(key, default)を使います。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "dict",
        "get"
      ]
    },
    {
      "id": "s2-q08",
      "session": 2,
      "type": "single",
      "prompt": "tupleについて正しい説明はどれですか。",
      "code": "",
      "options": [
        "要素を自由に追加・削除できる",
        "順序がなくキーで参照する",
        "作成後に要素を置き換えられない",
        "数値を保存できない"
      ],
      "answer": 2,
      "explanation": "tupleは順序付きですがimmutableです。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "tuple"
      ]
    },
    {
      "id": "s2-q09",
      "session": 2,
      "type": "text",
      "prompt": "1要素のtupleとして正しい表記を入力してください（値は5）。",
      "code": "",
      "accepted": [
        "(5,)",
        "5,"
      ],
      "answerDisplay": "(5,)",
      "explanation": "1要素tupleでは末尾のカンマが必要です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "tuple"
      ]
    },
    {
      "id": "s2-q10",
      "session": 2,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "point = (3, 4)\nx, y = point\nprint(x, y)\n",
      "accepted": [
        "3 4"
      ],
      "answerDisplay": "3 4",
      "explanation": "tuple (3,4)をx,yへアンパックします。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "tuple",
        "unpack"
      ]
    },
    {
      "id": "s2-q11",
      "session": 2,
      "type": "multi",
      "prompt": "メソッド呼び出しをすべて選んでください。",
      "code": "",
      "options": [
        "len(values)",
        "values.append(3)",
        "text.upper()",
        "print(text)",
        "record.get(\"x\")"
      ],
      "answer": [
        1,
        2,
        4
      ],
      "explanation": "obj.name()の形がメソッド呼び出しです。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "method"
      ]
    },
    {
      "id": "s2-q12",
      "session": 2,
      "type": "single",
      "prompt": "text.upper()について正しい説明はどれですか。",
      "code": "",
      "options": [
        "元の文字列textを必ず直接変更する",
        "大文字化した新しい文字列を返す",
        "listだけに使える",
        "結果は常にNone"
      ],
      "answer": 1,
      "explanation": "strはimmutableで、upperは新しい文字列を返します。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "str",
        "method"
      ]
    },
    {
      "id": "s3-q01",
      "session": 3,
      "type": "single",
      "prompt": "math.sqrt(9)を使う前に必要な文はどれですか。",
      "code": "",
      "options": [
        "include math",
        "using math",
        "import math",
        "load math()"
      ],
      "answer": 2,
      "explanation": "標準モジュールはimport mathで読み込みます。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "math",
        "import"
      ]
    },
    {
      "id": "s3-q02",
      "session": 3,
      "type": "text",
      "prompt": "次の出力を数値で入力してください。",
      "code": "import math\nprint(math.hypot(3, 4))\n",
      "accepted": [
        "5.0",
        "5"
      ],
      "answerDisplay": "5.0",
      "explanation": "math.hypot(3,4)はsqrt(3^2+4^2)=5です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "math"
      ]
    },
    {
      "id": "s3-q03",
      "session": 3,
      "type": "single",
      "prompt": "math.sin(30)が0.5にならない主な理由はどれですか。",
      "code": "",
      "options": [
        "sinはPythonにない",
        "30を度ではなくラジアンとして解釈する",
        "30は整数だから",
        "math.piが未定義だから"
      ],
      "answer": 1,
      "explanation": "mathの三角関数はラジアンを受け取ります。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "math",
        "radian"
      ]
    },
    {
      "id": "s3-q04",
      "session": 3,
      "type": "single",
      "prompt": "30度をラジアンへ変換する式として正しいものはどれですか。",
      "code": "",
      "options": [
        "math.radians(30)",
        "math.degrees(30)",
        "math.sin(30)",
        "30 / math.pi"
      ],
      "answer": 0,
      "explanation": "math.radiansが度からラジアンへの変換です。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "math",
        "radian"
      ]
    },
    {
      "id": "s3-q05",
      "session": 3,
      "type": "text",
      "prompt": "list(range(5))の結果を入力してください。",
      "code": "",
      "accepted": [
        "[0, 1, 2, 3, 4]"
      ],
      "answerDisplay": "[0, 1, 2, 3, 4]",
      "explanation": "range(5)は0から4までの5個です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "range"
      ]
    },
    {
      "id": "s3-q06",
      "session": 3,
      "type": "text",
      "prompt": "list(range(2, 11, 3))の結果を入力してください。",
      "code": "",
      "accepted": [
        "[2, 5, 8]"
      ],
      "answerDisplay": "[2, 5, 8]",
      "explanation": "2から3ずつ増え、stop=11は含みません。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "range"
      ]
    },
    {
      "id": "s3-q07",
      "session": 3,
      "type": "single",
      "prompt": "10,7,4,1を作るrangeはどれですか。",
      "code": "",
      "options": [
        "range(10,1,-3)",
        "range(10,0,-3)",
        "range(1,10,3)",
        "range(10,0,3)"
      ],
      "answer": 1,
      "explanation": "1を含めるにはstopを1より小さい0にします。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "range"
      ]
    },
    {
      "id": "s3-q08",
      "session": 3,
      "type": "text",
      "prompt": "次のコードは何行出力しますか。",
      "code": "for i in range(1, 5):\n    print(i)\n",
      "accepted": [
        "4",
        "4行"
      ],
      "answerDisplay": "4",
      "explanation": "range(1,5)は1,2,3,4の4要素です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "for",
        "range"
      ]
    },
    {
      "id": "s3-q09",
      "session": 3,
      "type": "text",
      "prompt": "次の出力を改行区切りで入力してください。",
      "code": "for i in range(3):\n    print(i)\nprint(\"end\")\n",
      "accepted": [
        "0\n1\n2\nend"
      ],
      "answerDisplay": "0\n1\n2\nend",
      "explanation": "ループ本体を3回実行した後、インデント外のendを1回表示します。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "for",
        "indent"
      ]
    },
    {
      "id": "s3-q10",
      "session": 3,
      "type": "single",
      "prompt": "for文の本体を表すものはどれですか。",
      "code": "",
      "options": [
        "丸括弧",
        "セミコロン",
        "コロン後のインデント",
        "変数名の大文字"
      ],
      "answer": 2,
      "explanation": "Pythonはインデントでブロックを表します。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "for",
        "indent"
      ]
    },
    {
      "id": "s3-q11",
      "session": 3,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "total = 0\nfor value in [3, 5, 7]:\n    total += value\nprint(total)\n",
      "accepted": [
        "15"
      ],
      "answerDisplay": "15",
      "explanation": "totalへ3,5,7を順に加えて15です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "for",
        "accumulator"
      ]
    },
    {
      "id": "s3-q12",
      "session": 3,
      "type": "single",
      "prompt": "合計用total=0をforの中に置くと起きやすい問題はどれですか。",
      "code": "",
      "options": [
        "毎回初期化され、それまでの合計を失う",
        "Pythonが自動で平均する",
        "rangeが無限になる",
        "listがtupleになる"
      ],
      "answer": 0,
      "explanation": "累積変数はループ前に初期化します。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "for",
        "accumulator"
      ]
    },
    {
      "id": "s4-q01",
      "session": 4,
      "type": "single",
      "prompt": "等しいか比較する演算子はどれですか。",
      "code": "",
      "options": [
        "=",
        "==",
        "=>",
        "is="
      ],
      "answer": 1,
      "explanation": "=は代入、==は等価比較です。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "comparison"
      ]
    },
    {
      "id": "s4-q02",
      "session": 4,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "x = 5\nprint(0 <= x < 10)\n",
      "accepted": [
        "True"
      ],
      "answerDisplay": "True",
      "explanation": "5は0以上10未満です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "comparison",
        "bool"
      ]
    },
    {
      "id": "s4-q03",
      "session": 4,
      "type": "single",
      "prompt": "『scoreは60以上』を表す式はどれですか。",
      "code": "",
      "options": [
        "score > 60",
        "score >= 60",
        "score = 60",
        "score => 60"
      ],
      "answer": 1,
      "explanation": "以上は境界を含む>=です。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "comparison",
        "boundary"
      ]
    },
    {
      "id": "s4-q04",
      "session": 4,
      "type": "single",
      "prompt": "A and BがTrueになるのはどの場合ですか。",
      "code": "",
      "options": [
        "AだけTrue",
        "BだけTrue",
        "AとBの両方がTrue",
        "少なくとも一方がTrue"
      ],
      "answer": 2,
      "explanation": "andは両方がTrueの場合のみTrueです。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "logic"
      ]
    },
    {
      "id": "s4-q05",
      "session": 4,
      "type": "single",
      "prompt": "dayが'sat'または'sun'かを調べる正しい式はどれですか。",
      "code": "",
      "options": [
        "day == 'sat' or 'sun'",
        "day == ('sat' or 'sun')",
        "(day == 'sat') or (day == 'sun')",
        "day = 'sat' or day = 'sun'"
      ],
      "answer": 2,
      "explanation": "比較式をそれぞれ書いてorで結びます。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "logic"
      ]
    },
    {
      "id": "s4-q06",
      "session": 4,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "temperature = 18\nif temperature < 15:\n    label = \"low\"\nelif temperature <= 25:\n    label = \"normal\"\nelse:\n    label = \"high\"\nprint(label)\n",
      "accepted": [
        "normal"
      ],
      "answerDisplay": "normal",
      "explanation": "18は15未満ではなく25以下なのでelifのnormalです。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "if",
        "elif"
      ]
    },
    {
      "id": "s4-q07",
      "session": 4,
      "type": "single",
      "prompt": "if/elif/elseについて正しい説明はどれですか。",
      "code": "",
      "options": [
        "Trueの枝をすべて実行する",
        "上から評価し最初にTrueの枝だけ実行する",
        "elseを最初に評価する",
        "条件は数値しか使えない"
      ],
      "answer": 1,
      "explanation": "一連のif/elif/elseでは最初にTrueとなった1枝だけです。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "if"
      ]
    },
    {
      "id": "s4-q08",
      "session": 4,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "score = 95\nif score >= 60:\n    result = \"pass\"\nelif score >= 90:\n    result = \"excellent\"\nprint(result)\n",
      "accepted": [
        "pass"
      ],
      "answerDisplay": "pass",
      "explanation": "score>=60が先にTrueとなり、その後のelifは評価されません。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "if",
        "order"
      ]
    },
    {
      "id": "s4-q09",
      "session": 4,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "for n in range(1, 7):\n    if n % 2 == 0:\n        print(n)\n",
      "accepted": [
        "2\n4\n6"
      ],
      "answerDisplay": "2\n4\n6",
      "explanation": "1〜6のうちn%2==0の偶数だけ表示します。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "for-if",
        "modulo"
      ]
    },
    {
      "id": "s4-q10",
      "session": 4,
      "type": "single",
      "prompt": "n % 5 == 0が表す条件はどれですか。",
      "code": "",
      "options": [
        "nが5より大きい",
        "nが5の倍数",
        "nが5である",
        "nを5倍する"
      ],
      "answer": 1,
      "explanation": "%は割り算の余りです。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "modulo"
      ]
    },
    {
      "id": "s4-q11",
      "session": 4,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "scores = [42, 60, 73, 58, 91]\ncount = 0\nfor score in scores:\n    if score >= 60:\n        count += 1\nprint(count)\n",
      "accepted": [
        "3"
      ],
      "answerDisplay": "3",
      "explanation": "60,73,91の3個が60以上です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "for-if",
        "count"
      ]
    },
    {
      "id": "s4-q12",
      "session": 4,
      "type": "multi",
      "prompt": "条件分岐の境界値テストとして有効な入力をすべて選んでください。条件はscore >= 60です。",
      "code": "",
      "options": [
        "59",
        "60",
        "61",
        "1000だけ",
        "文字列だけ"
      ],
      "answer": [
        0,
        1,
        2
      ],
      "explanation": "境界直前・境界・境界直後を試すと<と<=の誤りを見つけやすくなります。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "test",
        "boundary"
      ]
    },
    {
      "id": "s5-q01",
      "session": 5,
      "type": "single",
      "prompt": "関数を定義するキーワードはどれですか。",
      "code": "",
      "options": [
        "func",
        "define",
        "def",
        "function"
      ],
      "answer": 2,
      "explanation": "Pythonではdefを使います。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "def"
      ]
    },
    {
      "id": "s5-q02",
      "session": 5,
      "type": "single",
      "prompt": "次のコードでxは何と呼ばれますか。",
      "code": "def square(x):\n    return x ** 2\n",
      "options": [
        "実引数",
        "仮引数",
        "戻り値",
        "module"
      ],
      "answer": 1,
      "explanation": "関数定義側の名前xは仮引数（parameter）です。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "parameter"
      ]
    },
    {
      "id": "s5-q03",
      "session": 5,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "def square(x):\n    return x ** 2\n\nprint(square(5))\n",
      "accepted": [
        "25"
      ],
      "answerDisplay": "25",
      "explanation": "square(5)は5**2をreturnします。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "def",
        "return"
      ]
    },
    {
      "id": "s5-q04",
      "session": 5,
      "type": "single",
      "prompt": "printとreturnの違いとして正しいものはどれですか。",
      "code": "",
      "options": [
        "両方とも必ず関数を終了する",
        "printは表示、returnは呼び出し元へ値を返す",
        "returnは画面表示専用",
        "printは値を必ず返す"
      ],
      "answer": 1,
      "explanation": "returnされた値は代入や後続計算に使えます。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "return"
      ]
    },
    {
      "id": "s5-q05",
      "session": 5,
      "type": "text",
      "prompt": "returnを書かない関数の戻り値を入力してください。",
      "code": "def show(x):\n    print(x)\n\nresult = show(3)\nprint(result)\n",
      "accepted": [
        "None"
      ],
      "answerDisplay": "None",
      "explanation": "明示的なreturnがない関数はNoneを返します。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "return"
      ]
    },
    {
      "id": "s5-q06",
      "session": 5,
      "type": "single",
      "prompt": "次のエラーの最も直接的な原因はどれですか。",
      "code": "distance_km = 25.0\ntime_hour = 2.0\nspeed = distance_km / time_hours\n",
      "options": [
        "time_hourとtime_hoursの綴りが違う",
        "割り算が禁止されている",
        "floatをprintできない",
        "distance_kmが長すぎる"
      ],
      "answer": 0,
      "explanation": "定義した変数名と使用した変数名が一致していません。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "NameError",
        "debug"
      ]
    },
    {
      "id": "s5-q07",
      "session": 5,
      "type": "single",
      "prompt": "Tracebackを読むとき、まず重視すべき組合せはどれですか。",
      "code": "",
      "options": [
        "背景色とフォント",
        "最後の例外名・説明と自分のコードの行番号",
        "Pythonのロゴと時刻",
        "すべての内部ライブラリ行"
      ],
      "answer": 1,
      "explanation": "最後の例外情報と、自分が書いた行を起点にします。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "debug",
        "traceback"
      ]
    },
    {
      "id": "s5-q08",
      "session": 5,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "def add(a, b=2):\n    return a + b\n\nprint(add(5))\n",
      "accepted": [
        "7"
      ],
      "answerDisplay": "7",
      "explanation": "既定値b=2が使われ、5+2=7です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "default argument"
      ]
    },
    {
      "id": "s5-q09",
      "session": 5,
      "type": "single",
      "prompt": "小さな入力で関数をテストする主な利点はどれですか。",
      "code": "",
      "options": [
        "コードを長くできる",
        "手計算の期待値と比較し原因を絞れる",
        "エラーを隠せる",
        "常に高速化できる"
      ],
      "answer": 1,
      "explanation": "期待値が明確な小問題は正しさの検証に有効です。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "test"
      ]
    },
    {
      "id": "s5-q10",
      "session": 5,
      "type": "text",
      "prompt": "次のコードのバグを直すと出力はいくつですか。",
      "code": "def average(values):\n    total = 0\n    for value in values:\n        total += value\n    return total / len(value)\n\nprint(average([2, 4, 6]))\n",
      "accepted": [
        "4.0",
        "4"
      ],
      "answerDisplay": "4.0",
      "explanation": "len(value)ではなくlen(values)で3要素を割り、12/3=4です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "debug",
        "function"
      ]
    },
    {
      "id": "s5-q11",
      "session": 5,
      "type": "multi",
      "prompt": "関数へ分割する利点をすべて選んでください。",
      "code": "",
      "options": [
        "再利用しやすい",
        "個別にテストしやすい",
        "必ず計算量が0になる",
        "処理の役割が読みやすい",
        "修正範囲を限定しやすい"
      ],
      "answer": [
        0,
        1,
        3,
        4
      ],
      "explanation": "関数分割は再利用・検証・可読性・保守性を高めます。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "design"
      ]
    },
    {
      "id": "s5-q12",
      "session": 5,
      "type": "single",
      "prompt": "公平な3条件比較で最も適切なのはどれですか。",
      "code": "",
      "options": [
        "入力データ・関数・しきい値を全部変える",
        "入力と関数を固定し、しきい値だけ変える",
        "毎回異なるコードをAIへ作らせる",
        "結果がよい条件だけ記録する"
      ],
      "answer": 1,
      "explanation": "原因を特定するため一度に一条件だけ変えます。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "comparison",
        "reproducibility"
      ]
    },
    {
      "id": "s6-q01",
      "session": 6,
      "type": "single",
      "prompt": "Pythonの変数を概念的に説明したものとして最も適切なのはどれですか。",
      "code": "",
      "options": [
        "常に固定型の物理箱",
        "オブジェクトを参照する名前",
        "画面へ出す文字だけ",
        "CPUそのもの"
      ],
      "answer": 1,
      "explanation": "Pythonでは変数名とオブジェクトの参照関係として捉えると理解しやすくなります。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "object",
        "reference"
      ]
    },
    {
      "id": "s6-q02",
      "session": 6,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "a = [1, 2]\nb = a\nb.append(3)\nprint(a)\n",
      "accepted": [
        "[1, 2, 3]"
      ],
      "answerDisplay": "[1, 2, 3]",
      "explanation": "aとbが同じlistを参照するため、bからのappendがaにも見えます。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "reference",
        "mutable"
      ]
    },
    {
      "id": "s6-q03",
      "session": 6,
      "type": "single",
      "prompt": "bを変更してもaを変えたくないときの代入はどれですか。",
      "code": "",
      "options": [
        "b = a",
        "b = a.copy()",
        "b is a",
        "b.append(a)"
      ],
      "answer": 1,
      "explanation": "浅い独立コピーにはcopy()を使います。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "copy"
      ]
    },
    {
      "id": "s6-q04",
      "session": 6,
      "type": "single",
      "prompt": "classとinstanceの関係として正しいものはどれですか。",
      "code": "",
      "options": [
        "classが個体、instanceが設計図",
        "classが設計図、instanceがそこから作られた個体",
        "両者は必ず整数",
        "instanceはimport文"
      ],
      "answer": 1,
      "explanation": "classは共通設計、instanceは固有状態を持つ個体です。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "class",
        "instance"
      ]
    },
    {
      "id": "s6-q05",
      "session": 6,
      "type": "single",
      "prompt": "instance methodの第1引数selfが指すものはどれですか。",
      "code": "",
      "options": [
        "Python全体",
        "呼び出し対象のinstance",
        "常に整数0",
        "親classだけ"
      ],
      "answer": 1,
      "explanation": "obj.method()ではobjがselfへ渡されます。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "self",
        "method"
      ]
    },
    {
      "id": "s6-q06",
      "session": 6,
      "type": "single",
      "prompt": "NumPyの慣例的なimport文はどれですか。",
      "code": "",
      "options": [
        "import numpy as np",
        "import np as numpy",
        "using numpy",
        "from math import numpy"
      ],
      "answer": 0,
      "explanation": "通常import numpy as npとします。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "numpy",
        "import"
      ]
    },
    {
      "id": "s6-q07",
      "session": 6,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "print([1, 2, 3] * 2)\n",
      "accepted": [
        "[1, 2, 3, 1, 2, 3]"
      ],
      "answerDisplay": "[1, 2, 3, 1, 2, 3]",
      "explanation": "Python listの*2は要素の反復・連結です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "list",
        "numpy comparison"
      ]
    },
    {
      "id": "s6-q08",
      "session": 6,
      "type": "text",
      "prompt": "次の出力を入力してください。空白の違いは問いません。",
      "code": "import numpy as np\nprint(np.array([1, 2, 3]) * 2)\n",
      "accepted": [
        "[2 4 6]",
        "[2, 4, 6]"
      ],
      "answerDisplay": "[2 4 6]",
      "explanation": "NumPy配列への*2は全要素の数値乗算です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "numpy",
        "vectorization"
      ]
    },
    {
      "id": "s6-q09",
      "session": 6,
      "type": "single",
      "prompt": "np.linspace(0,1,5)について正しい説明はどれですか。",
      "code": "",
      "options": [
        "0を含まず1を含む4点",
        "0と1を含む5点",
        "0から5まで1刻み",
        "整数だけを返す"
      ],
      "answer": 1,
      "explanation": "linspaceは通常、両端を含む指定点数を返します。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "linspace"
      ]
    },
    {
      "id": "s6-q10",
      "session": 6,
      "type": "text",
      "prompt": "2行3列のNumPy配列のshapeをPython表記で入力してください。",
      "code": "",
      "accepted": [
        "(2, 3)"
      ],
      "answerDisplay": "(2, 3)",
      "explanation": "shapeは各軸の長さをtupleで表します。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "shape"
      ]
    },
    {
      "id": "s6-q11",
      "session": 6,
      "type": "single",
      "prompt": "NumPy配列theta全体のsinを計算する適切な関数はどれですか。",
      "code": "",
      "options": [
        "math.sin(theta)",
        "np.sin(theta)",
        "theta.sin.math()",
        "sin = theta"
      ],
      "answer": 1,
      "explanation": "配列にはNumPyのufuncを使います。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "ufunc",
        "numpy"
      ]
    },
    {
      "id": "s6-q12",
      "session": 6,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "import numpy as np\ndata = np.array([-1, 0, 1, 2])\nprint(data[data > 0])\n",
      "accepted": [
        "[1 2]",
        "[1, 2]"
      ],
      "answerDisplay": "[1 2]",
      "explanation": "正の要素だけがブールインデックスで抽出されます。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "boolean indexing"
      ]
    },
    {
      "id": "s7-q01",
      "session": 7,
      "type": "multi",
      "prompt": "データ読み込み直後に確認する『三点セット』をすべて選んでください。",
      "code": "",
      "options": [
        "data.shape",
        "data.dtype",
        "data[:5]",
        "画面の壁紙",
        "CPUの製造番号"
      ],
      "answer": [
        0,
        1,
        2
      ],
      "explanation": "形状・型・先頭を確認して読み込みの想定違いを早期発見します。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "data inspection"
      ]
    },
    {
      "id": "s7-q02",
      "session": 7,
      "type": "single",
      "prompt": "data[:,0]が表すものはどれですか。",
      "code": "",
      "options": [
        "0行目の全列",
        "全行の0列目",
        "全要素を0へする",
        "0列目を削除する"
      ],
      "answer": 1,
      "explanation": "カンマ前が行、後が列です。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "slice",
        "2d array"
      ]
    },
    {
      "id": "s7-q03",
      "session": 7,
      "type": "text",
      "prompt": "shapeが(12,3)のdataに対しdata[:,1].shapeを入力してください。",
      "code": "",
      "accepted": [
        "(12,)"
      ],
      "answerDisplay": "(12,)",
      "explanation": "1列を取り出すと12要素の1次元配列です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "shape",
        "slice"
      ]
    },
    {
      "id": "s7-q04",
      "session": 7,
      "type": "single",
      "prompt": "欠損を含む可能性がある数値CSVを読むのに便利な関数はどれですか。",
      "code": "",
      "options": [
        "np.genfromtxt",
        "math.load",
        "plt.read",
        "dict.open"
      ],
      "answer": 0,
      "explanation": "genfromtxtは欠損値を含む表へ対応しやすい関数です。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "genfromtxt",
        "NaN"
      ]
    },
    {
      "id": "s7-q05",
      "session": 7,
      "type": "single",
      "prompt": "NaNを含む配列の有限値だけを抽出する条件として適切なのはどれですか。",
      "code": "",
      "options": [
        "data == np.nan",
        "np.isfinite(data)",
        "data is not None",
        "len(data)>0"
      ],
      "answer": 1,
      "explanation": "np.isfiniteはNaNとinfを除くmaskを返します。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "NaN",
        "isfinite"
      ]
    },
    {
      "id": "s7-q06",
      "session": 7,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "import numpy as np\ndata = np.array([1.0, np.nan, 3.0])\nprint(np.nanmean(data))\n",
      "accepted": [
        "2.0",
        "2"
      ],
      "answerDisplay": "2.0",
      "explanation": "nanmeanはNaNを除外して1と3の平均2を求めます。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "NaN",
        "nanmean"
      ]
    },
    {
      "id": "s7-q07",
      "session": 7,
      "type": "single",
      "prompt": "xで並べ替えた順序をyにも適用したいときに使う関数はどれですか。",
      "code": "",
      "options": [
        "np.sort(x)だけ",
        "np.argsort(x)",
        "np.mean(x)",
        "np.where(y)"
      ],
      "answer": 1,
      "explanation": "argsortのインデックスをx[order]とy[order]の両方へ適用します。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "argsort"
      ]
    },
    {
      "id": "s7-q08",
      "session": 7,
      "type": "single",
      "prompt": "時間に沿った連続変化を表示する基本的な図はどれですか。",
      "code": "",
      "options": [
        "hist",
        "plot",
        "pieだけ",
        "tableのみ"
      ],
      "answer": 1,
      "explanation": "順序に意味がある連続変化には折れ線plotが基本です。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "matplotlib",
        "plot"
      ]
    },
    {
      "id": "s7-q09",
      "session": 7,
      "type": "single",
      "prompt": "2変数temperatureとresponseの関係を見る基本的な図はどれですか。",
      "code": "",
      "options": [
        "scatter",
        "hist",
        "barで1本だけ",
        "画像なし"
      ],
      "answer": 0,
      "explanation": "散布図は2変数の組を点として表示します。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "matplotlib",
        "scatter"
      ]
    },
    {
      "id": "s7-q10",
      "session": 7,
      "type": "single",
      "prompt": "1変数valuesの分布を見る基本的な図はどれですか。",
      "code": "",
      "options": [
        "hist",
        "scatter",
        "plotで必ず線を結ぶ",
        "text"
      ],
      "answer": 0,
      "explanation": "ヒストグラムは値の頻度分布を表します。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "matplotlib",
        "hist"
      ]
    },
    {
      "id": "s7-q11",
      "session": 7,
      "type": "multi",
      "prompt": "第三者へ示す科学図として通常必要な要素をすべて選んでください。",
      "code": "",
      "options": [
        "x軸の量名と単位",
        "y軸の量名と単位",
        "必要なら凡例",
        "意味のあるタイトルまたはキャプション",
        "意図的にデータを隠す軸範囲"
      ],
      "answer": [
        0,
        1,
        2,
        3
      ],
      "explanation": "図の量・単位・系列・文脈を明示します。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "visualization",
        "labels"
      ]
    },
    {
      "id": "s7-q12",
      "session": 7,
      "type": "single",
      "prompt": "平均や相関係数だけでなく元データを可視化する理由として最も適切なのはどれですか。",
      "code": "",
      "options": [
        "図は必ず数値より正しいから",
        "外れ値・非線形・群構造など単一統計量が隠す形を確認するため",
        "色を増やすためだけ",
        "計算を不要にするため"
      ],
      "answer": 1,
      "explanation": "要約統計量だけではデータ構造を見落とすことがあります。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "visualization",
        "interpretation"
      ]
    },
    {
      "id": "s1-q13",
      "session": 1,
      "type": "single",
      "prompt": "次のコードの出力はどれですか。",
      "code": "x = \"3\"\nprint(x * 2)\n",
      "options": [
        "6",
        "33",
        "9",
        "TypeError"
      ],
      "answer": 1,
      "explanation": "文字列'3'を2回反復するので'33'です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "str",
        "type"
      ]
    },
    {
      "id": "s1-q14",
      "session": 1,
      "type": "single",
      "prompt": "次の式の型はどれですか。",
      "code": "result = 5 / 2\n",
      "options": [
        "int",
        "float",
        "str",
        "bool"
      ],
      "answer": 1,
      "explanation": "整数同士でも/はfloatを返します。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "type",
        "division"
      ]
    },
    {
      "id": "s2-q13",
      "session": 2,
      "type": "single",
      "prompt": "data[-1]が表すものはどれですか。",
      "code": "",
      "options": [
        "先頭要素",
        "最後の要素",
        "存在しない要素",
        "要素数"
      ],
      "answer": 1,
      "explanation": "負のインデックス-1は末尾です。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "list",
        "index"
      ]
    },
    {
      "id": "s2-q14",
      "session": 2,
      "type": "single",
      "prompt": "dir(obj)の主な用途はどれですか。",
      "code": "",
      "options": [
        "オブジェクトを削除する",
        "属性やメソッド名を調べる",
        "数値を2倍する",
        "ファイルを圧縮する"
      ],
      "answer": 1,
      "explanation": "dirは利用可能な属性名を列挙します。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "object",
        "dir"
      ]
    },
    {
      "id": "s3-q13",
      "session": 3,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "for i in range(1, 4):\n    print(i ** 2)\n",
      "accepted": [
        "1\n4\n9"
      ],
      "answerDisplay": "1\n4\n9",
      "explanation": "i=1,2,3の平方を順に表示します。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "for"
      ]
    },
    {
      "id": "s3-q14",
      "session": 3,
      "type": "single",
      "prompt": "enumerate(scores)を使う主な理由はどれですか。",
      "code": "",
      "options": [
        "値と位置を同時に得る",
        "値を削除する",
        "すべてを文字列にする",
        "forを無限にする"
      ],
      "answer": 0,
      "explanation": "enumerateは(index, value)を返します。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "for",
        "enumerate"
      ]
    },
    {
      "id": "s4-q13",
      "session": 4,
      "type": "single",
      "prompt": "NumPyではなく通常のbool式でnot Trueの結果はどれですか。",
      "code": "",
      "options": [
        "True",
        "False",
        "None",
        "1"
      ],
      "answer": 1,
      "explanation": "notは真偽を反転します。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "logic"
      ]
    },
    {
      "id": "s4-q14",
      "session": 4,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "values = [1, 2, 3, 4]\nselected = []\nfor value in values:\n    if value > 2:\n        selected.append(value)\nprint(selected)\n",
      "accepted": [
        "[3, 4]"
      ],
      "answerDisplay": "[3, 4]",
      "explanation": "2より大きい3と4だけを新listへ追加します。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "for-if",
        "filter"
      ]
    },
    {
      "id": "s5-q13",
      "session": 5,
      "type": "single",
      "prompt": "return文の後に同じ関数内で書かれた通常の文はどうなりますか。",
      "code": "",
      "options": [
        "必ず実行される",
        "その呼び出しでは実行されない",
        "2回実行される",
        "classになる"
      ],
      "answer": 1,
      "explanation": "returnで関数から直ちに抜けます。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "return"
      ]
    },
    {
      "id": "s5-q14",
      "session": 5,
      "type": "text",
      "prompt": "次の出力を入力してください。",
      "code": "def square(x):\n    return x ** 2\nprint(square(2) + square(3))\n",
      "accepted": [
        "13"
      ],
      "answerDisplay": "13",
      "explanation": "square(2)=4とsquare(3)=9の合計です。",
      "points": 1,
      "difficulty": "標準",
      "tags": [
        "function"
      ]
    },
    {
      "id": "s6-q13",
      "session": 6,
      "type": "single",
      "prompt": "np.arange(0,5,2)の結果はどれですか。",
      "code": "",
      "options": [
        "[0,1,2,3,4]",
        "[0,2,4]",
        "[2,4,6]",
        "[0,2,4,5]"
      ],
      "answer": 1,
      "explanation": "stop=5は含まず0,2,4です。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "numpy",
        "arange"
      ]
    },
    {
      "id": "s6-q14",
      "session": 6,
      "type": "single",
      "prompt": "NumPy配列の全要素の平均を求める代表的な式はどれですか。",
      "code": "",
      "options": [
        "np.mean(data)",
        "data.append(mean)",
        "math.list(data)",
        "data == mean"
      ],
      "answer": 0,
      "explanation": "np.meanまたはdata.mean()を使います。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "numpy",
        "aggregation"
      ]
    },
    {
      "id": "s7-q13",
      "session": 7,
      "type": "single",
      "prompt": "fig.tight_layout()の主な目的はどれですか。",
      "code": "",
      "options": [
        "配列をソートする",
        "ラベルやsubplotの重なりを調整する",
        "CSVを読む",
        "NaNを0にする"
      ],
      "answer": 1,
      "explanation": "図の配置を自動調整します。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "matplotlib",
        "subplots"
      ]
    },
    {
      "id": "s7-q14",
      "session": 7,
      "type": "single",
      "prompt": "NumPy配列をdtype・shape・精度を保って1個保存する形式はどれですか。",
      "code": "",
      "options": [
        ".npy",
        ".jpg",
        ".htmlだけ",
        ".pycだけ"
      ],
      "answer": 0,
      "explanation": "np.save/np.loadでnpy形式を扱います。",
      "points": 1,
      "difficulty": "基礎",
      "tags": [
        "save",
        "npy"
      ]
    }
  ]
};
