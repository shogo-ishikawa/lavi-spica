export const COURSE_CONTENT = {
  "meta": {
    "title": "LAVi-SPICA",
    "subtitle": "Structured Python Interactive Course and Activities",
    "tagline": "変数から可視化まで、書いて試せるPython基礎学習",
    "version": "1.4.0",
    "audience": "プログラミングを初めて学ぶ大学生",
    "pyodide": "314.0.3"
  },
  "sessions": [
    {
      "id": 1,
      "title": "変数・print・f-string",
      "subtitle": "値に名前を付け、計算結果を読み手へ伝える",
      "scope": [
        "変数",
        "代入",
        "型",
        "四則演算",
        "print",
        "f-string",
        "コメント"
      ]
    },
    {
      "id": 2,
      "title": "list・dict・tupleとメソッド",
      "subtitle": "複数のデータを、目的に合う構造へまとめる",
      "scope": [
        "list",
        "index",
        "slice",
        "append",
        "dict",
        "key",
        "tuple",
        "len",
        "method"
      ]
    },
    {
      "id": 3,
      "title": "math・range・for",
      "subtitle": "数式と反復を使い、手作業を計算へ置き換える",
      "scope": [
        "import",
        "math",
        "pi",
        "sqrt",
        "sin",
        "radians",
        "range",
        "for",
        "indent"
      ]
    },
    {
      "id": 4,
      "title": "if・比較・論理演算",
      "subtitle": "条件によって処理を選び、データを分類する",
      "scope": [
        "comparison",
        "bool",
        "if",
        "elif",
        "else",
        "and",
        "or",
        "not",
        "modulo",
        "for-if"
      ]
    },
    {
      "id": 5,
      "title": "def・return・デバッグ",
      "subtitle": "処理へ名前を付け、再利用と検証をしやすくする",
      "scope": [
        "def",
        "parameter",
        "argument",
        "return",
        "local variable",
        "call",
        "traceback",
        "debug"
      ]
    },
    {
      "id": 6,
      "title": "オブジェクトとNumPy基礎",
      "subtitle": "Pythonのデータ観と、科学計算用配列へ進む",
      "scope": [
        "object",
        "reference",
        "type",
        "attribute",
        "method",
        "class",
        "NumPy",
        "ndarray",
        "vectorization"
      ]
    },
    {
      "id": 7,
      "title": "データ解析とMatplotlib",
      "subtitle": "読み込み、確認、欠損処理、可視化までを一続きにする",
      "scope": [
        "loadtxt",
        "genfromtxt",
        "shape",
        "dtype",
        "slice",
        "NaN",
        "save",
        "plot",
        "scatter",
        "hist",
        "label"
      ]
    }
  ],
  "lessons": [
    {
      "id": "01-variables",
      "session": 1,
      "order": 1,
      "track": "core",
      "minutes": 18,
      "title": "変数：値に意味のある名前を付ける",
      "subtitle": "代入は「右辺を計算し、その結果を左辺の名前で参照する」操作",
      "keywords": [
        "変数",
        "代入",
        "int",
        "float",
        "str",
        "bool",
        "type"
      ],
      "objectives": [
        "=の右辺が先に評価されることを説明する",
        "int・float・str・boolを変数へ代入する",
        "意味の伝わるsnake_caseの変数名を付ける",
        "type()で型を確かめる"
      ],
      "concepts": [
        {
          "title": "変数はデータの意味を伝える名前",
          "body": "数値を何度も直接書くより、temperature_cやparticle_countのような名前を付けると、値の役割と変更箇所が明確になります。Pythonの=は数学の等号ではなく代入です。右辺を先に計算し、その結果を左辺の変数名から参照できるようにします。",
          "code": "distance_km = 12.5\ntime_hour = 0.5\nspeed_kmh = distance_km / time_hour\n"
        },
        {
          "title": "代表的な型",
          "body": "整数はint、小数はfloat、文字列はstr、真偽値はboolです。型は値に備わっており、type()で確認できます。文字列は引用符で囲み、TrueとFalseの先頭は大文字です。",
          "code": "count = 12\ntemperature = 23.5\ndepartment = \"機械工学科\"\nis_valid = True\nprint(type(count), type(temperature), type(department), type(is_valid))\n"
        },
        {
          "title": "変数名の規則",
          "body": "英字または_で始め、英数字と_を使います。予約語は使えません。日本語名も文法上は可能ですが、授業では英語のsnake_caseを基本にします。aやxが常に悪いわけではありませんが、意味が長く保たれる値には説明的な名前を使います。",
          "code": ""
        }
      ],
      "liveCoding": [
        {
          "title": "距離・時間・速度",
          "instruction": "3つの変数を一緒に入力し、右辺を変更して結果を確認します。",
          "code": "distance_km = 12.5\ntime_hour = 0.5\nspeed_kmh = distance_km / time_hour\nprint(speed_kmh)\n",
          "predict": "出力される数値と型を予想してください。"
        },
        {
          "title": "値を更新する",
          "instruction": "同じ変数名へ新しい計算結果を代入します。",
          "code": "score = 70\nscore = score + 5\nprint(score)\n",
          "predict": "2行目の右辺と左辺は、どの順番で処理されるでしょうか。"
        }
      ],
      "starterCode": "# 距離と時間から平均速度を計算します\ndistance_km = 18.0\ntime_hour = 0.75\n\n# ここに speed_kmh の計算を書きます\n\nprint(speed_kmh)\n",
      "predictPrompt": "distance_kmを2倍にし、time_hourを同じにするとspeed_kmhはどう変わりますか。",
      "practices": [
        {
          "id": "01-p1",
          "title": "宇宙船の窓の面積",
          "prompt": "幅 w=3.2、高さ h=1.5 の長方形について、area を計算して表示しましょう。",
          "starterCode": "w = 3.2\nh = 1.5\n# areaを計算\n",
          "hints": [
            "面積は「幅 × 高さ」です。",
            "area = w * h の後にprint()を使います。"
          ],
          "solution": "w = 3.2\nh = 1.5\narea = w * h\nprint(area)\n",
          "check": {
            "numericOutput": 4.8,
            "tolerance": 1e-12,
            "required": [
              "area",
              "print"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "01-p2",
          "title": "4種類の値を観察",
          "prompt": "n、mass、metal、ok の型を、上から順に type() で表示しましょう。",
          "starterCode": "n = 12\nmass = 2.5\nmetal = \"Al\"\nok = True\n",
          "hints": [
            "type(n)のように、値ではなく変数をtype()へ渡します。",
            "4行のprint()に分けると確認しやすくなります。"
          ],
          "solution": "n = 12\nmass = 2.5\nmetal = \"Al\"\nok = True\nprint(type(n))\nprint(type(mass))\nprint(type(metal))\nprint(type(ok))\n",
          "check": {
            "outputContains": [
              "int",
              "float",
              "str",
              "bool"
            ],
            "required": [
              "type"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "数学の=とPythonの=は、どこが違いますか。",
          "model": "Pythonの=は、右辺を計算した結果を左辺の変数名から参照できるようにする代入である。"
        },
        {
          "question": "変数名をdata1ではなくtemperature_cとする利点を説明してください。",
          "model": "値の意味と単位が伝わり、変更や誤りの確認がしやすくなる。"
        },
        {
          "question": "整数3と文字列\"3\"の違いを、可能な演算に触れて説明してください。",
          "model": "整数3は数値演算に使え、文字列\"3\"は文字の並びとして連結などに使われる。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "NameError",
          "cause": "代入前の変数名、または綴りの違う名前を使った",
          "fix": "エラー行より上の代入と、大文字・小文字・_を確認する"
        },
        {
          "symptom": "SyntaxError: invalid decimal literal",
          "cause": "変数名を数字から始めた",
          "fix": "sample_1のように英字または_から始める"
        }
      ]
    },
    {
      "id": "02-print",
      "session": 1,
      "order": 2,
      "track": "core",
      "minutes": 15,
      "title": "print：計算結果を観察可能にする",
      "subtitle": "値だけでなく、意味・単位・途中経過も出力する",
      "keywords": [
        "print",
        "argument",
        "sep",
        "end",
        "comment"
      ],
      "objectives": [
        "print()へ複数の値を渡す",
        "sepとendの働きを試す",
        "途中の変数を表示して処理を確認する",
        "コメントと実行されるコードを区別する"
      ],
      "concepts": [
        {
          "title": "print()は観察の道具",
          "body": "プログラムが計算しただけでは、人間には結果が見えません。print()で最終結果だけでなく、途中の値も観察すると、誤りの位置を絞れます。",
          "code": "x = 5\ny = x ** 2\nprint(\"x =\", x)\nprint(\"y =\", y)\n"
        },
        {
          "title": "複数の引数と区切り",
          "body": "print(a, b)は複数の値を空白で区切ります。sepで区切り、endで末尾を変更できます。初学段階では技巧より、何を出したか分かる説明を添えることが重要です。",
          "code": "print(2026, 7, 28, sep=\"-\")\nprint(\"計算中\", end=\" ... \")\nprint(\"完了\")\n"
        },
        {
          "title": "コメント",
          "body": "#より右は実行されない説明です。コードを一時的に無効化する目的だけでなく、変数の意味・単位・仮定を残すために使います。コードをそのまま日本語へ訳すだけのコメントは増やしすぎません。",
          "code": ""
        }
      ],
      "liveCoding": [
        {
          "title": "単位を添える",
          "instruction": "値だけを表示した場合と、説明を添えた場合を比較します。",
          "code": "mass_kg = 2.4\nprint(mass_kg)\nprint(\"質量 [kg]:\", mass_kg)\n",
          "predict": "第三者が見て意味を判断できるのはどちらですか。"
        },
        {
          "title": "途中経過を追う",
          "instruction": "更新の前後をprintで確認します。",
          "code": "energy = 100\nprint(\"初期:\", energy)\nenergy = energy * 0.8\nprint(\"更新後:\", energy)\n",
          "predict": "更新後の値を予想してください。"
        }
      ],
      "starterCode": "radius_m = 2.0\npi_approx = 3.14\narea_m2 = pi_approx * radius_m ** 2\n\n# 説明と単位を付けて表示してください\n",
      "predictPrompt": "print(1, 2, 3, sep=':')の出力を、実行前に書いてください。",
      "practices": [
        {
          "id": "02-p1",
          "title": "星の観測メモを1行で表示",
          "prompt": "id、temp、ok を、意味が分かるラベルと一緒に1行で表示しましょう。",
          "starterCode": "id = 7\ntemp = 24.8\nok = True\n",
          "hints": [
            "print()には文字列と変数をカンマで並べられます。",
            "例：print(\"ID:\", id, ...)。"
          ],
          "solution": "id = 7\ntemp = 24.8\nok = True\nprint(\"ID:\", id, \"温度:\", temp, \"有効:\", ok)\n",
          "check": {
            "outputContains": [
              "7",
              "24.8",
              "True"
            ],
            "required": [
              "print"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "02-p2",
          "title": "日付をすっきり表示",
          "prompt": "y、m、d を 2026/7/28 の形で表示しましょう。sep=\"/\" を使います。",
          "starterCode": "y = 2026\nm = 7\nd = 28\n",
          "hints": [
            "print(y, m, d, sep=\"/\") の形を使えます。"
          ],
          "solution": "y = 2026\nm = 7\nd = 28\nprint(y, m, d, sep=\"/\")\n",
          "check": {
            "outputEquals": "2026/7/28",
            "required": [
              "sep"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "計算途中の値をprintすることが、デバッグに有効な理由を説明してください。",
          "model": "どの時点まで期待通りかを確認し、誤りが入り込んだ範囲を絞れるため。"
        },
        {
          "question": "コメントへ残すと有用な情報を2つ挙げてください。",
          "model": "単位、仮定、変数の意味、アルゴリズムを選んだ理由など。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "文字列の引用符が閉じないSyntaxError",
          "cause": "開始と終了の引用符が揃っていない",
          "fix": "半角の'...'または\"...\"で対にする"
        }
      ]
    },
    {
      "id": "03-fstrings",
      "session": 1,
      "order": 3,
      "track": "core",
      "minutes": 18,
      "title": "f-string：値と文章を読みやすく組み立てる",
      "subtitle": "{}の中へ変数や式を埋め込み、桁数も制御する",
      "keywords": [
        "f-string",
        "format",
        ".2f",
        "expression",
        "unit"
      ],
      "objectives": [
        "文字列の先頭へfを付ける",
        "{}へ変数と式を埋め込む",
        "小数の表示桁数を指定する",
        "値と単位を一緒に表示する"
      ],
      "concepts": [
        {
          "title": "f-stringの基本",
          "body": "引用符の直前へfを付け、{}の中へ変数名を書くと、現在の値が文字列へ埋め込まれます。文字列連結より読みやすく、数値を手動でstrへ変換する必要もありません。",
          "code": "name = \"Aoi\"\nscore = 82\nprint(f\"{name}さんの得点は{score}点です\")\n"
        },
        {
          "title": "書式指定",
          "body": "{value:.2f}は小数点以下2桁、{ratio:.1%}は割合、{count:04d}は0埋め4桁です。表示を丸めても、変数に保存された元の値は変わりません。",
          "code": "value = 1 / 3\nratio = 0.875\ncount = 23\nprint(f\"value={value:.3f}\")\nprint(f\"達成率={ratio:.1%}\")\nprint(f\"ID={count:04d}\")\n"
        },
        {
          "title": "表示精度と計算精度を区別する",
          "body": "f-stringの書式指定は見せ方を変えるだけです。後の計算で必要な精度までround()で早く丸めると、誤差を自分で増やすことがあります。科学計算では内部値と報告用表示を区別します。",
          "code": ""
        }
      ],
      "liveCoding": [
        {
          "title": "平均速度レポート",
          "instruction": "前のレッスンの速度を、1桁の小数と単位付きで出します。",
          "code": "distance_km = 18.0\ntime_hour = 0.75\nspeed_kmh = distance_km / time_hour\nprint(f\"距離{distance_km:.1f} kmを{time_hour:.2f} hで移動\")\nprint(f\"平均速度: {speed_kmh:.1f} km/h\")\n",
          "predict": "最後の出力を予想してください。"
        },
        {
          "title": "式を直接埋め込む",
          "instruction": "{}内の式は表示時に評価されます。",
          "code": "radius = 3\nprint(f\"直径は{2 * radius}です\")\n",
          "predict": "変数diameterを作らなくても何が表示されますか。"
        }
      ],
      "starterCode": "name = \"Sora\"\nexperiment_count = 7\nsuccess_count = 5\nratio = success_count / experiment_count\n\n# 名前、成功回数、成功率（小数1桁の%）を表示してください\n",
      "predictPrompt": "value=2/3として、f'{value:.2f}'とprint(value)の違いを説明してください。",
      "practices": [
        {
          "id": "03-p1",
          "title": "温度を見やすく丸める",
          "prompt": "temp=23.4567 を「温度: 23.46 degC」と表示しましょう。",
          "starterCode": "temp = 23.4567\n",
          "hints": [
            "f-stringの中で {temp:.2f} と書きます。"
          ],
          "solution": "temp = 23.4567\nprint(f\"温度: {temp:.2f} degC\")\n",
          "check": {
            "outputEquals": "温度: 23.46 degC",
            "required": [
              "f\"",
              ".2f"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "03-p2",
          "title": "ミッション達成率",
          "prompt": "done=17、total=20 から rate を求め、「達成率: 85.0%」と表示しましょう。",
          "starterCode": "done = 17\ntotal = 20\nrate = done / total\n",
          "hints": [
            "割合の表示には {rate:.1%} を使えます。"
          ],
          "solution": "done = 17\ntotal = 20\nrate = done / total\nprint(f\"達成率: {rate:.1%}\")\n",
          "check": {
            "outputContains": [
              "85.0%"
            ],
            "required": [
              ".1%"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "{x:.2f}はxの保存値を丸めますか。",
          "model": "いいえ。表示を小数点以下2桁にするだけで、変数xの値は変わらない。"
        },
        {
          "question": "実験結果を値だけでなく単位付きで表示すべき理由を説明してください。",
          "model": "数値の物理的意味を誤解せず、第三者が再利用・比較できるようにするため。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "{name}がそのまま表示される",
          "cause": "文字列の前のfを付け忘れた",
          "fix": "print(f\"...{name}...\")とする"
        },
        {
          "symptom": "ValueError: Unknown format code",
          "cause": "文字列へ数値用のf書式を使った",
          "fix": "変数の型をtype()で確認する"
        }
      ]
    },
    {
      "id": "04-list",
      "session": 2,
      "order": 1,
      "track": "core",
      "minutes": 20,
      "title": "list：順序のある複数データ",
      "subtitle": "0始まりのインデックス、スライス、追加・更新",
      "keywords": [
        "list",
        "index",
        "slice",
        "append",
        "len",
        "mutable"
      ],
      "objectives": [
        "[]でlistを作る",
        "正・負のインデックスで要素を参照する",
        "スライスの終了位置が含まれないことを説明する",
        "append()と要素代入でlistを更新する"
      ],
      "concepts": [
        {
          "title": "順序とインデックス",
          "body": "listは複数の値を順序付きで保持します。最初の位置は0です。負のインデックス-1は最後の要素を指します。存在しない位置へアクセスするとIndexErrorになります。",
          "code": "scores = [72, 88, 65, 91]\nprint(scores[0])\nprint(scores[-1])\nprint(len(scores))\n"
        },
        {
          "title": "スライス",
          "body": "data[start:stop:step]で範囲を取り出します。stopの位置は含まれません。省略したstartは先頭、stopは末尾です。元のlistとは別のlistが作られます。",
          "code": "data = [10, 20, 30, 40, 50]\nprint(data[1:4])\nprint(data[:3])\nprint(data[::2])\n"
        },
        {
          "title": "変更可能なデータ構造",
          "body": "listは要素を更新でき、append()で末尾へ追加できます。remove()やpop()もありますが、削除対象や位置を確認して使います。",
          "code": "measurements = [1.2, 1.4]\nmeasurements.append(1.3)\nmeasurements[0] = 1.25\nprint(measurements)\n"
        }
      ],
      "liveCoding": [
        {
          "title": "測定値を追加",
          "instruction": "空のlistから3個の値を追加します。",
          "code": "temperatures = []\ntemperatures.append(22.1)\ntemperatures.append(22.4)\ntemperatures.append(22.0)\nprint(temperatures)\nprint(len(temperatures))\n",
          "predict": "最後のlenは何を返しますか。"
        },
        {
          "title": "必要な範囲を切り出す",
          "instruction": "0始まりとstop非包含を確認します。",
          "code": "values = [2, 4, 6, 8, 10, 12]\nprint(values[1:4])\n",
          "predict": "出力される3要素を予想してください。"
        }
      ],
      "starterCode": "scores = [72, 88, 65, 91]\n\n# 1. 最初と最後の点数を表示\n# 2. 2番目から4番目までをスライス\n# 3. 77を末尾へ追加\n",
      "predictPrompt": "data=[0,1,2,3,4]に対しdata[1:4]はどの要素を含みますか。",
      "practices": [
        {
          "id": "04-p1",
          "title": "真ん中の3個を取り出す",
          "prompt": "nums=[5, 8, 13, 21, 34] から、8、13、21 をスライスで取り出して表示しましょう。",
          "starterCode": "nums = [5, 8, 13, 21, 34]\n",
          "hints": [
            "8はインデックス1、21はインデックス3です。",
            "終了位置は含まれないため、stopには4を書きます。"
          ],
          "solution": "nums = [5, 8, 13, 21, 34]\nmid = nums[1:4]\nprint(mid)\n",
          "check": {
            "outputEquals": "[8, 13, 21]",
            "required": [
              "[1:4]"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "04-p2",
          "title": "まちがった値を直す",
          "prompt": "vals の3番目にある99.0を9.9へ直し、10.1を末尾へ追加しましょう。",
          "starterCode": "vals = [9.8, 10.0, 99.0]\n",
          "hints": [
            "3番目のインデックスは2です。",
            "末尾への追加はappend()です。"
          ],
          "solution": "vals = [9.8, 10.0, 99.0]\nvals[2] = 9.9\nvals.append(10.1)\nprint(vals)\n",
          "check": {
            "outputEquals": "[9.8, 10.0, 9.9, 10.1]",
            "required": [
              "[2]",
              "append"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "listの先頭がインデックス1ではなく0であることを踏まえ、4番目の要素のインデックスを書いてください。",
          "model": "3"
        },
        {
          "question": "data[2:5]に位置5の要素が含まれない理由を、スライスの規則として説明してください。",
          "model": "stopは終了位置の直前までを表し、終了位置自身は含めないため。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "IndexError: list index out of range",
          "cause": "要素数以上の位置へアクセスした",
          "fix": "len(list)を確認し、有効な位置0〜len-1を使う"
        },
        {
          "symptom": "appendの戻り値がNone",
          "cause": "values = values.append(x)と代入した",
          "fix": "appendはlist自体を変更するのでvalues.append(x)だけを書く"
        }
      ]
    },
    {
      "id": "05-dict",
      "session": 2,
      "order": 2,
      "track": "core",
      "minutes": 18,
      "title": "dict：キーと値で意味を保つ",
      "subtitle": "位置ではなく名前でデータへアクセスする",
      "keywords": [
        "dict",
        "key",
        "value",
        "items",
        "get",
        "KeyError"
      ],
      "objectives": [
        "{}でdictを作る",
        "キーを使って値を参照・更新する",
        "新しいキーと値を追加する",
        "get()とitems()の用途を説明する"
      ],
      "concepts": [
        {
          "title": "キーと値の対応",
          "body": "dictはキーと値の組を保持します。実験記録のように、各値の意味が異なるときに有効です。同じキーは1つだけで、再代入すると値が更新されます。",
          "code": "sample = {\"id\": 7, \"mass_g\": 2.5, \"material\": \"Al\"}\nprint(sample[\"material\"])\nsample[\"mass_g\"] = 2.6\n"
        },
        {
          "title": "存在しないキー",
          "body": "record[\"x\"]はキーがないとKeyErrorです。record.get(\"x\")は既定でNone、record.get(\"x\", 0)なら0を返します。キーが必須なのか、欠けてもよいのかで使い分けます。",
          "code": "record = {\"temperature\": 23.1}\nprint(record.get(\"pressure\", \"未測定\"))\n"
        },
        {
          "title": "反復への準備",
          "body": "keys()はキー、values()は値、items()はキーと値の組を取り出します。forを学ぶと、全項目を順に処理できます。",
          "code": "record = {\"x\": 1, \"y\": 2}\nprint(list(record.keys()))\nprint(list(record.items()))\n"
        }
      ],
      "liveCoding": [
        {
          "title": "試料記録",
          "instruction": "listではなくdictにすると、値の意味がキーに残ります。",
          "code": "sample = {\n    \"sample_id\": 12,\n    \"temperature_c\": 24.8,\n    \"valid\": True,\n}\nprint(sample[\"temperature_c\"])\n",
          "predict": "24.8は何というキーで参照できますか。"
        },
        {
          "title": "項目を追加・更新",
          "instruction": "キーへの代入で追加と更新を比較します。",
          "code": "sample = {\"id\": 1, \"mass_g\": 2.0}\nsample[\"mass_g\"] = 2.1\nsample[\"note\"] = \"再測定済み\"\nprint(sample)\n",
          "predict": "キーの数は最終的に何個ですか。"
        }
      ],
      "starterCode": "experiment = {\n    \"name\": \"falling_ball\",\n    \"height_m\": 1.5,\n    \"time_s\": 0.55,\n}\n\n# speed_mpsを計算し、新しいキーとして追加してください\n# nameとspeed_mpsを表示してください\n",
      "predictPrompt": "同じキーへ2回値を代入したとき、dictには両方の値が残りますか。",
      "practices": [
        {
          "id": "05-p1",
          "title": "ゲーム記録を更新",
          "prompt": "user の score を78から85へ更新し、clear=True を追加して表示しましょう。",
          "starterCode": "user = {\"name\": \"Mio\", \"score\": 78}\n",
          "hints": [
            "既存値の更新は user[\"score\"] = 85 です。",
            "新しいキーも同じ代入の形で追加できます。"
          ],
          "solution": "user = {\"name\": \"Mio\", \"score\": 78}\nuser[\"score\"] = 85\nuser[\"clear\"] = True\nprint(user)\n",
          "check": {
            "outputContains": [
              "85",
              "True"
            ],
            "required": [
              "[\"score\"]",
              "[\"clear\"]"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "05-p2",
          "title": "ない項目を安全に読む",
          "prompt": "rec に pressure がないとき、「未測定」と表示しましょう。get()を使います。",
          "starterCode": "rec = {\"temp\": 23.1}\n",
          "hints": [
            "rec.get(\"pressure\", \"未測定\") の形です。"
          ],
          "solution": "rec = {\"temp\": 23.1}\nprint(rec.get(\"pressure\", \"未測定\"))\n",
          "check": {
            "outputEquals": "未測定",
            "required": [
              "get"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "試験点数だけの連続データにはlistとdictのどちらが自然ですか。理由も書いてください。",
          "model": "順序付きの同種データなのでlistが自然。"
        },
        {
          "question": "1つの試料のID・質量・材質を保存するならdictが適する理由を説明してください。",
          "model": "各値の意味が異なり、キー名で意味を保持して参照できるため。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "KeyError",
          "cause": "存在しないキー、綴り、大文字小文字の違い",
          "fix": "print(record.keys())でキーを確認し、任意項目ならget()を使う"
        }
      ]
    },
    {
      "id": "06-tuple",
      "session": 2,
      "order": 3,
      "track": "core",
      "minutes": 15,
      "title": "tuple：変更しない組を表す",
      "subtitle": "座標・色・戻り値など、まとまりを固定する",
      "keywords": [
        "tuple",
        "immutable",
        "unpack",
        "multiple return"
      ],
      "objectives": [
        "()またはカンマでtupleを作る",
        "インデックスで参照する",
        "変更不可である意味を説明する",
        "アンパックで複数の変数へ分ける"
      ],
      "concepts": [
        {
          "title": "変更しない順序付きデータ",
          "body": "tupleはlistと同様に順序を持ちますが、作成後に要素を置き換えられません。座標やRGBのように、組として扱い、誤って変更したくない値に向きます。",
          "code": "point = (3.0, 4.0)\nprint(point[0])\n# point[0] = 5.0  # TypeError\n"
        },
        {
          "title": "アンパック",
          "body": "要素数と変数数が一致すれば、tupleを一度に分解できます。関数が複数の値を返す場面でも使われます。",
          "code": "point = (3.0, 4.0)\nx, y = point\nprint(x, y)\n"
        },
        {
          "title": "1要素tuple",
          "body": "(5)は単なる整数5です。1要素tupleは(5,)のようにカンマが必要です。tupleを作る本質は括弧よりカンマです。",
          "code": "a = (5)\nb = (5,)\nprint(type(a), type(b))\n"
        }
      ],
      "liveCoding": [
        {
          "title": "座標をアンパック",
          "instruction": "2次元座標をxとyへ分けます。",
          "code": "position = (12.5, -3.0)\nx, y = position\nprint(f\"x={x}, y={y}\")\n",
          "predict": "xとyへ何が代入されますか。"
        },
        {
          "title": "listとの違い",
          "instruction": "変更可能性を実際のエラーで確認します。",
          "code": "values_list = [1, 2]\nvalues_tuple = (1, 2)\nvalues_list[0] = 9\nprint(values_list)\n# values_tuple[0] = 9\n",
          "predict": "最後のコメントを外すと何という種類の問題が起きるでしょうか。"
        }
      ],
      "starterCode": "rgb = (32, 128, 240)\n\n# r, g, bへアンパックし、各値を表示してください\n",
      "predictPrompt": "single=(10)とsingle=(10,)の型の違いを予想してください。",
      "practices": [
        {
          "id": "06-p1",
          "title": "座標を3つに分ける",
          "prompt": "p=(1.5, -2.0, 4.5) を x、y、z に分け、zだけ表示しましょう。",
          "starterCode": "p = (1.5, -2.0, 4.5)\n",
          "hints": [
            "x, y, z = p と書くと3つへ分けられます。"
          ],
          "solution": "p = (1.5, -2.0, 4.5)\nx, y, z = p\nprint(z)\n",
          "check": {
            "outputEquals": "4.5",
            "required": [
              "x, y, z"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "06-p2",
          "title": "1個だけのtuple",
          "prompt": "42だけを持つ one というtupleを作り、型と長さを表示しましょう。",
          "starterCode": "# oneを作る\n",
          "hints": [
            "1要素tupleでは、42の後ろにカンマが必要です。"
          ],
          "solution": "one = (42,)\nprint(type(one))\nprint(len(one))\n",
          "check": {
            "outputContains": [
              "tuple",
              "1"
            ],
            "required": [
              "(42,)"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "座標をlistではなくtupleで表す利点を1つ書いてください。",
          "model": "組を誤って書き換えることを防ぎ、固定された座標である意図を示せる。"
        },
        {
          "question": "x,y=(2,3)で行われる処理を説明してください。",
          "model": "tupleの2要素を順番にxとyへ代入するアンパック。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "TypeError: 'tuple' object does not support item assignment",
          "cause": "tupleの要素を変更しようとした",
          "fix": "変更が必要ならlistを使うか、新しいtupleを作る"
        },
        {
          "symptom": "ValueError: too many/not enough values to unpack",
          "cause": "要素数と左辺の変数数が違う",
          "fix": "len(tuple)と変数数を一致させる"
        }
      ]
    },
    {
      "id": "07-methods",
      "session": 2,
      "order": 4,
      "track": "core",
      "minutes": 16,
      "title": "関数とメソッド：データに備わる道具",
      "subtitle": "len(data)とdata.append(x)の形を読み分ける",
      "keywords": [
        "function",
        "method",
        "attribute",
        "dot",
        "dir",
        "object"
      ],
      "objectives": [
        "関数呼び出しとメソッド呼び出しを見分ける",
        ".が『そのオブジェクトの中の』を表すことを説明する",
        "代表的なstr・list・dictメソッドを使う",
        "dir()で利用可能な名前を調べる"
      ],
      "concepts": [
        {
          "title": "関数とメソッド",
          "body": "print(x)やlen(x)は値を引数として渡す関数です。text.upper()やvalues.append(x)は、そのオブジェクトに備わったメソッドです。ドットは『textの中にあるupper』という読み方をします。",
          "code": "text = \"hello\"\nprint(text.upper())\nvalues = [1, 2]\nvalues.append(3)\nprint(len(values))\n"
        },
        {
          "title": "戻り値と破壊的変更",
          "body": "str.upper()は新しい文字列を返し、元の文字列は変わりません。list.append()はlist自体を変更し、戻り値はNoneです。メソッドごとに『戻すか』『元を変えるか』を確認します。",
          "code": "text = \"hello\"\nupper_text = text.upper()\nprint(text, upper_text)\nvalues = [1, 2]\nresult = values.append(3)\nprint(values, result)\n"
        },
        {
          "title": "dir()とhelpの代替",
          "body": "dir(obj)で属性・メソッド名の一覧を確認できます。アプリでは大量に出るため、名前を絞って観察します。実務では公式ドキュメントと組み合わせます。",
          "code": "text = \"abc\"\nnames = [name for name in dir(text) if not name.startswith(\"_\")]\nprint(names[:15])\n"
        }
      ],
      "liveCoding": [
        {
          "title": "文字列メソッド",
          "instruction": "strip、lower、replaceを連続して使います。",
          "code": "raw = \"  Python LAB  \"\nclean = raw.strip().lower().replace(\" \", \"_\")\nprint(clean)\n",
          "predict": "最終文字列を予想してください。"
        },
        {
          "title": "appendの戻り値",
          "instruction": "listが変わることと、戻り値がNoneであることを分けて確認します。",
          "code": "values = [1, 2]\nresult = values.append(3)\nprint(values)\nprint(result)\n",
          "predict": "2行の出力を予想してください。"
        }
      ],
      "starterCode": "raw_name = \"  Sample A  \"\n\n# strip()で両端の空白を除き、lower()で小文字にしてください\n# 結果を表示してください\n",
      "predictPrompt": "text.upper()を呼ぶだけでtext自身は大文字へ変わりますか。",
      "practices": [
        {
          "id": "07-p1",
          "title": "文字列をきれいに整える",
          "prompt": "text=\"  ALUMINUM Sample  \" を aluminum_sample へ変換しましょう。",
          "starterCode": "text = \"  ALUMINUM Sample  \"\n",
          "hints": [
            "前後の空白はstrip()、小文字化はlower()です。",
            "空白を_へ変えるにはreplace(\" \", \"_\")を使います。"
          ],
          "solution": "text = \"  ALUMINUM Sample  \"\nclean = text.strip().lower().replace(\" \", \"_\")\nprint(clean)\n",
          "check": {
            "outputEquals": "aluminum_sample",
            "required": [
              "strip",
              "lower",
              "replace"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "07-p2",
          "title": "append()の落とし穴を修正",
          "prompt": "nums が None にならず、[1, 2, 3] と表示されるように直しましょう。",
          "starterCode": "nums = [1, 2]\nnums = nums.append(3)\nprint(nums)\n",
          "hints": [
            "append()はlist自体を変え、戻り値はNoneです。",
            "代入を外して nums.append(3) だけにします。"
          ],
          "solution": "nums = [1, 2]\nnums.append(3)\nprint(nums)\n",
          "check": {
            "outputEquals": "[1, 2, 3]",
            "forbidden": [
              "nums = nums.append"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "len(values)とvalues.append(3)は、それぞれ関数とメソッドのどちらですか。",
          "model": "lenは関数、appendはlistオブジェクトのメソッド。"
        },
        {
          "question": "メソッドが元のオブジェクトを変更するかを確認すべき理由を書いてください。",
          "model": "戻り値を誤って代入したり、元データを意図せず変更したりするのを防ぐため。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "AttributeError",
          "cause": "その型に存在しないメソッド名を呼んだ",
          "fix": "type()とdir()、綴りを確認する"
        }
      ]
    },
    {
      "id": "08-math",
      "session": 3,
      "order": 1,
      "track": "core",
      "minutes": 20,
      "title": "mathライブラリ：標準Pythonで数学関数を使う",
      "subtitle": "import、円周率、平方根、三角関数と角度単位",
      "keywords": [
        "import",
        "math",
        "pi",
        "sqrt",
        "sin",
        "cos",
        "radians",
        "log",
        "exp"
      ],
      "objectives": [
        "import mathの意味を説明する",
        "math.pi・sqrt・sin・cosを使う",
        "度とラジアンを区別する",
        "スカラー計算ではmathを使える"
      ],
      "concepts": [
        {
          "title": "ライブラリを読み込む",
          "body": "標準機能だけにない数学関数はmathモジュールから利用します。import mathの後、math.sqrtのように名前空間を明示すると、どのライブラリの機能か分かります。",
          "code": "import math\nprint(math.pi)\nprint(math.sqrt(2))\n"
        },
        {
          "title": "三角関数はラジアン",
          "body": "math.sin()やmath.cos()へ渡す角度はラジアンです。度を使う場合はmath.radians()で変換します。180度がπラジアンです。",
          "code": "import math\nangle_deg = 30\nangle_rad = math.radians(angle_deg)\nprint(math.sin(angle_rad))\n"
        },
        {
          "title": "よく使う関数",
          "body": "sqrt、sin、cos、tan、exp、log、log10、floor、ceil、hypotなどがあります。定義域に合わない値はValueErrorになることがあります。",
          "code": "import math\nprint(math.exp(1))\nprint(math.log10(1000))\nprint(math.hypot(3, 4))\n"
        }
      ],
      "liveCoding": [
        {
          "title": "円の面積",
          "instruction": "math.piを使い、近似値3.14との違いも観察します。",
          "code": "import math\nradius_m = 2.0\narea_m2 = math.pi * radius_m ** 2\nprint(f\"面積: {area_m2:.4f} m^2\")\n",
          "predict": "面積はおよそいくつですか。"
        },
        {
          "title": "斜方投射の初速度成分",
          "instruction": "度をラジアンへ変えてsin・cosを使います。",
          "code": "import math\nspeed = 20.0\nangle_deg = 35.0\nangle_rad = math.radians(angle_deg)\nvx = speed * math.cos(angle_rad)\nvy = speed * math.sin(angle_rad)\nprint(f\"vx={vx:.2f}, vy={vy:.2f}\")\n",
          "predict": "vxとvyのどちらが大きいと予想しますか。"
        }
      ],
      "starterCode": "import math\n\nlength_x = 3.0\nlength_y = 4.0\n\n# math.hypotを使って斜辺を計算し、表示してください\n",
      "predictPrompt": "math.sin(30)が0.5にならない理由を説明してください。",
      "practices": [
        {
          "id": "08-p1",
          "title": "円周を計算",
          "prompt": "半径 r=2.5 m の円周を math.pi で求め、「15.71 m」と表示しましょう。",
          "starterCode": "import math\nr = 2.5\n",
          "hints": [
            "円周は 2 * math.pi * r です。",
            "小数2桁は:.2fです。"
          ],
          "solution": "import math\nr = 2.5\nc = 2 * math.pi * r\nprint(f\"{c:.2f} m\")\n",
          "check": {
            "outputEquals": "15.71 m",
            "required": [
              "math.pi",
              ".2f"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "08-p2",
          "title": "sin 30°",
          "prompt": "deg=30 をラジアンへ変換し、sinの値を表示しましょう。",
          "starterCode": "import math\ndeg = 30\n",
          "hints": [
            "rad = math.radians(deg) としてからmath.sin(rad)を使います。"
          ],
          "solution": "import math\ndeg = 30\nrad = math.radians(deg)\nprint(math.sin(rad))\n",
          "check": {
            "numericOutput": 0.5,
            "tolerance": 1e-12,
            "required": [
              "radians",
              "sin"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "モジュール名を付けてmath.sqrtと書く利点を説明してください。",
          "model": "機能の所属が明確で、同名関数との衝突を避けやすい。"
        },
        {
          "question": "度からラジアンへ変換する式または関数を書いてください。",
          "model": "math.radians(deg)、またはdeg*math.pi/180。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "NameError: name 'math' is not defined",
          "cause": "import mathを書いていない",
          "fix": "使用前にimport mathを実行する"
        },
        {
          "symptom": "三角関数の値が予想と違う",
          "cause": "度をそのまま渡した",
          "fix": "math.radians()でラジアンへ変換する"
        }
      ]
    },
    {
      "id": "09-range",
      "session": 3,
      "order": 2,
      "track": "core",
      "minutes": 15,
      "title": "range：反復に使う整数列を設計する",
      "subtitle": "開始・終了・刻み幅と、終了値を含まない規則",
      "keywords": [
        "range",
        "start",
        "stop",
        "step",
        "list"
      ],
      "objectives": [
        "range(stop)の値を列挙する",
        "range(start, stop, step)を使う",
        "終了値を含まない利点を説明する",
        "負の刻み幅を使う"
      ],
      "concepts": [
        {
          "title": "rangeの3形式",
          "body": "range(stop)、range(start, stop)、range(start, stop, step)があります。stopは含みません。range自体は必要な整数を効率よく生成するオブジェクトで、内容の確認にはlist(range(...))を使えます。",
          "code": "print(list(range(5)))\nprint(list(range(2, 7)))\nprint(list(range(2, 11, 2)))\n"
        },
        {
          "title": "stopを含まない",
          "body": "range(5)が0〜4の5個になるため、長さnのlistのインデックスと自然に対応します。差stop-startが、step=1での個数になります。",
          "code": "values = [10, 20, 30, 40]\nprint(list(range(len(values))))\n"
        },
        {
          "title": "逆向き",
          "body": "負のstepを使うと減少できます。ただしstartがstopより大きくないと空になります。",
          "code": "print(list(range(5, 0, -1)))\n"
        }
      ],
      "liveCoding": [
        {
          "title": "3通りのrange",
          "instruction": "実行前に列を書き出してから照合します。",
          "code": "print(list(range(4)))\nprint(list(range(3, 8)))\nprint(list(range(2, 11, 3)))\n",
          "predict": "各行の最初・最後・要素数を予想してください。"
        },
        {
          "title": "カウントダウン",
          "instruction": "負のstepで5から1へ進みます。",
          "code": "print(list(range(5, 0, -1)))\n",
          "predict": "0は含まれますか。"
        }
      ],
      "starterCode": "# 0, 5, 10, 15, 20を作って表示してください\nnumbers = range(____, ____, ____)\nprint(list(numbers))\n",
      "predictPrompt": "range(2,10,3)が作る整数をすべて書いてください。",
      "practices": [
        {
          "id": "09-p1",
          "title": "偶数列",
          "prompt": "2から10までの偶数[2,4,6,8,10]をrangeで作って表示してください。",
          "starterCode": "# rangeを作る\n",
          "hints": [
            "stopは含まれないため12にします。"
          ],
          "solution": "numbers = range(2, 12, 2)\nprint(list(numbers))\n",
          "check": {
            "outputEquals": "[2, 4, 6, 8, 10]",
            "required": [
              "range"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "09-p2",
          "title": "逆順",
          "prompt": "10,7,4,1をrangeで作って表示してください。",
          "starterCode": "# rangeを作る\n",
          "hints": [
            "開始10、刻み-3です。",
            "1を含めるにはstopを1より小さくします。"
          ],
          "solution": "numbers = range(10, 0, -3)\nprint(list(numbers))\n",
          "check": {
            "outputEquals": "[10, 7, 4, 1]",
            "required": [
              "-3"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "range(6)の最初、最後、要素数を書いてください。",
          "model": "最初0、最後5、6個。"
        },
        {
          "question": "rangeのstopを含めない設計がlistのインデックスと相性がよい理由を説明してください。",
          "model": "長さnのlistの有効インデックス0〜n-1をrange(n)でそのまま作れるため。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "期待した終了値がない",
          "cause": "stopが含まれないことを忘れた",
          "fix": "正のstepなら含めたい最後の値より先にstopを置く"
        },
        {
          "symptom": "空のrange",
          "cause": "stepの符号とstart/stopの大小が合っていない",
          "fix": "増加なら正、減少なら負のstepにする"
        }
      ]
    },
    {
      "id": "10-for",
      "session": 3,
      "order": 3,
      "track": "core",
      "minutes": 22,
      "title": "for：同じ規則を繰り返す",
      "subtitle": "ループ変数とインデントで処理の範囲を表す",
      "keywords": [
        "for",
        "loop",
        "iterator",
        "indent",
        "accumulator",
        "enumerate"
      ],
      "objectives": [
        "for ... in ...:の構文を書く",
        "インデントされた範囲が繰り返されることを説明する",
        "ループ変数を計算へ使う",
        "合計用変数を更新する"
      ],
      "concepts": [
        {
          "title": "for文の形",
          "body": "for 変数 in 反復可能なデータ:の後に、半角スペース4個のインデントで処理を書きます。各反復で変数へ次の要素が入ります。",
          "code": "for i in range(4):\n    print(i)\nprint(\"終了\")\n"
        },
        {
          "title": "値を直接取り出す",
          "body": "listをforで回すと、インデックスではなく要素そのものを受け取れます。位置も必要ならenumerate()を使います。",
          "code": "scores = [72, 88, 65]\nfor score in scores:\n    print(score)\n\nfor index, score in enumerate(scores):\n    print(index, score)\n"
        },
        {
          "title": "累積する",
          "body": "合計や回数は、ループ前に初期値を用意し、各反復で更新します。変数totalが状態を保持します。",
          "code": "total = 0\nfor value in [3, 5, 7]:\n    total = total + value\nprint(total)\n"
        }
      ],
      "liveCoding": [
        {
          "title": "平方の表",
          "instruction": "iの値が各行でどう変わるかを確認します。",
          "code": "for i in range(1, 6):\n    square = i ** 2\n    print(f\"{i}^2 = {square}\")\n",
          "predict": "何行出力されますか。"
        },
        {
          "title": "合計",
          "instruction": "totalの更新を変数インスペクタと出力で追います。",
          "code": "total = 0\nfor value in [4, 7, 2, 9]:\n    total += value\n    print(f\"途中: {total}\")\nprint(f\"合計: {total}\")\n",
          "predict": "途中のtotalを順に予想してください。"
        }
      ],
      "starterCode": "# 0度から90度まで15度刻みで、角度を表示してください\nfor angle_deg in range(____, ____, ____):\n    print(angle_deg)\n",
      "predictPrompt": "for i in range(3)の直後にprint(i)をインデントなしで置くと、何回表示されますか。",
      "practices": [
        {
          "id": "10-p1",
          "title": "立方の表",
          "prompt": "1〜5の整数と、その立方をf-stringで5行表示してください。",
          "starterCode": "# for文を書く\n",
          "hints": [
            "range(1,6)です。",
            "cube=i**3です。"
          ],
          "solution": "for i in range(1, 6):\n    cube = i ** 3\n    print(f\"{i}: {cube}\")\n",
          "check": {
            "outputContains": [
              "1: 1",
              "5: 125"
            ],
            "required": [
              "for",
              "range",
              "** 3"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "10-p2",
          "title": "forで合計してみる",
          "prompt": "nums=[1.2, 2.5, 0.8] を、sum()を使わずforで合計し、4.5を表示しましょう。",
          "starterCode": "nums = [1.2, 2.5, 0.8]\ntotal = 0.0\n# forで足す\n",
          "hints": [
            "for x in nums: と書きます。",
            "繰り返すたびに total += x とします。"
          ],
          "solution": "nums = [1.2, 2.5, 0.8]\ntotal = 0.0\nfor x in nums:\n    total += x\nprint(total)\n",
          "check": {
            "numericOutput": 4.5,
            "tolerance": 1e-12,
            "required": [
              "for"
            ],
            "forbidden": [
              "sum("
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "forの本体を表すためにPythonが使うものは何ですか。",
          "model": "コロンの次のインデント。通常は半角スペース4個。"
        },
        {
          "question": "合計を求めるtotalをループの中で0へ初期化すると何が問題ですか。",
          "model": "各反復でそれまでの合計が失われ、最後の要素だけに近い値になる。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "IndentationError",
          "cause": "コロン後のインデント不足、タブとスペース混在",
          "fix": "本体を半角スペース4個で揃える"
        },
        {
          "symptom": "最終値しか残らない",
          "cause": "保存したい値をlistへappendせず毎回上書きした",
          "fix": "結果listをループ前に作り、ループ内でappendする"
        }
      ]
    },
    {
      "id": "11-conditions",
      "session": 4,
      "order": 1,
      "track": "core",
      "minutes": 18,
      "title": "比較式・bool・論理演算",
      "subtitle": "条件をTrue/Falseとして組み立てる",
      "keywords": [
        "bool",
        "comparison",
        "==",
        "!=",
        "<",
        "<=",
        "and",
        "or",
        "not"
      ],
      "objectives": [
        "比較演算子を正しく使う",
        "=と==を区別する",
        "境界値を含むか判断する",
        "and・or・notで条件を組み合わせる"
      ],
      "concepts": [
        {
          "title": "比較はboolを返す",
          "body": "==、!=、<、<=、>、>=は比較結果としてTrueまたはFalseを返します。=は代入、==は等しいかの比較です。",
          "code": "temperature = 25.0\nprint(temperature >= 20)\nprint(temperature == 25.0)\n"
        },
        {
          "title": "境界値",
          "body": "18以上はage >= 18、18より大きいはage > 18です。仕様に含む・含まないを言葉から正確に式へ変えます。",
          "code": "score = 60\nprint(score >= 60)\nprint(score > 60)\n"
        },
        {
          "title": "論理演算",
          "body": "andは両方、orはいずれか、notは反転です。複雑な条件は括弧と意味のある中間変数で読みやすくします。",
          "code": "temperature = 22\nhumidity = 45\nis_comfortable = (20 <= temperature <= 26) and (30 <= humidity <= 60)\nprint(is_comfortable)\n"
        }
      ],
      "liveCoding": [
        {
          "title": "測定範囲",
          "instruction": "下限と上限を含む条件を作ります。",
          "code": "value = 9.8\nlower = 9.5\nupper = 10.5\nis_in_range = lower <= value <= upper\nprint(is_in_range)\n",
          "predict": "valueが10.5ちょうどでもTrueですか。"
        },
        {
          "title": "条件を分ける",
          "instruction": "長い式を中間変数へ分けます。",
          "code": "temperature = 28\nis_measured = True\nin_range = 20 <= temperature <= 30\nis_usable = is_measured and in_range\nprint(is_usable)\n",
          "predict": "is_measured=Falseなら結果はどうなりますか。"
        }
      ],
      "starterCode": "speed_kmh = 42\nhas_license = True\n\n# 速度が40以下、かつ免許ありならTrueとなるcan_driveを作る\n# can_driveを表示する\n",
      "predictPrompt": "x=5に対し、x>3 and x<5の結果を予想してください。",
      "practices": [
        {
          "id": "11-p1",
          "title": "範囲に入っているか",
          "prompt": "x=1.05 が0.95以上1.10以下かを ok へ保存し、表示しましょう。",
          "starterCode": "x = 1.05\n",
          "hints": [
            "Pythonでは 0.95 <= x <= 1.10 と連続して書けます。"
          ],
          "solution": "x = 1.05\nok = 0.95 <= x <= 1.10\nprint(ok)\n",
          "check": {
            "outputEquals": "True",
            "required": [
              "<="
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "11-p2",
          "title": "週末かどうか",
          "prompt": "day が \"sat\" または \"sun\" なら weekend=True となる式を書きましょう。",
          "starterCode": "day = \"sun\"\n",
          "hints": [
            "day == \"sat\" or day == \"sun\" と、比較を2回書きます。"
          ],
          "solution": "day = \"sun\"\nweekend = day == \"sat\" or day == \"sun\"\nprint(weekend)\n",
          "check": {
            "outputEquals": "True",
            "required": [
              "or",
              "=="
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "=と==の違いを説明してください。",
          "model": "=は代入、==は左右が等しいかを比較してboolを返す。"
        },
        {
          "question": "0 <= x < 10が表す範囲を日本語で書いてください。",
          "model": "xは0以上10未満。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "if x = 3でSyntaxError",
          "cause": "比較に代入演算子=を使った",
          "fix": "等価比較は==を使う"
        },
        {
          "symptom": "境界値だけ誤る",
          "cause": "<と<=を取り違えた",
          "fix": "含むなら<=または>=、含まないなら<または>を使う"
        }
      ]
    },
    {
      "id": "12-if",
      "session": 4,
      "order": 2,
      "track": "core",
      "minutes": 20,
      "title": "if・elif・else：条件で処理を選ぶ",
      "subtitle": "上から順に判定し、最初にTrueとなった枝を実行する",
      "keywords": [
        "if",
        "elif",
        "else",
        "branch",
        "indent",
        "exclusive"
      ],
      "objectives": [
        "if文を正しいインデントで書く",
        "elifとelseを使い3分類する",
        "条件の順番が結果へ影響することを説明する",
        "全経路で必要な変数が定義されるようにする"
      ],
      "concepts": [
        {
          "title": "ifの基本",
          "body": "if 条件:の条件がTrueのときだけ、インデントされた処理を実行します。elseはそれ以外です。",
          "code": "temperature = 28\nif temperature >= 25:\n    print(\"暑い\")\nelse:\n    print(\"暑くない\")\n"
        },
        {
          "title": "elifによる多段階分類",
          "body": "ifから上の順に条件を調べ、最初にTrueとなった1枝だけを実行します。広い条件を先に置くと、後の細かい条件へ到達しません。",
          "code": "score = 82\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelif score >= 70:\n    grade = \"C\"\nelse:\n    grade = \"D\"\nprint(grade)\n"
        },
        {
          "title": "すべての経路を考える",
          "body": "後で使う変数は、どの分岐を通っても定義される必要があります。elseを用意するか、分岐前に既定値を置きます。境界値でテストします。",
          "code": ""
        }
      ],
      "liveCoding": [
        {
          "title": "温度を3分類",
          "instruction": "低い境界と高い境界を含めて分類します。",
          "code": "temperature = 18\nif temperature < 15:\n    label = \"low\"\nelif temperature <= 25:\n    label = \"normal\"\nelse:\n    label = \"high\"\nprint(label)\n",
          "predict": "15と25はそれぞれどの分類ですか。"
        },
        {
          "title": "条件順序の失敗",
          "instruction": "score>=60を先に置くと何が起きるか観察します。",
          "code": "score = 95\nif score >= 60:\n    grade = \"pass\"\nelif score >= 90:\n    grade = \"excellent\"\nprint(grade)\n",
          "predict": "なぜexcellentにならないのでしょうか。"
        }
      ],
      "starterCode": "speed_kmh = 82\n\n# 40以下: slow、80以下: normal、それ以外: fast\n# labelへ分類し表示してください\n",
      "predictPrompt": "score=90を、if score>=60、elif score>=90の順で判定すると何になりますか。理由も書いてください。",
      "practices": [
        {
          "id": "12-p1",
          "title": "重さを3段階に分ける",
          "prompt": "mass=5.0 を、2.0未満なら light、5.0以下なら medium、それ以外なら heavy に分類しましょう。",
          "starterCode": "mass = 5.0\n",
          "hints": [
            "if mass < 2.0: から始めます。",
            "境界の5.0をmediumへ含めるため、elif mass <= 5.0: とします。"
          ],
          "solution": "mass = 5.0\nif mass < 2.0:\n    label = \"light\"\nelif mass <= 5.0:\n    label = \"medium\"\nelse:\n    label = \"heavy\"\nprint(label)\n",
          "check": {
            "outputEquals": "medium",
            "required": [
              "if",
              "elif",
              "else"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "12-p2",
          "title": "バグ修正：条件順序",
          "prompt": "score=95でexcellentと表示されるよう条件順序を直してください。",
          "starterCode": "score = 95\nif score >= 60:\n    result = \"pass\"\nelif score >= 90:\n    result = \"excellent\"\nelse:\n    result = \"fail\"\nprint(result)\n",
          "hints": [
            "高い基準を先に判定します。"
          ],
          "solution": "score = 95\nif score >= 90:\n    result = \"excellent\"\nelif score >= 60:\n    result = \"pass\"\nelse:\n    result = \"fail\"\nprint(result)\n",
          "check": {
            "outputEquals": "excellent"
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "elifは、先行するifがTrueだった場合にも評価されますか。",
          "model": "評価されない。最初にTrueとなった枝だけが実行される。"
        },
        {
          "question": "条件分岐をテストするとき、境界値が重要な理由を書いてください。",
          "model": "<と<=などの誤りが境界でだけ表面化しやすいため。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "Unbound/NameErrorで分類結果がない",
          "cause": "どの条件にも該当せず、変数が定義されなかった",
          "fix": "elseまたは分岐前の既定値を用意する"
        },
        {
          "symptom": "高い値が一般分類になる",
          "cause": "広い条件を先に置いた",
          "fix": "上から最初のTrueで止まるため、条件順序を見直す"
        }
      ]
    },
    {
      "id": "13-for-if",
      "session": 4,
      "order": 3,
      "track": "core",
      "minutes": 20,
      "title": "forとif：データを抽出・分類・集計する",
      "subtitle": "反復の各要素へ同じ判定規則を適用する",
      "keywords": [
        "for-if",
        "filter",
        "count",
        "modulo",
        "append",
        "classification"
      ],
      "objectives": [
        "各要素へifを適用する",
        "条件に合う値を新しいlistへ集める",
        "個数をカウントする",
        "%で倍数・偶奇を判定する"
      ],
      "concepts": [
        {
          "title": "条件抽出",
          "body": "結果用listをループ前に作り、条件を満たす値だけappendします。元データを直接削除しながら反復すると要素を飛ばすことがあるため、新しいlistを作る方が安全です。",
          "code": "values = [3, -1, 5, -2, 0]\npositive = []\nfor value in values:\n    if value > 0:\n        positive.append(value)\nprint(positive)\n"
        },
        {
          "title": "数える",
          "body": "条件に合うたびcountを1増やします。初期値はループの外です。",
          "code": "scores = [72, 88, 55, 91]\npassed = 0\nfor score in scores:\n    if score >= 60:\n        passed += 1\nprint(passed)\n"
        },
        {
          "title": "余り%",
          "body": "n % 2 == 0なら偶数、n % 3 == 0なら3の倍数です。%は剰余演算子で、割合記号ではありません。",
          "code": "for n in range(1, 7):\n    if n % 2 == 0:\n        print(n)\n"
        }
      ],
      "liveCoding": [
        {
          "title": "範囲外を見つける",
          "instruction": "測定値が9.5〜10.5の外ならinvalidへ追加します。",
          "code": "values = [9.8, 10.2, 12.0, 9.4, 10.0]\ninvalid = []\nfor value in values:\n    if not (9.5 <= value <= 10.5):\n        invalid.append(value)\nprint(invalid)\n",
          "predict": "invalidへ入る2値を予想してください。"
        },
        {
          "title": "Fizzの入口",
          "instruction": "3の倍数だけラベルを変えます。",
          "code": "for n in range(1, 11):\n    if n % 3 == 0:\n        print(n, \"multiple of 3\")\n    else:\n        print(n)\n",
          "predict": "ラベル付きになる数を列挙してください。"
        }
      ],
      "starterCode": "temperatures = [18.5, 22.1, 27.0, 19.8, 30.2]\ncomfortable = []\n\n# 20以上26以下だけcomfortableへ追加し、最後に表示\n",
      "predictPrompt": "range(1,11)の中でn%4==0となる値をすべて書いてください。",
      "practices": [
        {
          "id": "13-p1",
          "title": "偶数を抽出",
          "prompt": "1〜12から偶数だけをevensへ集めて表示してください。",
          "starterCode": "evens = []\n# forとifを書く\n",
          "hints": [
            "range(1,13)です。",
            "n % 2 == 0を使います。"
          ],
          "solution": "evens = []\nfor n in range(1, 13):\n    if n % 2 == 0:\n        evens.append(n)\nprint(evens)\n",
          "check": {
            "outputEquals": "[2, 4, 6, 8, 10, 12]",
            "required": [
              "for",
              "if",
              "% 2"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "13-p2",
          "title": "合格者を数える",
          "prompt": "scores のうち60点以上の人数を count で数えて表示しましょう。",
          "starterCode": "scores = [42, 60, 73, 58, 91, 66]\ncount = 0\n",
          "hints": [
            "点数を1つずつforで取り出します。",
            "60以上のときだけ count += 1 とします。"
          ],
          "solution": "scores = [42, 60, 73, 58, 91, 66]\ncount = 0\nfor score in scores:\n    if score >= 60:\n        count += 1\nprint(count)\n",
          "check": {
            "outputEquals": "4",
            "required": [
              "for",
              "if",
              "+= 1"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "listを反復しながら同じlistから要素を削除するのを避ける理由を書いてください。",
          "model": "位置がずれて未確認の要素を飛ばす可能性があるため。新しいlistへ抽出する方が安全。"
        },
        {
          "question": "n%5==0が表す条件を日本語で書いてください。",
          "model": "nを5で割った余りが0、つまり5の倍数。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "countが0か1にしかならない",
          "cause": "count=0をループ内で毎回実行した",
          "fix": "初期化はループ前、更新はループ内に置く"
        },
        {
          "symptom": "appendされない",
          "cause": "if本体のインデントが外れている",
          "fix": "forとifの二段階インデントを確認する"
        }
      ]
    },
    {
      "id": "14-def",
      "session": 5,
      "order": 1,
      "track": "core",
      "minutes": 24,
      "title": "defとreturn：処理へ名前を付けて再利用する",
      "subtitle": "入力（引数）から出力（戻り値）を作る小さな部品",
      "keywords": [
        "def",
        "parameter",
        "argument",
        "return",
        "function call",
        "docstring"
      ],
      "objectives": [
        "defで関数を定義する",
        "仮引数と実引数を区別する",
        "returnで計算結果を呼び出し元へ返す",
        "同じ関数を異なる入力で再利用する"
      ],
      "concepts": [
        {
          "title": "関数定義",
          "body": "def 名前(仮引数):で関数を定義します。定義しただけでは本体は実行されず、名前()で呼び出したときに実行されます。関数名は動作が伝わる動詞を含めます。",
          "code": "def celsius_to_kelvin(celsius):\n    kelvin = celsius + 273.15\n    return kelvin\n\nresult = celsius_to_kelvin(25.0)\nprint(result)\n"
        },
        {
          "title": "returnとprintの違い",
          "body": "printは画面へ表示し、returnは値を呼び出し元へ渡します。後続計算へ使う関数はreturnが必要です。returnの実行時点で関数を抜けます。",
          "code": "def square(x):\n    return x ** 2\n\ny = square(4) + square(3)\nprint(y)\n"
        },
        {
          "title": "引数と既定値",
          "body": "仮引数は関数定義側の名前、実引数は呼び出し時に渡す値です。既定値を持つ引数は省略できますが、必須引数より後へ置きます。",
          "code": "def kinetic_energy(mass, speed, factor=0.5):\n    return factor * mass * speed ** 2\n\nprint(kinetic_energy(2.0, 3.0))\n"
        }
      ],
      "liveCoding": [
        {
          "title": "単位換算関数",
          "instruction": "同じ処理を3つの温度へ再利用します。",
          "code": "def celsius_to_kelvin(celsius):\n    return celsius + 273.15\n\nfor temp_c in [0, 20, 100]:\n    temp_k = celsius_to_kelvin(temp_c)\n    print(f\"{temp_c} degC = {temp_k:.2f} K\")\n",
          "predict": "100 degCは何Kですか。"
        },
        {
          "title": "二つの戻り値",
          "instruction": "tupleとして複数値を返し、アンパックします。",
          "code": "def min_max(values):\n    return min(values), max(values)\n\nlow, high = min_max([4, 1, 8, 3])\nprint(low, high)\n",
          "predict": "returnされた値の型は何ですか。"
        }
      ],
      "starterCode": "def rectangle_area(width, height):\n    # 面積をreturnしてください\n    pass\n\narea = rectangle_area(3.2, 1.5)\nprint(area)\n",
      "predictPrompt": "関数の中でprint(result)だけを行いreturnを書かなかった場合、呼び出し式の値は何になりますか。",
      "practices": [
        {
          "id": "14-p1",
          "title": "円の面積を返す関数",
          "prompt": "半径 r を受け取り math.pi * r ** 2 を返す area() を作り、r=2の結果を表示しましょう。",
          "starterCode": "import math\n\ndef area(r):\n    # returnを書く\n    pass\n\nprint(area(2.0))\n",
          "hints": [
            "関数の中で return math.pi * r ** 2 とします。"
          ],
          "solution": "import math\n\ndef area(r):\n    return math.pi * r ** 2\n\nprint(area(2.0))\n",
          "check": {
            "numericOutput": 12.566370614359172,
            "tolerance": 1e-10,
            "required": [
              "def area",
              "return",
              "math.pi"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "14-p2",
          "title": "合格判定を返す関数",
          "prompt": "score が60以上ならTrueを返す passed() を作り、55と72で試しましょう。",
          "starterCode": "def passed(score):\n    pass\n\nprint(passed(55))\nprint(passed(72))\n",
          "hints": [
            "比較式 score >= 60 は、そのままTrueまたはFalseになります。"
          ],
          "solution": "def passed(score):\n    return score >= 60\n\nprint(passed(55))\nprint(passed(72))\n",
          "check": {
            "outputEquals": "False\nTrue",
            "required": [
              "def passed",
              "return"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "printとreturnの違いを、後続計算に使えるかという観点から説明してください。",
          "model": "printは表示するだけ、returnは値を呼び出し元へ返すので代入や後続計算に使える。"
        },
        {
          "question": "関数を小さく分ける利点を2つ書いてください。",
          "model": "再利用、個別テスト、読みやすさ、修正範囲の限定など。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "関数を呼ぶとNoneになる",
          "cause": "returnがない、またはprintだけを書いた",
          "fix": "呼び出し元で使う値をreturnする"
        },
        {
          "symptom": "TypeError: missing required positional argument",
          "cause": "必要な実引数を渡していない",
          "fix": "定義の仮引数数と呼び出しの実引数を対応させる"
        }
      ]
    },
    {
      "id": "15-decompose-debug",
      "session": 5,
      "order": 2,
      "track": "core",
      "minutes": 24,
      "title": "関数分割とデバッグ：小さく試して原因を絞る",
      "subtitle": "Tracebackを上から怖がらず、最後のエラー名と自分の行を見る",
      "keywords": [
        "traceback",
        "SyntaxError",
        "NameError",
        "TypeError",
        "ValueError",
        "debug",
        "test"
      ],
      "objectives": [
        "Tracebackからエラー種別と自分の行番号を読む",
        "最小の入力で関数を試す",
        "予想・実行・比較・修正の循環を行う",
        "処理を入力・計算・出力へ分ける"
      ],
      "concepts": [
        {
          "title": "エラーは診断情報",
          "body": "Tracebackの最後に例外名と説明があり、その上に問題が表面化した行があります。SyntaxErrorは実行前の文法、NameErrorは名前、TypeErrorは型の組合せ、ValueErrorは型はよいが値が不適切な場合です。",
          "code": ""
        },
        {
          "title": "小さく試す",
          "body": "大きなデータをいきなり処理せず、手計算できる2〜3要素で関数を確認します。期待値を先に書き、実際の値と比較します。",
          "code": "def mean(values):\n    return sum(values) / len(values)\n\ntest = [2, 4, 6]\nexpected = 4\nactual = mean(test)\nprint(expected, actual, expected == actual)\n"
        },
        {
          "title": "責務を分ける",
          "body": "読み込み、計算、表示を別の関数へすると、どこで誤ったか調べやすくなります。1関数が何を受け取り何を返すかを明確にします。",
          "code": ""
        }
      ],
      "liveCoding": [
        {
          "title": "NameErrorを読む",
          "instruction": "綴り違いをTracebackから特定します。",
          "code": "temperature_c = 25.0\n# 次の行の綴りを修正してください\nprint(temprature_c)\n",
          "predict": "エラー名と原因を予想してください。"
        },
        {
          "title": "境界値テスト",
          "instruction": "割引関数を59,60,61で試し、境界を確認します。",
          "code": "def discount_rate(score):\n    if score >= 60:\n        return 0.1\n    return 0.0\n\nfor test_score in [59, 60, 61]:\n    print(test_score, discount_rate(test_score))\n",
          "predict": "60の結果を予想してください。"
        }
      ],
      "starterCode": "def average(values):\n    total = 0\n    for value in values:\n        total += value\n    return total / len(value)  # バグがあります\n\nprint(average([2, 4, 6]))\n",
      "predictPrompt": "上のコードのエラー名と、修正すべき変数名を予想してください。",
      "practices": [
        {
          "id": "15-p1",
          "title": "NameErrorを直す",
          "prompt": "実行してTracebackを読み、12.5と表示されるように変数名のまちがいを直しましょう。",
          "starterCode": "dist = 25.0\ntime = 2.0\nspeed = dist / times\nprint(speed)\n",
          "hints": [
            "エラーの最後にあるNameErrorと、名前timesに注目します。",
            "定義済みなのはtimeです。"
          ],
          "solution": "dist = 25.0\ntime = 2.0\nspeed = dist / time\nprint(speed)\n",
          "check": {
            "numericOutput": 12.5,
            "tolerance": 1e-12
          },
          "difficulty": "基礎"
        },
        {
          "id": "15-p2",
          "title": "平均関数の小さなバグ",
          "prompt": "len(x)の部分を直し、平均4.0を表示しましょう。",
          "starterCode": "def mean(nums):\n    total = 0\n    for x in nums:\n        total += x\n    return total / len(x)\n\nprint(mean([2, 4, 6]))\n",
          "hints": [
            "len()へ渡したいのは、1個の値xではなくlist全体です。"
          ],
          "solution": "def mean(nums):\n    total = 0\n    for x in nums:\n        total += x\n    return total / len(nums)\n\nprint(mean([2, 4, 6]))\n",
          "check": {
            "numericOutput": 4,
            "tolerance": 1e-12,
            "required": [
              "len(nums)"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "Tracebackを読むとき、最初に確認すべき2点を書いてください。",
          "model": "最後の例外名・説明と、自分のコードの行番号。"
        },
        {
          "question": "手計算できる小さな入力で試す利点を説明してください。",
          "model": "期待値を明確にでき、アルゴリズムの誤りとデータ規模の問題を切り分けられる。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "エラーメッセージを読まずコード全体を書き換える",
          "cause": "原因の局所化をしていない",
          "fix": "例外名・行・直前の値を確認し、一度に1箇所だけ直す"
        }
      ]
    },
    {
      "id": "16-integrated",
      "session": 5,
      "order": 3,
      "track": "core",
      "minutes": 28,
      "title": "統合演習：小さなデータ解析プログラム",
      "subtitle": "変数・コンテナ・for・if・defを1本の流れへ組み合わせる",
      "keywords": [
        "integration",
        "pipeline",
        "filter",
        "function",
        "report",
        "reproducibility"
      ],
      "objectives": [
        "データと処理を分ける",
        "関数内で抽出と集計を行う",
        "f-stringで結果を報告する",
        "入力を変えて3条件を比較する"
      ],
      "concepts": [
        {
          "title": "処理の流れを設計する",
          "body": "小さなプログラムでも、入力データ→検証→計算→出力の順を意識します。変数名・関数名・単位を揃えると、後のNumPyやデータ解析へそのままつながります。",
          "code": ""
        },
        {
          "title": "一度に一つの条件を変える",
          "body": "計算科学では、結果差の原因を特定するため、比較時に変更対象以外を固定します。データ、しきい値、アルゴリズムを同時に変えないよう記録します。",
          "code": ""
        },
        {
          "title": "再現可能な記録",
          "body": "コード、入力値、しきい値、実行結果を残します。乱数を使う場合はSeedも必要です。『動いた』だけでなく、何を変えて何が変わったかを説明します。",
          "code": ""
        }
      ],
      "liveCoding": [
        {
          "title": "有効データの平均",
          "instruction": "範囲内データだけを抽出して平均します。",
          "code": "def select_valid(values, lower, upper):\n    valid = []\n    for value in values:\n        if lower <= value <= upper:\n            valid.append(value)\n    return valid\n\ndef mean(values):\n    return sum(values) / len(values)\n\nmeasurements = [9.8, 10.1, 15.0, 9.9, 10.2]\nvalid = select_valid(measurements, 9.5, 10.5)\nprint(valid)\nprint(f\"平均: {mean(valid):.3f}\")\n",
          "predict": "15.0は平均へ含まれますか。"
        },
        {
          "title": "しきい値比較",
          "instruction": "同じデータで許容範囲だけを変え、結果を比較します。",
          "code": "values = [9.4, 9.8, 10.1, 10.6]\nfor margin in [0.2, 0.5, 1.0]:\n    lower = 10.0 - margin\n    upper = 10.0 + margin\n    count = 0\n    for value in values:\n        if lower <= value <= upper:\n            count += 1\n    print(f\"margin={margin:.1f}: {count}件\")\n",
          "predict": "marginが増えると件数はどう変わりますか。"
        }
      ],
      "starterCode": "def count_above(values, threshold):\n    # threshold以上の個数を返してください\n    pass\n\nmeasurements = [2.1, 3.5, 1.8, 4.2, 3.0]\nfor threshold in [2.0, 3.0, 4.0]:\n    count = count_above(measurements, threshold)\n    print(f\"threshold={threshold:.1f}: {count}\")\n",
      "predictPrompt": "しきい値を高くしたとき、条件を満たす個数は一般にどう変わりますか。",
      "practices": [
        {
          "id": "16-p1",
          "title": "範囲内だけの平均",
          "prompt": "mean_in(nums, low, high)を作り、範囲内の値だけの平均を返しましょう。",
          "starterCode": "def mean_in(nums, low, high):\n    # ここに書く\n    pass\n\nprint(mean_in([1, 2, 100, 3], 1, 3))\n",
          "hints": [
            "空のlistを作り、low <= x <= high の値だけappendします。",
            "最後に合計を個数で割ってreturnします。"
          ],
          "solution": "def mean_in(nums, low, high):\n    keep = []\n    for x in nums:\n        if low <= x <= high:\n            keep.append(x)\n    return sum(keep) / len(keep)\n\nprint(mean_in([1, 2, 100, 3], 1, 3))\n",
          "check": {
            "numericOutput": 2,
            "tolerance": 1e-12,
            "required": [
              "def",
              "for",
              "if",
              "return"
            ]
          },
          "difficulty": "標準"
        },
        {
          "id": "16-p2",
          "title": "3つの基準を比べる",
          "prompt": "numsについて、5、10、15以上の個数をcount_ge()で数え、3行表示しましょう。",
          "starterCode": "nums = [3, 7, 11, 15, 18]\n\ndef count_ge(nums, limit):\n    count = 0\n    # ここに書く\n    return count\n\n# 5, 10, 15をforで試す\n",
          "hints": [
            "関数内では x >= limit のときcountを増やします。",
            "関数の外で for limit in [5, 10, 15]: とします。"
          ],
          "solution": "nums = [3, 7, 11, 15, 18]\n\ndef count_ge(nums, limit):\n    count = 0\n    for x in nums:\n        if x >= limit:\n            count += 1\n    return count\n\nfor limit in [5, 10, 15]:\n    print(limit, count_ge(nums, limit))\n",
          "check": {
            "outputEquals": "5 4\n10 3\n15 2",
            "required": [
              "def",
              "for",
              "if"
            ]
          },
          "difficulty": "標準"
        }
      ],
      "afterClass": [
        {
          "question": "公平な3条件比較で固定すべきものと、変えるものの例を書いてください。",
          "model": "同じ入力データと関数を固定し、しきい値だけを変える。"
        },
        {
          "question": "統合プログラムを入力・計算・出力へ分ける利点を説明してください。",
          "model": "各段階を個別に確認でき、再利用・修正・原因特定が容易になる。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "比較条件ごとに元データも変えてしまう",
          "cause": "比較の目的と制御変数が整理されていない",
          "fix": "変更する変数を1つ宣言し、他条件を固定する"
        }
      ]
    },
    {
      "id": "17-objects-memory",
      "session": 6,
      "order": 1,
      "track": "advanced",
      "minutes": 22,
      "title": "変数・参照・オブジェクトとメモリ",
      "subtitle": "Pythonでは値・型情報・機能を備えたオブジェクトを変数から参照する",
      "keywords": [
        "object",
        "reference",
        "memory",
        "id",
        "type",
        "mutable",
        "alias"
      ],
      "objectives": [
        "変数をオブジェクトへの参照として概念的に説明する",
        "同じlistを2変数から参照する別名問題を確認する",
        "typeとidを観察する",
        "Pythonの柔軟性とメモリ負荷の関係を説明する"
      ],
      "concepts": [
        {
          "title": "名前とオブジェクト",
          "body": "Pythonでは、変数名は値を直接入れる固定型の箱というより、メモリ上のオブジェクトを参照する名前として理解すると、多くの挙動を説明できます。オブジェクトは値、型情報、操作のためのメソッドなどを持ちます。実装詳細のバイト数はPython処理系や版で変わるため、概念と実測を区別します。",
          "code": "a = 10\nprint(type(a))\nprint(id(a))\n"
        },
        {
          "title": "別名参照とmutable",
          "body": "listは変更可能です。b=aとするとlistを複製せず、aとbが同じlistを参照します。bからappendするとaから見える内容も変わります。独立した浅いコピーにはa.copy()を使います。",
          "code": "a = [1, 2]\nb = a\nb.append(3)\nprint(a, b, a is b)\n\nc = a.copy()\nprint(c is a)\n"
        },
        {
          "title": "整数の大きさとオーバーフロー",
          "body": "Pythonのintは任意精度で、メモリが許す範囲で桁数を増やせます。固定幅整数のような通常のオーバーフローは起きにくい一方、桁が増えればメモリと計算時間が増えます。NumPyのint32などは固定幅なので別です。",
          "code": ""
        }
      ],
      "liveCoding": [
        {
          "title": "同じlistを参照",
          "instruction": "isと==の違い、変更の伝播を確認します。",
          "code": "a = [1, 2]\nb = a\nprint(a == b, a is b)\nb.append(3)\nprint(a)\n",
          "predict": "aは[1,2]のままですか。"
        },
        {
          "title": "copyで分ける",
          "instruction": "浅いコピー後の変更を比較します。",
          "code": "original = [1, 2]\ncopied = original.copy()\ncopied.append(3)\nprint(original)\nprint(copied)\nprint(original is copied)\n",
          "predict": "originalへ3は追加されますか。"
        }
      ],
      "starterCode": "original = [10, 20]\nalias = original\ncopy_list = original.copy()\n\nalias.append(30)\ncopy_list.append(40)\n\nprint(original)\nprint(alias)\nprint(copy_list)\nprint(original is alias)\nprint(original is copy_list)\n",
      "predictPrompt": "aliasへ30を追加したとき、originalが変わる理由を参照という語を使って説明してください。",
      "practices": [
        {
          "id": "17-p1",
          "title": "別名問題",
          "prompt": "bを変更してもaが変わらないよう、bの代入行だけを修正してください。",
          "starterCode": "a = [1, 2]\nb = a\nb.append(3)\nprint(a)\nprint(b)\n",
          "hints": [
            "listのcopy()メソッドを使います。"
          ],
          "solution": "a = [1, 2]\nb = a.copy()\nb.append(3)\nprint(a)\nprint(b)\n",
          "check": {
            "outputEquals": "[1, 2]\n[1, 2, 3]",
            "required": [
              "copy"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "17-p2",
          "title": "型とIDを観察",
          "prompt": "x=10とy=xについてtype、==、isを表示してください。結果の意味もノートへ説明します。",
          "starterCode": "x = 10\ny = x\n",
          "hints": [
            "print(type(x))、print(x==y)、print(x is y)です。"
          ],
          "solution": "x = 10\ny = x\nprint(type(x))\nprint(x == y)\nprint(x is y)\n",
          "check": {
            "outputContains": [
              "int",
              "True"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "a=[1,2]; b=aの後にb.append(3)でaも変わる理由を説明してください。",
          "model": "aとbが同じ変更可能なlistオブジェクトを参照しているため。"
        },
        {
          "question": "PythonのintとNumPyのint32でオーバーフローの扱いが異なる理由を概念的に書いてください。",
          "model": "Python intは任意精度、NumPy int32は固定32ビット幅だから。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "コピーしたつもりのlistまで変わる",
          "cause": "b=aで同じオブジェクトを参照した",
          "fix": "独立させるならcopy()、入れ子ならcopy.deepcopyも検討する"
        }
      ]
    },
    {
      "id": "18-class-oop",
      "session": 6,
      "order": 2,
      "track": "advanced",
      "minutes": 22,
      "title": "classとinstance：データと処理を一つの型へまとめる",
      "subtitle": "設計図から複数のオブジェクトを作る",
      "keywords": [
        "class",
        "instance",
        "__init__",
        "self",
        "attribute",
        "method",
        "inheritance"
      ],
      "objectives": [
        "classとinstanceの違いを説明する",
        "__init__で属性を初期化する",
        "selfを通して属性とメソッドへアクセスする",
        "手続き型とオブジェクト指向の表現を比較する"
      ],
      "concepts": [
        {
          "title": "classは設計図、instanceは個体",
          "body": "classは共通する属性と操作を定義します。実際に作られたsample_aやsample_bがinstanceです。同じclassから、異なる値を持つ複数個体を作れます。",
          "code": "class Sample:\n    def __init__(self, name, mass_g):\n        self.name = name\n        self.mass_g = mass_g\n\nsample_a = Sample(\"A\", 2.5)\nprint(sample_a.name)\n"
        },
        {
          "title": "method",
          "body": "class内の関数はmethodです。第1引数selfは呼び出し対象のinstanceを受け取ります。sample.describe()と書くと、sampleがselfへ渡されます。",
          "code": "class Sample:\n    def __init__(self, name, mass_g):\n        self.name = name\n        self.mass_g = mass_g\n\n    def describe(self):\n        return f\"{self.name}: {self.mass_g:.2f} g\"\n\nprint(Sample(\"A\", 2.5).describe())\n"
        },
        {
          "title": "継承は必要なときだけ",
          "body": "継承は既存classを基礎に拡張できますが、初学段階では複雑さも増します。『is-a』関係が明確なときに使い、単にコードを共有したいだけなら関数や合成も検討します。",
          "code": "class CalibratedSample(Sample):\n    def calibrated_mass(self, offset):\n        return self.mass_g + offset\n"
        }
      ],
      "liveCoding": [
        {
          "title": "二つのinstance",
          "instruction": "同じclassから異なる値を持つ個体を作ります。",
          "code": "class Particle:\n    def __init__(self, x, velocity):\n        self.x = x\n        self.velocity = velocity\n\n    def advance(self, dt):\n        self.x += self.velocity * dt\n\np1 = Particle(0.0, 2.0)\np2 = Particle(10.0, -1.0)\np1.advance(0.5)\np2.advance(0.5)\nprint(p1.x, p2.x)\n",
          "predict": "p1とp2の位置を予想してください。"
        },
        {
          "title": "手続きとの比較",
          "instruction": "dict+関数でも同じことができると確認し、classの利点を議論します。",
          "code": "def advance(particle, dt):\n    particle[\"x\"] += particle[\"velocity\"] * dt\n\np = {\"x\": 0.0, \"velocity\": 2.0}\nadvance(p, 0.5)\nprint(p)\n",
          "predict": "class表現では『誰が何をする』がどの部分に現れますか。"
        }
      ],
      "starterCode": "class Sensor:\n    def __init__(self, name, value):\n        # 属性を保存\n        pass\n\n    def report(self):\n        # f-stringをreturn\n        pass\n\nsensor = Sensor(\"temperature\", 23.456)\nprint(sensor.report())\n",
      "predictPrompt": "sensor.report()を呼ぶとき、selfへ何が渡されますか。",
      "practices": [
        {
          "id": "18-p1",
          "title": "小さなSample class",
          "prompt": "Sampleへnameとmassを保存し、show()で「A: 2.50 g」を返しましょう。",
          "starterCode": "class Sample:\n    def __init__(self, name, mass):\n        pass\n\n    def show(self):\n        pass\n\ns = Sample(\"A\", 2.5)\nprint(s.show())\n",
          "hints": [
            "__init__で self.name と self.mass に代入します。",
            "show()ではf-stringをreturnします。"
          ],
          "solution": "class Sample:\n    def __init__(self, name, mass):\n        self.name = name\n        self.mass = mass\n\n    def show(self):\n        return f\"{self.name}: {self.mass:.2f} g\"\n\ns = Sample(\"A\", 2.5)\nprint(s.show())\n",
          "check": {
            "outputEquals": "A: 2.50 g",
            "required": [
              "class Sample",
              "__init__",
              "self.name",
              "def show"
            ]
          },
          "difficulty": "標準"
        },
        {
          "id": "18-p2",
          "title": "カウンターを3回進める",
          "prompt": "Counterのadd()でnを1増やし、3回呼んで3を表示しましょう。",
          "starterCode": "class Counter:\n    def __init__(self):\n        self.n = 0\n\n    def add(self):\n        pass\n\nc = Counter()\nfor _ in range(3):\n    c.add()\nprint(c.n)\n",
          "hints": [
            "add()の中で self.n += 1 とします。"
          ],
          "solution": "class Counter:\n    def __init__(self):\n        self.n = 0\n\n    def add(self):\n        self.n += 1\n\nc = Counter()\nfor _ in range(3):\n    c.add()\nprint(c.n)\n",
          "check": {
            "outputEquals": "3",
            "required": [
              "self.n += 1"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "classとinstanceの違いを説明してください。",
          "model": "classは属性・メソッドの設計、instanceはその設計から作られ固有の状態を持つ個体。"
        },
        {
          "question": "selfは何を指しますか。",
          "model": "メソッドを呼び出した対象のinstance。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "TypeErrorで引数数が合わない",
          "cause": "method定義の第1引数selfを忘れた",
          "fix": "instance methodは通常def method(self, ...)とする"
        },
        {
          "symptom": "AttributeError",
          "cause": "__init__で属性を作っていない、綴りが違う",
          "fix": "self.attributeへの代入と参照名を揃える"
        }
      ]
    },
    {
      "id": "19-numpy-array",
      "session": 6,
      "order": 3,
      "track": "advanced",
      "minutes": 24,
      "title": "NumPy配列：科学計算用の同種データ",
      "subtitle": "ndarray、配列生成、shape・dtype、ベクトル化",
      "keywords": [
        "numpy",
        "ndarray",
        "array",
        "arange",
        "linspace",
        "zeros",
        "shape",
        "dtype",
        "vectorization"
      ],
      "objectives": [
        "import numpy as npを書く",
        "np.array・arange・linspaceで配列を作る",
        "shapeとdtypeを確認する",
        "配列全体へ算術演算を適用する"
      ],
      "concepts": [
        {
          "title": "listとndarray",
          "body": "Python listは異なる型を混在でき柔軟ですが、数値の大量処理では各要素の管理コストがあります。NumPy ndarrayは原則として同じdtypeのデータを連続的に扱い、ベクトル化された計算へ向きます。小さなデータ構造としてlistが不要になるわけではありません。",
          "code": "import numpy as np\nvalues = np.array([1.0, 2.0, 3.0])\nprint(values)\nprint(type(values), values.dtype, values.shape)\n"
        },
        {
          "title": "配列生成",
          "body": "np.arangeは刻み幅、np.linspaceは開始・終了を含む指定個数です。zeros、ones、fullも初期化に使います。浮動小数のarangeは丸め誤差で個数が分かりにくいことがあるため、区間分割にはlinspaceが便利です。",
          "code": "import numpy as np\nprint(np.arange(0, 10, 2))\nprint(np.linspace(0, 1, 5))\nprint(np.zeros(3))\n"
        },
        {
          "title": "ベクトル化",
          "body": "配列へ+1や**2を書くと、全要素へ一括で適用されます。内部の実装が最適化され、Pythonのforを明示するより高速かつ数式に近く書ける場合が多いです。速度は端末・サイズ・処理で変わるため、実測します。",
          "code": "import numpy as np\nx = np.linspace(0, 1, 5)\ny = 2 * x + 1\nprint(y)\n"
        }
      ],
      "liveCoding": [
        {
          "title": "配列を作って覗く",
          "instruction": "shape、dtype、先頭要素を確認します。",
          "code": "import numpy as np\nt = np.linspace(0, 2, 5)\nprint(t)\nprint(t.shape)\nprint(t.dtype)\nprint(t[:3])\n",
          "predict": "linspaceは2を含みますか。"
        },
        {
          "title": "listとの演算の違い",
          "instruction": "list*2とndarray*2を比較します。",
          "code": "import numpy as np\nlist_data = [1, 2, 3]\narray_data = np.array([1, 2, 3])\nprint(list_data * 2)\nprint(array_data * 2)\n",
          "predict": "2つの出力の意味はどう違いますか。"
        }
      ],
      "starterCode": "import numpy as np\n\n# 0から10までを6点に分けるxを作る\n# y = x**2を計算\n# x, y, shape, dtypeを表示\n",
      "predictPrompt": "[1,2,3]*2とnp.array([1,2,3])*2の出力の違いを予想してください。",
      "practices": [
        {
          "id": "19-p1",
          "title": "linspaceと式",
          "prompt": "0〜1を5点のxにし、y=3*x+2を表示してください。",
          "starterCode": "import numpy as np\n# xとyを作る\n",
          "hints": [
            "x=np.linspace(0,1,5)です。",
            "y=3*x+2です。"
          ],
          "solution": "import numpy as np\nx = np.linspace(0, 1, 5)\ny = 3 * x + 2\nprint(y)\n",
          "check": {
            "outputContains": [
              "2.",
              "5."
            ],
            "required": [
              "np.linspace",
              "3 * x + 2"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "19-p2",
          "title": "shapeとdtype",
          "prompt": "2行3列の配列を作り、shapeとdtypeを表示してください。",
          "starterCode": "import numpy as np\ndata = np.array([[1, 2, 3], [4, 5, 6]], dtype=float)\n",
          "hints": [
            "data.shapeとdata.dtypeです。"
          ],
          "solution": "import numpy as np\ndata = np.array([[1, 2, 3], [4, 5, 6]], dtype=float)\nprint(data.shape)\nprint(data.dtype)\n",
          "check": {
            "outputContains": [
              "(2, 3)",
              "float"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "np.arangeとnp.linspaceの指定方法の違いを説明してください。",
          "model": "arangeは主に刻み幅、linspaceは両端を含む点数を指定する。"
        },
        {
          "question": "ベクトル化の利点を可読性と速度の観点から書いてください。",
          "model": "配列全体の式を数式に近く短く書け、内部最適化でPythonループより高速になりやすい。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "NameError: np is not defined",
          "cause": "import numpy as npを実行していない",
          "fix": "セル/コードの先頭でimportを実行する"
        },
        {
          "symptom": "配列形状が予想と違う",
          "cause": "入れ子の括弧や行ごとの要素数が違う",
          "fix": "print(data.shape)とdataを最初に確認する"
        }
      ]
    },
    {
      "id": "20-numpy-index-ufunc",
      "session": 6,
      "order": 4,
      "track": "advanced",
      "minutes": 24,
      "title": "NumPyのスライス・集約・ブール抽出",
      "subtitle": "配列にはmathではなくnpの関数を使い、条件も一括適用する",
      "keywords": [
        "indexing",
        "slice",
        "ufunc",
        "np.sin",
        "sum",
        "mean",
        "boolean index",
        "np.where"
      ],
      "objectives": [
        "1次元・2次元配列をスライスする",
        "np.sinなどのufuncを配列へ使う",
        "sum・mean・min・maxで集約する",
        "ブールインデックスとnp.whereで条件処理する"
      ],
      "concepts": [
        {
          "title": "2次元の行・列指定",
          "body": "data[行, 列]で指定します。:はその軸のすべてです。data[:,0]は全行の0列目、data[1,:]は1行目の全列です。",
          "code": "import numpy as np\ndata = np.array([[1, 10], [2, 20], [3, 30]])\nprint(data[:, 0])\nprint(data[1, :])\n"
        },
        {
          "title": "配列にはnpの関数",
          "body": "math.sinは基本的に単一数値用です。配列全体にはnp.sin、np.sqrt、np.expなどのユニバーサル関数を使います。要素ごとに処理されます。",
          "code": "import numpy as np\ntheta = np.linspace(0, np.pi, 5)\nprint(np.sin(theta))\n"
        },
        {
          "title": "集約と条件",
          "body": "np.sum・mean・min・maxで配列を集約します。mask=data>0はbool配列で、data[mask]とすると該当要素だけ取り出せます。np.whereは条件ごとに値を選びます。",
          "code": "import numpy as np\ndata = np.array([-2, -1, 0, 1, 2])\npositive = data[data > 0]\nlabels = np.where(data >= 0, \"nonnegative\", \"negative\")\nprint(positive)\nprint(labels)\n"
        }
      ],
      "liveCoding": [
        {
          "title": "三角関数を一括計算",
          "instruction": "0〜90度のsinを配列で計算します。",
          "code": "import numpy as np\nangle_deg = np.arange(0, 91, 15)\nangle_rad = np.deg2rad(angle_deg)\nsine = np.sin(angle_rad)\nfor deg, value in zip(angle_deg, sine):\n    print(f\"{deg:2d}: {value:.3f}\")\n",
          "predict": "90度の値は理論上いくつですか。"
        },
        {
          "title": "条件抽出",
          "instruction": "平均から大きい要素だけを抽出します。",
          "code": "import numpy as np\ndata = np.array([2.1, 3.5, 1.8, 4.2, 3.0])\nmean = np.mean(data)\nselected = data[data > mean]\nprint(mean)\nprint(selected)\n",
          "predict": "selectedへ入る値を予想してください。"
        }
      ],
      "starterCode": "import numpy as np\nscores = np.array([80, 65, 100, 42, 95])\n\n# 合計、平均、最大、最小を表示\n# 60点以上だけをpassedへ抽出して表示\n# np.whereでpass/failラベルを作る\n",
      "predictPrompt": "np.array([-1,0,2,3])[data>0]に相当する結果を予想してください。",
      "practices": [
        {
          "id": "20-p1",
          "title": "ブール抽出",
          "prompt": "dataから0以上1以下の値だけを抽出してください。",
          "starterCode": "import numpy as np\ndata = np.array([-0.2, 0.0, 0.4, 1.0, 1.3])\n",
          "hints": [
            "条件は(data >= 0) & (data <= 1)です。",
            "NumPyではandでなく&を使い、各比較を括弧で囲みます。"
          ],
          "solution": "import numpy as np\ndata = np.array([-0.2, 0.0, 0.4, 1.0, 1.3])\nselected = data[(data >= 0) & (data <= 1)]\nprint(selected)\n",
          "check": {
            "outputContains": [
              "0.",
              "0.4",
              "1."
            ],
            "required": [
              "&",
              "data["
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "20-p2",
          "title": "温度を2種類に分類",
          "prompt": "tempsが25以上ならhigh、未満ならnormalとなるtagsをnp.whereで作りましょう。",
          "starterCode": "import numpy as np\ntemps = np.array([20, 25, 28, 23])\n",
          "hints": [
            "np.where(条件, Trueの値, Falseの値)の順です。"
          ],
          "solution": "import numpy as np\ntemps = np.array([20, 25, 28, 23])\ntags = np.where(temps >= 25, \"high\", \"normal\")\nprint(tags)\n",
          "check": {
            "outputContains": [
              "normal",
              "high"
            ],
            "required": [
              "np.where"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "配列へmath.sinではなくnp.sinを使う理由を説明してください。",
          "model": "np.sinは配列の全要素へ一括適用するufuncで、ベクトル化計算に対応するため。"
        },
        {
          "question": "data[data>0]の2つのdataはそれぞれ何を表しますか。",
          "model": "内側は条件からbool maskを作り、外側はそのmaskで元配列を抽出する。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "ValueError: truth value of an array is ambiguous",
          "cause": "配列条件へand/orを使った",
          "fix": "要素ごとの条件には&または|を使い、各比較を括弧で囲む"
        },
        {
          "symptom": "TypeErrorでmath.sinへ配列を渡せない",
          "cause": "スカラー用math関数を使った",
          "fix": "np.sinなどNumPy関数へ置き換える"
        }
      ]
    },
    {
      "id": "21-data-io",
      "session": 7,
      "order": 1,
      "track": "advanced",
      "minutes": 24,
      "title": "データ入出力：読んだらまずshape・dtype・先頭",
      "subtitle": "ファイルを信じる前に、構造と中身を確認する",
      "keywords": [
        "loadtxt",
        "genfromtxt",
        "delimiter",
        "skip_header",
        "shape",
        "dtype",
        "head",
        "savetxt"
      ],
      "objectives": [
        "CSVをnp.loadtxtまたはgenfromtxtで読む",
        "読み込み直後にshape・dtype・先頭5行を確認する",
        "2次元配列から列を抽出する",
        "np.savetxtで結果を書き出す"
      ],
      "concepts": [
        {
          "title": "読む→覗く",
          "body": "実データでは、列数・型・区切り・ヘッダの想定違いが多くのエラーを生みます。読み込んだ直後にdata.shape、data.dtype、data[:5]を確認する習慣を付けます。",
          "code": "import numpy as np\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\nprint(data.shape)\nprint(data.dtype)\nprint(data[:5])\n"
        },
        {
          "title": "loadtxtとgenfromtxt",
          "body": "欠損のない整った数値表にはloadtxt、欠損値を含む可能性がある場合はgenfromtxtが便利です。delimiterとskip_header/skiprowsをファイルに合わせます。",
          "code": "import numpy as np\ndata = np.genfromtxt(\"experiment_missing.csv\", delimiter=\",\", skip_header=1)\nprint(data)\n"
        },
        {
          "title": "列抽出と保存",
          "body": "2次元配列data[:,0]は全行の0列目です。列を組み直すにはnp.column_stack、テキスト保存にはnp.savetxtを使い、delimiter・header・fmtを明示します。",
          "code": "time_s = data[:, 0]\nvalue = data[:, 1]\nout = np.column_stack([time_s, value])\nnp.savetxt(\"result.csv\", out, delimiter=\",\", header=\"time_s,value\", comments=\"\")\n"
        }
      ],
      "liveCoding": [
        {
          "title": "同梱CSVを読む",
          "instruction": "アプリ内のexperiment.csvを読み、三点セットを確認します。",
          "code": "import numpy as np\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\nprint(\"shape:\", data.shape)\nprint(\"dtype:\", data.dtype)\nprint(\"head:\")\nprint(data[:5])\n",
          "predict": "列数はいくつだと予想しますか。"
        },
        {
          "title": "列を分ける",
          "instruction": "時間・測定値・温度を別配列へ取り出します。",
          "code": "import numpy as np\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\ntime_s = data[:, 0]\nvalue = data[:, 1]\ntemperature_c = data[:, 2]\nprint(time_s[:3])\nprint(value[:3])\nprint(temperature_c[:3])\n",
          "predict": "data[:,1]は何の列ですか。"
        }
      ],
      "starterCode": "import numpy as np\n\n# experiment.csvを読み込む\n# shape、dtype、先頭5行を表示\n# 0列目をtime_s、1列目をvalueへ抽出\n# valueの平均を表示\n",
      "predictPrompt": "data.shapeが(12,3)なら、data[:,1]のshapeは何ですか。",
      "practices": [
        {
          "id": "21-p1",
          "title": "読み込み三点セット",
          "prompt": "experiment.csvを読み、shape、dtype、先頭3行を表示してください。",
          "starterCode": "import numpy as np\n",
          "hints": [
            "delimiter=','、skiprows=1です。",
            "data[:3]を使います。"
          ],
          "solution": "import numpy as np\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\nprint(data.shape)\nprint(data.dtype)\nprint(data[:3])\n",
          "check": {
            "outputContains": [
              "(12, 3)",
              "float"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "21-p2",
          "title": "2列を取り出して保存",
          "prompt": "0列目をt、1列目をyへ取り出し、yを2倍した列と一緒にscaled.csvへ保存しましょう。",
          "starterCode": "import numpy as np\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\n",
          "hints": [
            "t = data[:, 0]、y = data[:, 1] とします。",
            "np.column_stack([t, 2 * y])で2列に戻せます。"
          ],
          "solution": "import numpy as np\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\nt = data[:, 0]\ny = data[:, 1]\nout = np.column_stack([t, 2 * y])\nnp.savetxt(\"scaled.csv\", out, delimiter=\",\", header=\"t,scaled_y\", comments=\"\")\nprint(out[:3])\n",
          "check": {
            "required": [
              "data[:, 0]",
              "data[:, 1]",
              "np.savetxt"
            ]
          },
          "difficulty": "標準"
        }
      ],
      "afterClass": [
        {
          "question": "データ読み込み直後に確認する三点セットを書いてください。",
          "model": "shape、dtype、先頭数行（例data[:5]）。"
        },
        {
          "question": "data[:,0]とdata[0,:]の違いを説明してください。",
          "model": "前者は全行の0列目、後者は0行目の全列。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "列数が1列になる/ValueError",
          "cause": "delimiterやヘッダ行の指定がファイルと違う",
          "fix": "ファイル先頭を確認しdelimiter、skiprowsを修正する"
        },
        {
          "symptom": "FileNotFoundError",
          "cause": "ファイル名・作業ディレクトリが違う",
          "fix": "同梱名を正確に使い、アプリのファイル一覧を確認する"
        }
      ]
    },
    {
      "id": "22-missing-save",
      "session": 7,
      "order": 2,
      "track": "advanced",
      "minutes": 22,
      "title": "欠損値・異常値・並べ替え・保存形式",
      "subtitle": "NaNを見落とさず、用途に合う形式で結果を残す",
      "keywords": [
        "NaN",
        "isnan",
        "isfinite",
        "nanmean",
        "sort",
        "argsort",
        "save",
        "load",
        "npz",
        "Dask",
        "awk"
      ],
      "objectives": [
        "NaNが通常の比較や平均へ与える影響を説明する",
        "isfinite・nanmean・ブール抽出で欠損を扱う",
        "sortとargsortを使い分ける",
        "テキストとnpy/npzの特徴を比較する"
      ],
      "concepts": [
        {
          "title": "NaNを明示的に扱う",
          "body": "NaNは欠損を表す浮動小数値です。NaNを含む通常のmeanはNaNになります。np.isnan/np.isfiniteで確認し、除外するか、意味を検討した上でnp.nanmeanなどを使います。欠損を0へ置き換えることは意味を変えるため自動では行いません。",
          "code": "import numpy as np\ndata = np.array([1.0, np.nan, 3.0])\nprint(np.mean(data))\nprint(np.nanmean(data))\nclean = data[np.isfinite(data)]\nprint(clean)\n"
        },
        {
          "title": "並べ替え",
          "body": "np.sort(data)は値を並べた新しい配列、np.argsort(data)は並び順のインデックスを返します。複数列を同じ順序で並べたいときはargsortが便利です。",
          "code": "import numpy as np\ntime = np.array([2.0, 0.0, 1.0])\nvalue = np.array([20, 0, 10])\norder = np.argsort(time)\nprint(time[order])\nprint(value[order])\n"
        },
        {
          "title": "テキストとバイナリ",
          "body": "CSVは人間・他ソフトと交換しやすい一方、型・shape・精度を別途管理します。.npyは1配列、.npzは複数配列をNumPy形式で高速・正確に保存しやすいです。巨大データでは全量をメモリへ載せないDask等、前処理にはawk等の選択肢もありますが、用途と検証を優先します。",
          "code": "np.save(\"values.npy\", data)\nrestored = np.load(\"values.npy\")\nnp.savez(\"result.npz\", time=time, value=value)\n"
        }
      ],
      "liveCoding": [
        {
          "title": "欠損CSV",
          "instruction": "genfromtxtで欠損をNaNとして読み、有限値だけで平均します。",
          "code": "import numpy as np\ndata = np.genfromtxt(\"experiment_missing.csv\", delimiter=\",\", skip_header=1)\nprint(data)\nvalues = data[:, 1]\nprint(\"欠損数:\", np.isnan(values).sum())\nprint(\"平均:\", np.nanmean(values))\n",
          "predict": "通常のnp.mean(values)はどうなりますか。"
        },
        {
          "title": "argsortで対応を保つ",
          "instruction": "時間で並べ替えながら値との対応を保ちます。",
          "code": "import numpy as np\ntime = np.array([3.0, 1.0, 2.0])\nvalue = np.array([30.0, 10.0, 20.0])\norder = np.argsort(time)\nprint(time[order])\nprint(value[order])\n",
          "predict": "valueだけをsortすると何が失われますか。"
        }
      ],
      "starterCode": "import numpy as np\ndata = np.array([2.0, np.nan, 4.0, np.inf, 6.0])\n\n# np.isfiniteで有限値だけをcleanへ抽出\n# cleanと平均を表示\n# cleanをclean.npyへ保存し、読み戻して表示\n",
      "predictPrompt": "欠損を0へ置換して平均することが、結果を歪める可能性を説明してください。",
      "practices": [
        {
          "id": "22-p1",
          "title": "有限値だけを抽出",
          "prompt": "NaNとinfを除き[1,2,3]を作って平均2.0を表示してください。",
          "starterCode": "import numpy as np\ndata = np.array([1.0, np.nan, 2.0, np.inf, 3.0])\n",
          "hints": [
            "np.isfinite(data)をmaskにします。"
          ],
          "solution": "import numpy as np\ndata = np.array([1.0, np.nan, 2.0, np.inf, 3.0])\nclean = data[np.isfinite(data)]\nprint(clean)\nprint(np.mean(clean))\n",
          "check": {
            "outputContains": [
              "[1. 2. 3.]",
              "2.0"
            ],
            "required": [
              "np.isfinite"
            ]
          },
          "difficulty": "基礎"
        },
        {
          "id": "22-p2",
          "title": "対応を保った並べ替え",
          "prompt": "xの昇順でxとyを並べ替えて表示してください。",
          "starterCode": "import numpy as np\nx = np.array([3, 1, 2])\ny = np.array([30, 10, 20])\n",
          "hints": [
            "order=np.argsort(x)です。",
            "x[order]とy[order]を使います。"
          ],
          "solution": "import numpy as np\nx = np.array([3, 1, 2])\ny = np.array([30, 10, 20])\norder = np.argsort(x)\nprint(x[order])\nprint(y[order])\n",
          "check": {
            "outputContains": [
              "[1 2 3]",
              "[10 20 30]"
            ],
            "required": [
              "np.argsort"
            ]
          },
          "difficulty": "基礎"
        }
      ],
      "afterClass": [
        {
          "question": "NaNを0へ置換する前に考えるべきことを書いてください。",
          "model": "欠損が0を意味するのか、除外・補間など何が妥当かというデータの意味。"
        },
        {
          "question": "np.sortとnp.argsortの違いを説明してください。",
          "model": "sortは並べた値、argsortは並び順を表すインデックスを返す。"
        },
        {
          "question": "CSVとnpyの長所を1つずつ書いてください。",
          "model": "CSVは交換・閲覧しやすい。npyはdtype・shape・精度を保ち高速に読み書きしやすい。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "平均がnan",
          "cause": "データにNaNが含まれる",
          "fix": "isnan/isfiniteで確認し、意味に応じて除外・nanmean等を使う"
        },
        {
          "symptom": "xとyの対応が崩れる",
          "cause": "各列を別々にsortした",
          "fix": "1列のargsortを共通インデックスとして全列へ適用する"
        }
      ]
    },
    {
      "id": "23-matplotlib",
      "session": 7,
      "order": 3,
      "track": "advanced",
      "minutes": 28,
      "title": "Matplotlib：データを正しく可視化する",
      "subtitle": "図の種類を選び、軸ラベル・単位・凡例・タイトルを必ず整える",
      "keywords": [
        "matplotlib",
        "pyplot",
        "plot",
        "scatter",
        "hist",
        "bar",
        "xlabel",
        "ylabel",
        "legend",
        "subplots",
        "savefig"
      ],
      "objectives": [
        "折れ線・散布図・ヒストグラムを使い分ける",
        "軸ラベルと単位を付ける",
        "凡例・タイトル・gridを適切に追加する",
        "subplotsとsavefigを使う",
        "数値要約だけでなく外れ値・分布を図で確認する"
      ],
      "concepts": [
        {
          "title": "図の種類を目的で選ぶ",
          "body": "時間順の連続変化にはplot、2変数の関係にはscatter、1変数の分布にはhist、カテゴリ比較にはbarが基本です。点を線で結ぶことに意味がないデータへplotを使うと、存在しない連続性を示すことがあります。",
          "code": "import matplotlib.pyplot as plt\nplt.plot([0, 1, 2], [1, 3, 2], marker=\"o\")\nplt.show()\n"
        },
        {
          "title": "軸ラベルと単位",
          "body": "第三者へ見せる図には、何の量かと単位をxlabel・ylabelで明示します。title、legend、gridは情報を増やす場合に使います。軸範囲や対数軸も結論へ影響するため、恣意的に切り取らず説明します。",
          "code": "plt.xlabel(\"Time [s]\")\nplt.ylabel(\"Position [m]\")\nplt.title(\"Position versus time\")\nplt.grid(alpha=0.3)\n"
        },
        {
          "title": "subplotsと保存",
          "body": "fig, ax = plt.subplots()のオブジェクト指向形式は複数図でも整理しやすいです。fig.savefig()でPNG等へ保存し、tight_layoutで重なりを軽減します。アプリでは生成図が実行結果へ表示されます。",
          "code": "fig, axes = plt.subplots(1, 2, figsize=(8, 3))\naxes[0].plot([0,1], [0,1])\naxes[1].hist([1,1,2,3,3,3])\nfig.tight_layout()\nfig.savefig(\"figure.png\", dpi=150)\n"
        },
        {
          "title": "数値だけを信じない",
          "body": "平均や相関係数が同じでも、外れ値・非線形・群構造が異なることがあります。必ず元データの図も確認し、軸・単位・点数・欠損処理を明記します。見栄えのよさは正しさの証明ではありません。",
          "code": ""
        }
      ],
      "liveCoding": [
        {
          "title": "実験データの折れ線",
          "instruction": "CSVを読み、時間変化を軸単位付きで描きます。",
          "code": "import numpy as np\nimport matplotlib.pyplot as plt\n\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\ntime_s = data[:, 0]\nvalue = data[:, 1]\n\nfig, ax = plt.subplots(figsize=(6, 4))\nax.plot(time_s, value, marker=\"o\", label=\"measurement\")\nax.set_xlabel(\"Time [s]\")\nax.set_ylabel(\"Response [a.u.]\")\nax.set_title(\"Response versus time\")\nax.grid(alpha=0.3)\nax.legend()\nfig.tight_layout()\nplt.show()\n",
          "predict": "横軸と縦軸が何を表すか説明してください。"
        },
        {
          "title": "散布図とヒストグラム",
          "instruction": "2つの図を横に並べます。",
          "code": "import numpy as np\nimport matplotlib.pyplot as plt\n\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\nvalue = data[:, 1]\ntemperature = data[:, 2]\n\nfig, axes = plt.subplots(1, 2, figsize=(8, 3.5))\naxes[0].scatter(temperature, value)\naxes[0].set_xlabel(\"Temperature [degC]\")\naxes[0].set_ylabel(\"Response [a.u.]\")\naxes[1].hist(value, bins=6, edgecolor=\"black\")\naxes[1].set_xlabel(\"Response [a.u.]\")\naxes[1].set_ylabel(\"Count\")\nfig.tight_layout()\nplt.show()\n",
          "predict": "散布図とヒストグラムはそれぞれ何を調べますか。"
        }
      ],
      "starterCode": "import numpy as np\nimport matplotlib.pyplot as plt\n\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\ntime_s = data[:, 0]\nvalue = data[:, 1]\n\nfig, ax = plt.subplots(figsize=(6, 4))\n# 折れ線と点を描く\n# x軸・y軸ラベル（単位付き）、タイトル、gridを設定\nfig.tight_layout()\nplt.show()\n",
      "predictPrompt": "2変数の関係を調べるのにhistではなくscatterが適する理由を説明してください。",
      "practices": [
        {
          "id": "23-p1",
          "title": "ラベル付き折れ線",
          "prompt": "x=[0,1,2,3]、y=[0,1,4,9]を折れ線で描き、軸ラベルTime [s]とDistance [m]、タイトルを付けてください。",
          "starterCode": "import matplotlib.pyplot as plt\nx = [0, 1, 2, 3]\ny = [0, 1, 4, 9]\n",
          "hints": [
            "fig,ax=plt.subplots()を作ります。",
            "ax.plot、set_xlabel、set_ylabel、set_title、plt.showです。"
          ],
          "solution": "import matplotlib.pyplot as plt\nx = [0, 1, 2, 3]\ny = [0, 1, 4, 9]\nfig, ax = plt.subplots()\nax.plot(x, y, marker=\"o\")\nax.set_xlabel(\"Time [s]\")\nax.set_ylabel(\"Distance [m]\")\nax.set_title(\"Distance versus time\")\nax.grid(alpha=0.3)\nfig.tight_layout()\nplt.show()\n",
          "check": {
            "required": [
              "plot",
              "set_xlabel",
              "set_ylabel",
              "set_title",
              "plt.show"
            ]
          },
          "difficulty": "標準"
        },
        {
          "id": "23-p2",
          "title": "同じデータを2つの見方で描く",
          "prompt": "valsをhistと、番号対valsのscatterで横に並べ、各軸へラベルを付けましょう。",
          "starterCode": "import numpy as np\nimport matplotlib.pyplot as plt\nvals = np.array([2.1, 2.4, 2.2, 3.0, 2.8, 2.3])\n",
          "hints": [
            "fig, axes = plt.subplots(1, 2, ...)で2つのAxesを作ります。",
            "scatterの横軸にはnp.arange(len(vals))を使えます。"
          ],
          "solution": "import numpy as np\nimport matplotlib.pyplot as plt\nvals = np.array([2.1, 2.4, 2.2, 3.0, 2.8, 2.3])\nfig, axes = plt.subplots(1, 2, figsize=(8, 3))\naxes[0].hist(vals, bins=4, edgecolor=\"black\")\naxes[0].set_xlabel(\"Value [a.u.]\")\naxes[0].set_ylabel(\"Count\")\naxes[1].scatter(np.arange(len(vals)), vals)\naxes[1].set_xlabel(\"Index\")\naxes[1].set_ylabel(\"Value [a.u.]\")\nfig.tight_layout()\nplt.show()\n",
          "check": {
            "required": [
              "subplots(1, 2",
              "hist",
              "scatter",
              "set_xlabel",
              "set_ylabel"
            ]
          },
          "difficulty": "発展"
        }
      ],
      "afterClass": [
        {
          "question": "plot・scatter・histの基本的な用途をそれぞれ書いてください。",
          "model": "plotは順序ある連続変化、scatterは2変数関係、histは1変数分布。"
        },
        {
          "question": "軸ラベルに単位が必要な理由を説明してください。",
          "model": "数値の尺度と物理的意味を第三者が解釈・比較できるようにするため。"
        },
        {
          "question": "相関係数だけでなく散布図も確認すべき理由を書いてください。",
          "model": "外れ値、非線形、群構造など、単一統計量が隠す形を確認するため。"
        }
      ],
      "commonErrors": [
        {
          "symptom": "図は出るが意味が分からない",
          "cause": "軸ラベル・単位・タイトルがない",
          "fix": "xlabel/ylabelへ量名と単位を明記する"
        },
        {
          "symptom": "複数図の文字が重なる",
          "cause": "レイアウト調整がない",
          "fix": "fig.tight_layout()を呼ぶ、figsizeを調整する"
        },
        {
          "symptom": "点を線で結び誤解を招く",
          "cause": "カテゴリ/独立観測へplotを使った",
          "fix": "関係に応じてscatterやbarを選ぶ"
        }
      ]
    }
  ],
  "glossary": [
    [
      "argument / 実引数",
      "関数を呼び出すときに実際に渡す値。"
    ],
    [
      "attribute / 属性",
      "オブジェクトの中に名前付きで保持される情報。メソッドも属性の一種として扱われる。"
    ],
    [
      "bool",
      "TrueまたはFalseを表す型。比較式の結果。"
    ],
    [
      "branch / 分岐",
      "条件に応じて異なる処理経路を選ぶこと。"
    ],
    [
      "container",
      "複数の値を保持するlist・dict・tupleなどのデータ構造。"
    ],
    [
      "dtype",
      "NumPy配列の要素型。float64、int64など。"
    ],
    [
      "function / 関数",
      "入力を受け取り処理し、必要に応じて値を返す再利用可能なまとまり。"
    ],
    [
      "index",
      "順序付きデータの位置。Pythonは0始まり。"
    ],
    [
      "instance",
      "classという設計から作られた個別のオブジェクト。"
    ],
    [
      "iteration / 反復",
      "同じ規則を複数回または複数要素へ適用すること。"
    ],
    [
      "method",
      "オブジェクトに備わる操作。obj.method()の形で呼ぶ。"
    ],
    [
      "module / モジュール",
      "関連する変数・関数・classをまとめたPythonコード。importして使う。"
    ],
    [
      "NaN",
      "Not a Number。浮動小数配列で欠損などを表す値。"
    ],
    [
      "ndarray",
      "NumPyの多次元配列型。"
    ],
    [
      "object",
      "Pythonで扱う、値・型情報・操作などを持つ実体。"
    ],
    [
      "parameter / 仮引数",
      "関数定義側で入力を受け取る名前。"
    ],
    [
      "reference / 参照",
      "変数名からオブジェクトへ結び付く関係。"
    ],
    [
      "return",
      "関数から呼び出し元へ値を返し、その時点で関数を終了する命令。"
    ],
    [
      "scope",
      "変数名を参照できる範囲。"
    ],
    [
      "shape",
      "NumPy配列の各軸の長さ。例：(100, 3)。"
    ],
    [
      "slice",
      "start:stop:stepで連続範囲を取り出す操作。stopは含まない。"
    ],
    [
      "vectorization / ベクトル化",
      "配列全体への演算として記述し、要素ループを内部の最適化された処理へ任せること。"
    ]
  ],
  "cheatsheet": [
    {
      "title": "変数と出力",
      "code": "x = 3.5\nname = \"A\"\nprint(x)\nprint(f\"{name}: {x:.2f} m\")"
    },
    {
      "title": "list・dict・tuple",
      "code": "values = [1, 2, 3]\nvalues.append(4)\nrecord = {\"id\": 1, \"value\": 2.5}\npoint = (3.0, 4.0)\nx, y = point"
    },
    {
      "title": "math・for・if",
      "code": "import math\nfor deg in range(0, 91, 30):\n    value = math.sin(math.radians(deg))\n    if value >= 0.5:\n        print(deg, value)"
    },
    {
      "title": "関数",
      "code": "def mean(values):\n    return sum(values) / len(values)\n\nresult = mean([1, 2, 3])"
    },
    {
      "title": "NumPy",
      "code": "import numpy as np\nx = np.linspace(0, 1, 5)\ny = np.sin(2 * np.pi * x)\nselected = y[y > 0]\nprint(y.mean())"
    },
    {
      "title": "データ読み込み",
      "code": "data = np.loadtxt(\"data.csv\", delimiter=\",\", skiprows=1)\nprint(data.shape, data.dtype, data[:5])\nx = data[:, 0]\ny = data[:, 1]"
    },
    {
      "title": "Matplotlib",
      "code": "import matplotlib.pyplot as plt\nfig, ax = plt.subplots()\nax.scatter(x, y)\nax.set_xlabel(\"X [unit]\")\nax.set_ylabel(\"Y [unit]\")\nfig.tight_layout()\nplt.show()"
    }
  ],
  "classroomPrinciples": [
    "実行前に予想し、実行後に結果と照合する",
    "一度に変更する条件を一つに絞る",
    "値だけでなく、変数の意味・単位・仮定を記録する",
    "エラー名・行番号・直前の値を読み、原因を局所化する",
    "AIが生成したコードも、説明・変更・検証できて初めて学習成果とする",
    "コード・入力条件・必要なら乱数Seedを残し、結果を再現できるようにする"
  ]
};
