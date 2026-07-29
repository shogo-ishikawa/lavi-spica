export const LESSON_EXPLANATIONS = {
  "01-variables": {
    "overview": [
      "変数は、値をしまう箱というよりも、Pythonが作った値へ付ける名札だと考えると理解しやすくなります。変数名を使うと、同じ値を何度も書かずに再利用でき、数値や文字列の役割もコードから読み取れます。",
      "代入文では必ず右辺が先に評価されます。x = x + 1 の左右に同じxがあっても、右辺のxは更新前の値です。計算が終わった後、その結果が左辺のxへ結び付けられます。型は変数名ではなく値に属するため、同じ変数名へ別の型の値を代入することも文法上は可能です。"
    ],
    "anatomy": [
      {
        "part": "左辺 x",
        "meaning": "計算結果を後から参照するための名前です。"
      },
      {
        "part": "=",
        "meaning": "等しいという比較ではなく、右辺の結果を左辺へ代入する記号です。"
      },
      {
        "part": "右辺 3 + 4",
        "meaning": "先に評価される式です。ここでは7になります。"
      },
      {
        "part": "type(x)",
        "meaning": "xが参照している値の型を確認します。"
      }
    ],
    "trace": {
      "title": "代入を一行ずつ追う",
      "code": "x = 2\nx = x + 3\ny = x * 2\nprint(y)\n",
      "rows": [
        [
          "1行目",
          "x = 2",
          "整数2をxから参照できるようにする"
        ],
        [
          "2行目",
          "x = 5",
          "更新前のx=2を読み、2+3の結果5を再代入する"
        ],
        [
          "3行目",
          "y = 10",
          "x=5を使って5×2を計算し、yへ代入する"
        ],
        [
          "4行目",
          "10を表示",
          "yが参照する値をprint()へ渡す"
        ]
      ]
    },
    "checklist": [
      "右辺を先に読む",
      "変数名の綴りと大文字・小文字をそろえる",
      "数値と文字列を引用符で区別する",
      "意味が長く残る値には役割の分かる名前を付ける"
    ]
  },
  "02-print": {
    "overview": [
      "print()は計算そのものを行う命令ではなく、プログラム内部の値を人間が観察できる形へ出す関数です。最終結果だけでなく途中の値も表示すると、どの行から期待と違ったかを切り分けられます。",
      "丸括弧の中へ渡す値を引数と呼びます。複数の値はカンマで区切り、sepで値どうしの区切り、endで行末を指定できます。読み手が値の意味を判断できるよう、ラベルや単位も一緒に表示する習慣が重要です。"
    ],
    "anatomy": [
      {
        "part": "print(",
        "meaning": "表示処理を始める関数名と開き括弧です。"
      },
      {
        "part": "\"x =\", x",
        "meaning": "文字列のラベルと変数の値を、2つの引数として渡します。"
      },
      {
        "part": "sep=\" / \"",
        "meaning": "複数引数の間へ置く文字を変更します。"
      },
      {
        "part": "end=\"\"",
        "meaning": "通常の改行を別の文字へ変更します。"
      }
    ],
    "trace": {
      "title": "途中の値を観察する",
      "code": "x = 4\nprint(\"before:\", x)\nx = x * 3\nprint(\"after:\", x)\n",
      "rows": [
        [
          "1行目",
          "x=4",
          "計算に使う初期値を用意する"
        ],
        [
          "2行目",
          "before: 4",
          "更新前の値を確認する"
        ],
        [
          "3行目",
          "x=12",
          "4×3を計算して更新する"
        ],
        [
          "4行目",
          "after: 12",
          "更新後の値を確認する"
        ]
      ]
    },
    "checklist": [
      "表示したい値を括弧内へ渡す",
      "数値の意味や単位をラベルで示す",
      "sepとendは必要なときだけ使う",
      "デバッグでは処理の前後にprint()を置く"
    ]
  },
  "03-fstrings": {
    "overview": [
      "f-stringは、文章の中へ変数や式の結果を埋め込む書き方です。引用符の直前へfを置き、値を入れたい位置を波括弧で囲みます。文字列の連結より短く、何を表示するコードなのか読み取りやすくなります。",
      "波括弧の中はPythonの式として評価されます。:.2fや:.1%などの書式指定は表示方法だけを変え、元の変数に保存された値は変更しません。表示精度と計算精度を混同しないことが大切です。"
    ],
    "anatomy": [
      {
        "part": "f\"...\"",
        "meaning": "fを引用符の直前へ付け、埋め込み可能な文字列を作ります。"
      },
      {
        "part": "{name}",
        "meaning": "変数nameの値をその位置へ挿入します。"
      },
      {
        "part": "{x + 1}",
        "meaning": "波括弧内では式も計算できます。"
      },
      {
        "part": "{x:.2f}",
        "meaning": "xを小数点以下2桁で表示します。保存値は変わりません。"
      }
    ],
    "trace": {
      "title": "計算値を文章へ埋め込む",
      "code": "n = 3\nr = 2 / 3\nmsg = f\"試行{n}回、割合{r:.1%}\"\nprint(msg)\n",
      "rows": [
        [
          "1行目",
          "n=3",
          "整数を用意する"
        ],
        [
          "2行目",
          "r≈0.6667",
          "割合の元になる値を計算する"
        ],
        [
          "3行目",
          "文字列を作成",
          "nをそのまま、rを66.7%として埋め込む"
        ],
        [
          "4行目",
          "試行3回、割合66.7%",
          "完成した文字列を表示する"
        ]
      ]
    },
    "checklist": [
      "引用符の前にfがあるか確認する",
      "埋め込みたい式を半角の{}で囲む",
      "桁指定は表示だけを変えると理解する",
      "単位やラベルを文字列側へ書く"
    ]
  },
  "04-list": {
    "overview": [
      "listは、複数の値を順序付きでまとめるデータ型です。要素の位置は0から数えるため、最初の要素は[0]です。後から要素を追加・変更・削除できるので、観測値や得点のように増減する並びに向きます。",
      "スライス[start:stop]はstartを含み、stopを含まない半開区間です。この規則により、取り出した要素数をstop-startで考えやすくなります。負のindexは末尾から数えるため、[-1]は最後の要素です。"
    ],
    "anatomy": [
      {
        "part": "[10, 20, 30]",
        "meaning": "角括弧で順序付きの要素をまとめます。"
      },
      {
        "part": "xs[0]",
        "meaning": "先頭の要素を取り出します。indexは0始まりです。"
      },
      {
        "part": "xs[1:3]",
        "meaning": "位置1と2を取り出し、stopの3は含みません。"
      },
      {
        "part": "xs.append(40)",
        "meaning": "listの末尾へ要素を追加し、list自体を変更します。"
      }
    ],
    "trace": {
      "title": "listを更新する",
      "code": "xs = [4, 7]\nxs.append(2)\nxs[0] = 5\nprint(xs[-1])\n",
      "rows": [
        [
          "1行目",
          "[4, 7]",
          "2要素のlistを作る"
        ],
        [
          "2行目",
          "[4, 7, 2]",
          "末尾へ2を追加する"
        ],
        [
          "3行目",
          "[5, 7, 2]",
          "位置0の値を5へ変更する"
        ],
        [
          "4行目",
          "2",
          "-1で最後の要素を取り出す"
        ]
      ]
    },
    "checklist": [
      "indexは0から数える",
      "stop位置は含まれない",
      "範囲外のindexを使わない",
      "append()の戻り値を変数へ再代入しない"
    ]
  },
  "05-dict": {
    "overview": [
      "dictは、キーと値の対応を保存するデータ型です。listの位置ではなく、\"mass\"や\"name\"のようなキーで値を取り出すため、各値の意味をコードに残せます。異なる種類の情報を1件の記録としてまとめる場面に向きます。",
      "角括弧で存在しないキーを読むとKeyErrorになります。未登録が正常に起こり得る場合はget()で既定値を指定します。キーは重複できず、同じキーへ代入すると値が更新されます。"
    ],
    "anatomy": [
      {
        "part": "{\"id\": 3, \"mass\": 2.5}",
        "meaning": "キーと値をコロンで結び、項目をカンマで区切ります。"
      },
      {
        "part": "d[\"mass\"]",
        "meaning": "キーmassに対応する値を取り出します。"
      },
      {
        "part": "d[\"mass\"] = 2.7",
        "meaning": "同じキーの値を更新します。"
      },
      {
        "part": "d.get(\"temp\", \"未測定\")",
        "meaning": "キーがなければ既定値を返し、KeyErrorを避けます。"
      }
    ],
    "trace": {
      "title": "記録を更新する",
      "code": "d = {\"name\": \"A\", \"score\": 70}\nd[\"score\"] += 5\nd[\"ok\"] = True\nprint(d.get(\"note\", \"なし\"))\n",
      "rows": [
        [
          "1行目",
          "2項目のdict",
          "nameとscoreを保存する"
        ],
        [
          "2行目",
          "score=75",
          "既存キーの値を更新する"
        ],
        [
          "3行目",
          "ok=Trueを追加",
          "新しいキーと値を追加する"
        ],
        [
          "4行目",
          "なし",
          "noteがないため既定値を表示する"
        ]
      ]
    },
    "checklist": [
      "キーの綴りを正確にそろえる",
      "キーと値の役割を区別する",
      "未登録があり得るときはget()を検討する",
      "複数件の記録はdictのlistとしてまとめられる"
    ]
  },
  "06-tuple": {
    "overview": [
      "tupleはlistと同じく順序付きのデータですが、作成後に要素を変更できません。座標、RGB値、関数が返す複数の結果など、ひとまとまりとして扱い、途中で書き換えない組に向きます。",
      "tupleを複数の変数へ一度に分ける操作をアンパックと呼びます。1要素tupleでは括弧よりも末尾のカンマが本体で、(5,)と書く必要があります。"
    ],
    "anatomy": [
      {
        "part": "p = (3, 4)",
        "meaning": "2要素のtupleを作ります。"
      },
      {
        "part": "x, y = p",
        "meaning": "順番に対応させて2つの変数へアンパックします。"
      },
      {
        "part": "(5,)",
        "meaning": "1要素tupleです。カンマが必要です。"
      },
      {
        "part": "p[0]",
        "meaning": "読み出しはlistと同じindexを使いますが、代入による変更はできません。"
      }
    ],
    "trace": {
      "title": "座標をアンパックする",
      "code": "p = (3, 4)\nx, y = p\nr2 = x ** 2 + y ** 2\nprint(r2)\n",
      "rows": [
        [
          "1行目",
          "p=(3,4)",
          "座標を変更しない組として保存する"
        ],
        [
          "2行目",
          "x=3, y=4",
          "順番にアンパックする"
        ],
        [
          "3行目",
          "r2=25",
          "原点からの距離の2乗を計算する"
        ],
        [
          "4行目",
          "25",
          "計算結果を表示する"
        ]
      ]
    },
    "checklist": [
      "変更しない組にはtupleを検討する",
      "アンパックする変数数を要素数と合わせる",
      "1要素tupleにはカンマを付ける",
      "変更が必要ならlistを選ぶ"
    ]
  },
  "07-methods": {
    "overview": [
      "関数はprint(x)のように名前へ値を渡して呼び出し、メソッドはxs.append(3)のようにオブジェクトの後ろへドットを付けて呼び出します。メソッドは、そのデータ型に用意された操作です。",
      "操作には、元のオブジェクトを変更するものと、新しい値を返すものがあります。list.append()はlistを変更して戻り値はNone、str.upper()は元の文字列を変えずに新しい文字列を返します。この違いを確認せず再代入すると、値を失うことがあります。"
    ],
    "anatomy": [
      {
        "part": "len(xs)",
        "meaning": "独立した関数へxsを引数として渡します。"
      },
      {
        "part": "xs.append(3)",
        "meaning": "xsというlistに備わるappendメソッドを呼び出します。"
      },
      {
        "part": "text.upper()",
        "meaning": "大文字化した新しいstrを返します。元のtextは変わりません。"
      },
      {
        "part": "dir(obj)",
        "meaning": "そのオブジェクトで使える属性やメソッド名を確認します。"
      }
    ],
    "trace": {
      "title": "変更と戻り値を見分ける",
      "code": "xs = [1, 2]\nr = xs.append(3)\ntext = \"spica\"\nup = text.upper()\nprint(xs, r, text, up)\n",
      "rows": [
        [
          "1行目",
          "xs=[1,2]",
          "listを用意する"
        ],
        [
          "2行目",
          "xs=[1,2,3], r=None",
          "appendは元を変更し、値を返さない"
        ],
        [
          "3行目",
          "text=\"spica\"",
          "strを用意する"
        ],
        [
          "4行目",
          "up=\"SPICA\"",
          "upperは新しいstrを返し、textはそのまま"
        ]
      ]
    },
    "checklist": [
      "obj.method()の形を見つける",
      "元を変更するか戻り値を返すか確認する",
      "戻り値がNoneのメソッドを再代入しない",
      "不明なときは小さな例とprint()で確かめる"
    ]
  },
  "08-math": {
    "overview": [
      "mathはPython標準ライブラリの数学関数をまとめたモジュールです。import mathと書くと、math.piやmath.sqrt()のように名前空間を明示して使えます。どのモジュールの機能かが分かるため、コードの読み違いを減らせます。",
      "三角関数の角度はラジアンで渡します。度数法の角度はmath.radians()で変換してからmath.sin()などへ渡します。またsqrtへ負数を渡すなど、関数の定義域から外れる入力にも注意が必要です。"
    ],
    "anatomy": [
      {
        "part": "import math",
        "meaning": "mathモジュールを読み込みます。"
      },
      {
        "part": "math.pi",
        "meaning": "円周率の定数を参照します。"
      },
      {
        "part": "math.sqrt(x)",
        "meaning": "xの平方根を計算します。"
      },
      {
        "part": "math.sin(math.radians(deg))",
        "meaning": "度をラジアンへ直してからsinを計算します。"
      }
    ],
    "trace": {
      "title": "30度のsinを求める",
      "code": "import math\ndeg = 30\nrad = math.radians(deg)\ny = math.sin(rad)\nprint(y)\n",
      "rows": [
        [
          "1行目",
          "mathを利用可能にする",
          "標準モジュールを読み込む"
        ],
        [
          "2行目",
          "deg=30",
          "度数法の角度を用意する"
        ],
        [
          "3行目",
          "rad≈0.5236",
          "30度をラジアンへ変換する"
        ],
        [
          "4行目",
          "y≈0.5",
          "sinを計算する"
        ],
        [
          "5行目",
          "0.5付近を表示",
          "浮動小数点誤差を含む場合がある"
        ]
      ]
    },
    "checklist": [
      "先にimportする",
      "math.を付けて機能を呼ぶ",
      "角度の単位を確認する",
      "定義域と単位をコメントや変数名で残す"
    ]
  },
  "09-range": {
    "overview": [
      "rangeは、for文で繰り返す整数の並びを表します。range(stop)、range(start, stop)、range(start, stop, step)の3形があり、stopは含まれません。要素をすべて保存するlistではなく、必要に応じて整数を生み出す範囲オブジェクトです。",
      "stepが正ならstartから増え、負なら減ります。開始値と終了値の方向にstepが合っていないと空になります。境界を決めるときは、最初の値・最後に含めたい値・stopの3つを紙に書くと誤りを減らせます。"
    ],
    "anatomy": [
      {
        "part": "range(5)",
        "meaning": "0,1,2,3,4を表します。"
      },
      {
        "part": "range(2, 6)",
        "meaning": "2,3,4,5を表し、6は含みません。"
      },
      {
        "part": "range(2, 11, 3)",
        "meaning": "2から3ずつ増やし、2,5,8を表します。"
      },
      {
        "part": "range(5, 0, -1)",
        "meaning": "5から1まで1ずつ減らします。"
      }
    ],
    "trace": {
      "title": "rangeの境界を追う",
      "code": "r = range(2, 9, 2)\nprint(list(r))\nprint(len(r))\n",
      "rows": [
        [
          "1行目",
          "2から9未満、2刻み",
          "候補は2,4,6,8"
        ],
        [
          "2行目",
          "[2,4,6,8]",
          "確認のためlistへ変換して表示する"
        ],
        [
          "3行目",
          "4",
          "rangeに含まれる整数の個数を表示する"
        ]
      ]
    },
    "checklist": [
      "stopは含まれない",
      "stepの符号と進む方向を合わせる",
      "最初と最後の値を手で確認する",
      "普段のforではlistへ変換する必要はない"
    ]
  },
  "10-for": {
    "overview": [
      "for文は、並びから要素を1つずつ取り出し、同じ処理を繰り返します。for x in xs: の各反復でxが次の要素を参照し、インデントされた本体が実行されます。繰り返し回数だけでなく、データそのものを順に処理できることが重要です。",
      "合計や個数を求めるときは、累積変数をforの外で初期化し、内側で更新します。初期化を内側へ置くと毎回0へ戻り、最後の要素だけを反映した結果になりやすいので注意します。"
    ],
    "anatomy": [
      {
        "part": "for x in xs:",
        "meaning": "xsの要素を順にxへ代入して繰り返します。末尾にコロンが必要です。"
      },
      {
        "part": "    print(x)",
        "meaning": "半角スペースによるインデントがfor本体を示します。"
      },
      {
        "part": "total = 0",
        "meaning": "合計の初期値をループの前へ置きます。"
      },
      {
        "part": "total += x",
        "meaning": "各要素を現在の合計へ加えます。"
      }
    ],
    "trace": {
      "title": "合計を作る",
      "code": "total = 0\nfor x in [2, 5, 3]:\n    total += x\n    print(x, total)\nprint(\"sum\", total)\n",
      "rows": [
        [
          "開始前",
          "total=0",
          "累積変数を初期化する"
        ],
        [
          "1回目",
          "x=2, total=2",
          "2を加える"
        ],
        [
          "2回目",
          "x=5, total=7",
          "5を加える"
        ],
        [
          "3回目",
          "x=3, total=10",
          "3を加える"
        ],
        [
          "終了後",
          "sum 10",
          "インデント外は1回だけ実行する"
        ]
      ]
    },
    "checklist": [
      "コロンを付ける",
      "本体のインデント幅をそろえる",
      "累積変数はループ前で初期化する",
      "ループ後に必要な処理はインデントを戻す"
    ]
  },
  "11-conditions": {
    "overview": [
      "比較式はTrueまたはFalseというbool値を作ります。==、!=、<、<=、>、>=を使い、複数の条件はand、or、notで組み合わせます。条件式をまず単独でprint()すると、分岐へ入る前に境界の理解を確認できます。",
      "andは両方がTrue、orは少なくとも一方がTrue、notは真偽を反転します。0 <= x < 10のような連鎖比較は、xが範囲内かを読みやすく表せます。=と==の役割を混同しないことが最重要です。"
    ],
    "anatomy": [
      {
        "part": "x == 3",
        "meaning": "xと3が等しいか比較し、boolを返します。"
      },
      {
        "part": "0 <= x < 10",
        "meaning": "xが0以上10未満かを一度に表します。"
      },
      {
        "part": "a and b",
        "meaning": "aとbの両方がTrueのときだけTrueです。"
      },
      {
        "part": "not rain",
        "meaning": "rainの真偽を反転します。"
      }
    ],
    "trace": {
      "title": "条件を分解して読む",
      "code": "x = 8\na = x >= 5\nb = x < 10\nok = a and b\nprint(a, b, ok)\n",
      "rows": [
        [
          "1行目",
          "x=8",
          "判定対象を用意する"
        ],
        [
          "2行目",
          "a=True",
          "8は5以上"
        ],
        [
          "3行目",
          "b=True",
          "8は10未満"
        ],
        [
          "4行目",
          "ok=True",
          "両方TrueなのでandもTrue"
        ],
        [
          "5行目",
          "True True True",
          "各段階を表示する"
        ]
      ]
    },
    "checklist": [
      "代入=と比較==を区別する",
      "境界値を含むかで<と<=を選ぶ",
      "複雑な条件は変数へ分けて確認する",
      "and/or/notを日本語へ言い換える"
    ]
  },
  "12-if": {
    "overview": [
      "if文は、条件がTrueのときだけインデントされた処理を実行します。elifとelseを続けると複数の経路から1つを選べます。上から順に判定し、最初にTrueになった枝だけを実行する点が重要です。",
      "広い条件を先に置くと、後ろの細かい条件へ到達しません。例えばscore >= 60をscore >= 90より先へ置くと、95点でも最初の枝に入ります。境界値の直前・ちょうど・直後を試し、すべての経路で必要な変数が定義されるか確認します。"
    ],
    "anatomy": [
      {
        "part": "if 条件:",
        "meaning": "最初の条件がTrueなら本体を実行します。"
      },
      {
        "part": "elif 条件:",
        "meaning": "それ以前がFalseだったときだけ次の条件を調べます。"
      },
      {
        "part": "else:",
        "meaning": "どの条件にも当てはまらない残りを処理します。"
      },
      {
        "part": "インデント",
        "meaning": "各分岐に属する処理範囲を示します。"
      }
    ],
    "trace": {
      "title": "分岐の順序を追う",
      "code": "score = 84\nif score >= 90:\n    grade = \"A\"\nelif score >= 70:\n    grade = \"B\"\nelse:\n    grade = \"C\"\nprint(grade)\n",
      "rows": [
        [
          "if",
          "84>=90はFalse",
          "Aの枝を飛ばす"
        ],
        [
          "elif",
          "84>=70はTrue",
          "gradeをBへする"
        ],
        [
          "else",
          "実行しない",
          "すでにTrueの枝が見つかったため"
        ],
        [
          "最後",
          "Bを表示",
          "選ばれた1経路の結果"
        ]
      ]
    },
    "checklist": [
      "条件の広さを考えて順番を決める",
      "各行末のコロンを確認する",
      "同じ枝のインデントをそろえる",
      "境界値の直前・ちょうど・直後を試す"
    ]
  },
  "13-for-if": {
    "overview": [
      "forとifを組み合わせると、複数データから条件に合うものだけを選ぶ、数える、合計するといった処理ができます。基本形は「ループ前に結果を用意し、各要素を判定し、条件を満たすときだけ更新する」です。",
      "抽出では空のlistへappend()、個数ではcount=0へ1を加え、合計ではtotal=0へ値を加えます。何を蓄積しているかを変数名で明確にし、更新位置がifの内側か外側かを一行ずつ確認します。"
    ],
    "anatomy": [
      {
        "part": "out = []",
        "meaning": "抽出結果を入れる空のlistをループ前に作ります。"
      },
      {
        "part": "for x in xs:",
        "meaning": "すべての要素を順に調べます。"
      },
      {
        "part": "if x > 0:",
        "meaning": "採用する条件を判定します。"
      },
      {
        "part": "out.append(x)",
        "meaning": "条件を満たす要素だけを結果へ追加します。"
      }
    ],
    "trace": {
      "title": "正の値だけを抽出する",
      "code": "out = []\nfor x in [-2, 3, 0, 5]:\n    if x > 0:\n        out.append(x)\nprint(out)\n",
      "rows": [
        [
          "開始前",
          "out=[]",
          "結果用listを用意する"
        ],
        [
          "x=-2",
          "条件False",
          "追加しない"
        ],
        [
          "x=3",
          "条件True",
          "3を追加する"
        ],
        [
          "x=0",
          "条件False",
          "追加しない"
        ],
        [
          "x=5",
          "条件True",
          "5を追加し、最後に[3,5]を表示"
        ]
      ]
    },
    "checklist": [
      "結果の初期値をループ前へ置く",
      "判定は各要素に対して行う",
      "更新をif内に入れるか意識する",
      "少数のデータで途中結果をprintする"
    ]
  },
  "14-def": {
    "overview": [
      "defは、まとまった処理へ名前を付けて関数として定義します。定義しただけでは本体は実行されず、関数名に丸括弧を付けて呼び出したときに実行されます。繰り返す処理や、意味のある計算単位を関数へ分けると再利用とテストが容易になります。",
      "定義側の名前をparameter、呼び出し側から渡す具体的な値をargumentと呼びます。returnは計算結果を呼び出し元へ返し、その時点で関数を終了します。print()で表示するだけでは、後続の計算へ値を渡せません。"
    ],
    "anatomy": [
      {
        "part": "def area(w, h):",
        "meaning": "areaという関数を、2つのparameterで定義します。"
      },
      {
        "part": "    a = w * h",
        "meaning": "関数本体はインデントして書きます。"
      },
      {
        "part": "    return a",
        "meaning": "計算結果を呼び出し元へ返して関数を終了します。"
      },
      {
        "part": "x = area(3, 4)",
        "meaning": "argument 3と4を渡して呼び出し、戻り値12をxへ代入します。"
      }
    ],
    "trace": {
      "title": "関数定義と呼び出しを分けて読む",
      "code": "def double(x):\n    y = x * 2\n    return y\n\na = double(3)\nb = double(5)\nprint(a, b)\n",
      "rows": [
        [
          "定義",
          "まだ実行しない",
          "doubleという処理を登録する"
        ],
        [
          "1回目の呼出し",
          "x=3, y=6",
          "6を返してaへ代入する"
        ],
        [
          "2回目の呼出し",
          "x=5, y=10",
          "10を返してbへ代入する"
        ],
        [
          "最後",
          "6 10",
          "2回の戻り値を表示する"
        ]
      ]
    },
    "checklist": [
      "定義と呼び出しを区別する",
      "parameterとargumentの対応を確認する",
      "計算結果はreturnで返す",
      "関数名は処理内容を表す動詞や名詞にする"
    ]
  },
  "15-decompose-debug": {
    "overview": [
      "デバッグは、勘でコード全体を書き換える作業ではなく、期待と実際の違いが生まれた最小箇所を見つける作業です。Tracebackの最後にあるエラー名とメッセージ、直前のファイル名と行番号から読み始めます。",
      "長い処理は、入力、計算、判定、出力などの小さな関数へ分けます。各関数を簡単な値で単独テストし、途中の変数をprint()やassertで確認すると、原因候補を狭められます。エラーが消えたことだけでなく、正しい結果になったことまで検証します。"
    ],
    "anatomy": [
      {
        "part": "Tracebackの最終行",
        "meaning": "エラーの種類と直接的な説明が書かれています。"
      },
      {
        "part": "行番号",
        "meaning": "最初に確認する場所を示しますが、原因が直前の行にある場合もあります。"
      },
      {
        "part": "小さな入力",
        "meaning": "手計算できる値で期待結果と比較します。"
      },
      {
        "part": "assert 実際 == 期待",
        "meaning": "期待を満たさないときだけ失敗させる簡単なテストです。"
      }
    ],
    "trace": {
      "title": "NameErrorを切り分ける",
      "code": "d = 10\nt = 2\nv = d / time\nprint(v)\n",
      "rows": [
        [
          "症状",
          "NameError: time",
          "未定義の名前timeを使っている"
        ],
        [
          "確認",
          "定義済みはdとt",
          "綴りの不一致を見つける"
        ],
        [
          "修正",
          "v = d / t",
          "定義済みの変数へそろえる"
        ],
        [
          "再実行",
          "5.0",
          "期待値も手計算して確認する"
        ]
      ]
    },
    "checklist": [
      "Tracebackの最終行を読む",
      "行番号とその直前を確認する",
      "小さな入力へ縮める",
      "一度に1か所だけ修正して再実行する",
      "期待値と実際の値を比較する"
    ]
  },
  "16-integrated": {
    "overview": [
      "小さな解析プログラムでも、入力を用意する、処理する、結果を出力するという流れがあります。処理を関数へ分け、各段階の入出力を明確にすると、別のデータへ交換しやすくなり、誤りも見つけやすくなります。",
      "複数条件を比較するときは、入力データ、計算式、閾値、表示方法をそろえます。途中で平均、個数、最小値などを確認し、最後の結果だけが偶然合っていないか検証します。"
    ],
    "anatomy": [
      {
        "part": "入力",
        "meaning": "listやファイルから、解析対象のデータを用意します。"
      },
      {
        "part": "処理関数",
        "meaning": "平均、抽出、分類などを小さな関数へ分けます。"
      },
      {
        "part": "検証",
        "meaning": "手計算できる小さなデータで各関数を確認します。"
      },
      {
        "part": "出力",
        "meaning": "値の意味・単位・条件を添えて結果を表示します。"
      }
    ],
    "trace": {
      "title": "解析の流れを追う",
      "code": "def mean(xs):\n    return sum(xs) / len(xs)\n\nscores = [60, 70, 80]\navg = mean(scores)\nok = avg >= 65\nprint(avg, ok)\n",
      "rows": [
        [
          "関数定義",
          "meanを登録",
          "平均計算を再利用可能にする"
        ],
        [
          "入力",
          "3つの得点",
          "解析対象を用意する"
        ],
        [
          "処理",
          "avg=70.0",
          "関数を呼び出す"
        ],
        [
          "判定",
          "ok=True",
          "平均が基準以上か調べる"
        ],
        [
          "出力",
          "70.0 True",
          "途中結果と判定を確認する"
        ]
      ]
    },
    "checklist": [
      "入力・処理・出力を分ける",
      "小さな関数ごとに試す",
      "比較条件を公平にそろえる",
      "途中値も確認する",
      "結果の意味を文章で説明する"
    ]
  },
  "17-objects-memory": {
    "overview": [
      "Pythonの変数はオブジェクトそのものではなく、オブジェクトを参照する名前です。b = aと書くと、listなどの可変オブジェクトではaとbが同じ1個のオブジェクトを参照します。そのためbから変更するとaから見える内容も変わります。",
      "数値や文字列、tupleは変更不能、listやdictは変更可能です。独立したlistが必要ならcopy()やスライスを使います。ただし入れ子が深い場合は浅いコピーと深いコピーの違いがあるため、まず単純な例で参照関係を図にして確認します。"
    ],
    "anatomy": [
      {
        "part": "b = a",
        "meaning": "aと同じオブジェクトへの参照をbにも付けます。複製ではありません。"
      },
      {
        "part": "b = a.copy()",
        "meaning": "listの要素を持つ別のlistを作ります。"
      },
      {
        "part": "b.append(3)",
        "meaning": "bが参照するlistオブジェクト自体を変更します。"
      },
      {
        "part": "id(a) == id(b)",
        "meaning": "同じオブジェクトを参照しているか確認できます。"
      }
    ],
    "trace": {
      "title": "別名参照を追う",
      "code": "a = [1, 2]\nb = a\nb.append(3)\nc = a.copy()\nc.append(4)\nprint(a, b, c)\n",
      "rows": [
        [
          "1行目",
          "a→[1,2]",
          "listを作る"
        ],
        [
          "2行目",
          "aとbが同じlistを参照",
          "複製は行われない"
        ],
        [
          "3行目",
          "aもbも[1,2,3]に見える",
          "同じlistを変更したため"
        ],
        [
          "4行目",
          "cは別の[1,2,3]",
          "copyで独立させる"
        ],
        [
          "5行目",
          "cだけ[1,2,3,4]",
          "aとbには影響しない"
        ]
      ]
    },
    "checklist": [
      "代入が複製とは限らないと理解する",
      "可変か変更不能かを確認する",
      "独立させるならcopy()を使う",
      "変更前後のidや内容を小さく表示する"
    ]
  },
  "18-class-oop": {
    "overview": [
      "classは、新しい種類のオブジェクトを作るための設計図です。classから作られた具体的なオブジェクトをinstanceと呼びます。関連するデータを属性、関連する処理をメソッドとしてまとめられます。",
      "__init__はinstance作成時に呼ばれ、selfは現在操作しているinstanceを指します。同じclassから複数のinstanceを作ると、それぞれが独立した属性値を持てます。小さな教材では、無理にclass化せず、データと処理を一緒に扱う利点がある場合に使います。"
    ],
    "anatomy": [
      {
        "part": "class Star:",
        "meaning": "Starという新しい型の設計図を定義します。"
      },
      {
        "part": "def __init__(self, name):",
        "meaning": "instance作成時に初期属性を設定します。"
      },
      {
        "part": "self.name = name",
        "meaning": "そのinstanceの属性nameへ値を保存します。"
      },
      {
        "part": "s = Star(\"Spica\")",
        "meaning": "Star classから具体的なinstanceを作ります。"
      }
    ],
    "trace": {
      "title": "2つのinstanceを作る",
      "code": "class Star:\n    def __init__(self, name):\n        self.name = name\n\na = Star(\"Spica\")\nb = Star(\"Vega\")\nprint(a.name, b.name)\n",
      "rows": [
        [
          "class定義",
          "Starを登録",
          "まだinstanceはない"
        ],
        [
          "aを作成",
          "a.name=\"Spica\"",
          "1個目のinstance"
        ],
        [
          "bを作成",
          "b.name=\"Vega\"",
          "2個目の独立したinstance"
        ],
        [
          "表示",
          "Spica Vega",
          "各instanceの属性を読む"
        ]
      ]
    },
    "checklist": [
      "classとinstanceを区別する",
      "属性はself.名前で保存する",
      "instance methodの第1引数はselfにする",
      "単純な関数で十分かも検討する"
    ]
  },
  "19-numpy-array": {
    "overview": [
      "NumPyのndarrayは、同じ種類の数値を多次元に並べて高速に計算するための配列です。Pythonのlistと違い、arr * 2は要素を2倍し、配列どうしの演算も要素ごとに行われます。科学計算ではshapeとdtypeが結果の意味を左右します。",
      "np.array()でlistから配列を作り、np.arange()やnp.linspace()で規則的な値を生成できます。ベクトル化はforを隠す魔法ではなく、配列全体へ同じ演算を明確に適用する書き方です。"
    ],
    "anatomy": [
      {
        "part": "import numpy as np",
        "meaning": "NumPyを慣例的な短縮名npで読み込みます。"
      },
      {
        "part": "np.array([1, 2, 3])",
        "meaning": "listから1次元ndarrayを作ります。"
      },
      {
        "part": "arr.shape",
        "meaning": "各次元の要素数をtupleで確認します。"
      },
      {
        "part": "arr * 2",
        "meaning": "各要素へ2を掛けた新しい配列を作ります。"
      }
    ],
    "trace": {
      "title": "listとndarrayの違い",
      "code": "import numpy as np\nxs = [1, 2, 3]\na = np.array(xs)\nprint(xs * 2)\nprint(a * 2)\n",
      "rows": [
        [
          "1行目",
          "NumPyを読み込む",
          "npという名前で使う"
        ],
        [
          "2行目",
          "listを作る",
          "通常のPythonデータ"
        ],
        [
          "3行目",
          "ndarrayへ変換",
          "数値配列を作る"
        ],
        [
          "4行目",
          "[1,2,3,1,2,3]",
          "listの*は繰り返し"
        ],
        [
          "5行目",
          "[2,4,6]",
          "ndarrayの*は要素ごとの乗算"
        ]
      ]
    },
    "checklist": [
      "shapeとdtypeを最初に見る",
      "listの演算と混同しない",
      "同じshapeかbroadcast可能か確認する",
      "大量データでは配列演算を優先する"
    ]
  },
  "20-numpy-index-ufunc": {
    "overview": [
      "NumPy配列もindexとsliceで部分を取り出せます。2次元配列ではdata[行, 列]と読み、data[:, 1]はすべての行の第2列です。条件式arr > 0はbool配列を作り、そのmaskでTrueの要素だけを抽出できます。",
      "np.mean()やnp.sum()などの集約関数は配列全体を1つの値へまとめます。axisを指定すると次元ごとに集約します。スライスが元配列を参照するviewになる場合があるため、独立した配列が必要ならcopy()を使います。"
    ],
    "anatomy": [
      {
        "part": "a[1:4]",
        "meaning": "位置1から3までを取り出します。stopの4は含みません。"
      },
      {
        "part": "data[:, 1]",
        "meaning": "すべての行から列index 1を取り出します。"
      },
      {
        "part": "mask = a > 0",
        "meaning": "各要素を比較し、bool配列を作ります。"
      },
      {
        "part": "a[mask]",
        "meaning": "maskがTrueの要素だけを抽出します。"
      }
    ],
    "trace": {
      "title": "ブール抽出を追う",
      "code": "import numpy as np\na = np.array([-2, 3, 0, 5])\nmask = a > 0\npos = a[mask]\nprint(mask)\nprint(pos.mean())\n",
      "rows": [
        [
          "配列",
          "[-2,3,0,5]",
          "4要素を用意する"
        ],
        [
          "比較",
          "[False,True,False,True]",
          "各要素が正か判定する"
        ],
        [
          "抽出",
          "[3,5]",
          "True位置だけを取り出す"
        ],
        [
          "平均",
          "4.0",
          "抽出後の2値を集約する"
        ]
      ]
    },
    "checklist": [
      "2次元では行・列の順に読む",
      "条件式がbool配列を作ることを確認する",
      "抽出後のshapeを確認する",
      "axisの意味を小さな配列で試す"
    ]
  },
  "21-data-io": {
    "overview": [
      "ファイルを読み込めたことと、正しく読み込めたことは同じではありません。区切り文字、見出し行、列順、欠損値の表現を指定し、読み込み直後にshape、dtype、先頭数行を確認します。",
      "np.loadtxt()は整った数値データ、np.genfromtxt()は欠損を含むデータに便利です。列を取り出すときは、どの列が何の量で単位は何かをコメントや変数名で残し、列番号だけが独り歩きしないようにします。"
    ],
    "anatomy": [
      {
        "part": "np.loadtxt(file, delimiter=\",\", skiprows=1)",
        "meaning": "カンマ区切りで見出し1行を飛ばして数値を読みます。"
      },
      {
        "part": "data.shape",
        "meaning": "行数と列数を確認します。"
      },
      {
        "part": "data.dtype",
        "meaning": "配列の数値型を確認します。"
      },
      {
        "part": "data[:3]",
        "meaning": "先頭3行を表示して列順と値を目視します。"
      }
    ],
    "trace": {
      "title": "読み込み直後の三点確認",
      "code": "import numpy as np\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\nprint(data.shape)\nprint(data.dtype)\nprint(data[:2])\n",
      "rows": [
        [
          "読み込み",
          "12行3列の数値",
          "見出しを除いて読む"
        ],
        [
          "shape",
          "(12,3)",
          "想定した行列数か確認する"
        ],
        [
          "dtype",
          "float64など",
          "数値として読めたか確認する"
        ],
        [
          "先頭",
          "最初の2行",
          "列順と値の範囲を確認する"
        ]
      ]
    },
    "checklist": [
      "delimiterとskiprowsを確認する",
      "shape・dtype・先頭を必ず見る",
      "列の意味と単位を残す",
      "ファイル名と相対パスを確認する"
    ]
  },
  "22-missing-save": {
    "overview": [
      "NaNは欠損した数値を表す特殊なfloatです。通常の平均へNaNが含まれると結果もNaNになるため、np.isfinite()で有限値を抽出するか、np.nanmean()など欠損を無視する関数を使います。どの方法を選んだかを結果と一緒に説明します。",
      "複数列を並べ替えるときは、基準列のargsort()で得たindexを全列へ同じように適用し、対応関係を壊さないようにします。保存形式は用途で選び、人が読むCSVと、dtype・shapeを保つ.npyを使い分けます。"
    ],
    "anatomy": [
      {
        "part": "np.isfinite(x)",
        "meaning": "NaNや無限大ではない要素をTrueとするmaskを作ります。"
      },
      {
        "part": "np.nanmean(x)",
        "meaning": "NaNを除外して平均を計算します。"
      },
      {
        "part": "idx = np.argsort(x)",
        "meaning": "xを昇順にするindex順序を得ます。"
      },
      {
        "part": "np.save(\"data.npy\", a)",
        "meaning": "dtypeとshapeを保ってNumPy配列を保存します。"
      }
    ],
    "trace": {
      "title": "欠損を除いて平均する",
      "code": "import numpy as np\nx = np.array([1.0, np.nan, 3.0])\nmask = np.isfinite(x)\ny = x[mask]\nprint(y, y.mean())\n",
      "rows": [
        [
          "配列",
          "1.0, NaN, 3.0",
          "欠損を含む"
        ],
        [
          "mask",
          "True,False,True",
          "有限値だけを判定する"
        ],
        [
          "抽出",
          "[1.0,3.0]",
          "欠損位置を除く"
        ],
        [
          "平均",
          "2.0",
          "有限値2個だけで計算する"
        ]
      ]
    },
    "checklist": [
      "欠損数を数える",
      "除外・補完・nan関数の方針を明示する",
      "複数列は同じindexで並べ替える",
      "保存形式と列説明を残す"
    ]
  },
  "23-matplotlib": {
    "overview": [
      "可視化は装飾ではなく、データの構造や異常を読み取る解析の一部です。時間変化には折れ線、2変数の関係には散布図、1変数の分布にはヒストグラムを基本とし、問いに合う図を選びます。",
      "plt.subplots()でfigureとaxesを作り、axesへ描画すると、複数図や細かな設定へ拡張しやすくなります。軸ラベルには量と単位を付け、必要な凡例、タイトル、グリッドを加えます。軸範囲やbin幅で印象を歪めないことも重要です。"
    ],
    "anatomy": [
      {
        "part": "fig, ax = plt.subplots()",
        "meaning": "図全体figureと描画領域axesを作ります。"
      },
      {
        "part": "ax.plot(x, y)",
        "meaning": "順序に意味のある連続変化を線で描きます。"
      },
      {
        "part": "ax.scatter(x, y)",
        "meaning": "2変数の対応を点で描きます。"
      },
      {
        "part": "ax.set_xlabel(\"Time [s]\")",
        "meaning": "軸の量と単位を明示します。"
      }
    ],
    "trace": {
      "title": "散布図を組み立てる",
      "code": "import matplotlib.pyplot as plt\nx = [1, 2, 3]\ny = [2, 5, 4]\nfig, ax = plt.subplots()\nax.scatter(x, y)\nax.set_xlabel(\"x\")\nax.set_ylabel(\"y\")\nfig.tight_layout()\nplt.show()\n",
      "rows": [
        [
          "データ",
          "xとyを用意",
          "同じ長さの対応する値"
        ],
        [
          "図作成",
          "figとax",
          "描画の土台を作る"
        ],
        [
          "描画",
          "3点の散布図",
          "関係を点で見る"
        ],
        [
          "説明",
          "軸ラベル",
          "何を描いたか明示する"
        ],
        [
          "配置",
          "tight_layout",
          "文字の重なりを減らす"
        ]
      ]
    },
    "checklist": [
      "問いに合う図の種類を選ぶ",
      "xとyの長さ・対応を確認する",
      "軸名と単位を付ける",
      "元データの点を隠さない",
      "軸範囲やbin幅で誤解を生まない"
    ]
  }
};

export const POST_STUDY = {
  "01-variables": [
    {
      "id": "ps01-k1",
      "kind": "knowledge",
      "title": "右辺から読む",
      "prompt": "x = x + 2 が数学の等式としては不自然でも、Pythonでは実行できる理由を説明してください。",
      "hint": "右辺のxと左辺のxが使われる時点を分けて考えます。",
      "answer": "右辺のxは更新前の値として先に読み出され、2を加えた結果が左辺のxへ再代入されるためです。"
    },
    {
      "id": "ps01-k2",
      "kind": "knowledge",
      "title": "型を見分ける",
      "prompt": "3、3.0、\"3\"、Trueの違いを、型と可能な操作に触れて説明してください。",
      "hint": "type()で確認したときの名前を思い出します。",
      "answer": "3はint、3.0はfloat、\"3\"はstr、Trueはboolです。数値は算術演算、文字列は連結など、型によって可能な操作が異なります。"
    },
    {
      "id": "ps01-c1",
      "kind": "code",
      "title": "2数の合計",
      "prompt": "a=7、b=4を使ってsを計算し、11を表示してください。",
      "starterCode": "a = 7\nb = 4\n\n# sを計算して表示\n",
      "hints": [
        "s = a + b とします。",
        "最後にprint(s)を書きます。"
      ],
      "solution": "a = 7\nb = 4\ns = a + b\nprint(s)\n",
      "check": {
        "numericOutput": 11,
        "required": [
          "s",
          "print"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps01-c2",
      "kind": "code",
      "title": "速さを表示",
      "prompt": "m=2.4 km、t=0.8 hからvを計算し、f-stringで「v = 3.0 km/h」と表示してください。",
      "starterCode": "m = 2.4\nt = 0.8\n\n# vを計算して表示\n",
      "hints": [
        "速さはm / tです。",
        "小数1桁は{v:.1f}です。"
      ],
      "solution": "m = 2.4\nt = 0.8\nv = m / t\nprint(f\"v = {v:.1f} km/h\")\n",
      "check": {
        "outputContains": [
          "v = 3.0 km/h"
        ],
        "required": [
          "v",
          "f\"",
          "print"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "02-print": [
    {
      "id": "ps02-k1",
      "kind": "knowledge",
      "title": "計算と表示",
      "prompt": "print()を書かなければ計算自体も行われない、という説明は正しいですか。",
      "hint": "変数へ代入した後、画面へ何も出ない場合を考えます。",
      "answer": "正しくありません。計算や代入は行われますが、人間が結果を確認できないだけです。print()は内部の値を観察可能にします。"
    },
    {
      "id": "ps02-k2",
      "kind": "knowledge",
      "title": "読みやすい出力",
      "prompt": "数値だけを表示するより「speed = 12.5 km/h」のように表示する利点を説明してください。",
      "hint": "第三者が出力だけを見た場面を考えます。",
      "answer": "値の意味と単位が出力から分かり、比較・記録・誤りの確認をしやすくなるためです。"
    },
    {
      "id": "ps02-c1",
      "kind": "code",
      "title": "日付を区切る",
      "prompt": "print()のsepを使い、2026/7/29と1行で表示してください。",
      "starterCode": "# sepを使って表示\n",
      "hints": [
        "3つの数値をカンマで渡します。",
        "sep=\"/\"を指定します。"
      ],
      "solution": "print(2026, 7, 29, sep=\"/\")\n",
      "check": {
        "outputEquals": "2026/7/29",
        "required": [
          "print",
          "sep"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps02-c2",
      "kind": "code",
      "title": "処理の前後を確認",
      "prompt": "x=5を表示し、xへ3を加えた後の値も「before: 5」「after: 8」と2行で表示してください。",
      "starterCode": "x = 5\n\n# 更新前を表示\n# xを更新\n# 更新後を表示\n",
      "hints": [
        "最初のprint()は更新より前へ置きます。",
        "文字列ラベルとxをカンマで渡せます。"
      ],
      "solution": "x = 5\nprint(\"before:\", x)\nx = x + 3\nprint(\"after:\", x)\n",
      "check": {
        "outputContains": [
          "before: 5",
          "after: 8"
        ],
        "required": [
          "print",
          "x = x + 3"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "03-fstrings": [
    {
      "id": "ps03-k1",
      "kind": "knowledge",
      "title": "表示精度",
      "prompt": "xを{x:.2f}で表示した後、xの保存値自体は小数2桁へ変化しますか。",
      "hint": "書式指定が働く場所を考えます。",
      "answer": "変化しません。.2fは文字列へ変換するときの表示方法だけを指定します。計算に使うxの値は元の精度のままです。"
    },
    {
      "id": "ps03-k2",
      "kind": "knowledge",
      "title": "波括弧の役割",
      "prompt": "f-stringの{}の中へ、変数名だけでなくx + 1のような式を書ける理由を説明してください。",
      "hint": "{}の内側をPythonがどのように扱うかを考えます。",
      "answer": "{}の中はPythonの式として評価され、その結果が文字列へ変換されて埋め込まれるためです。"
    },
    {
      "id": "ps03-c1",
      "kind": "code",
      "title": "実行回数の文章",
      "prompt": "name=\"Aoi\"、n=4を使い「Aoiさんは4回実行しました」と表示してください。",
      "starterCode": "name = \"Aoi\"\nn = 4\n\n# f-stringで表示\n",
      "hints": [
        "文字列の前にfを付けます。",
        "{name}と{n}を文章中へ置きます。"
      ],
      "solution": "name = \"Aoi\"\nn = 4\nprint(f\"{name}さんは{n}回実行しました\")\n",
      "check": {
        "outputEquals": "Aoiさんは4回実行しました",
        "required": [
          "f\"",
          "{name}",
          "{n}"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps03-c2",
      "kind": "code",
      "title": "小数を整える",
      "prompt": "x=2/3を小数点以下2桁で「x = 0.67」と表示してください。",
      "starterCode": "x = 2 / 3\n\n# 小数2桁で表示\n",
      "hints": [
        "{x:.2f}を使います。",
        "元のxをround()で上書きする必要はありません。"
      ],
      "solution": "x = 2 / 3\nprint(f\"x = {x:.2f}\")\n",
      "check": {
        "outputEquals": "x = 0.67",
        "required": [
          ".2f",
          "print"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "04-list": [
    {
      "id": "ps04-k1",
      "kind": "knowledge",
      "title": "0始まり",
      "prompt": "3要素のlistで最後の有効な正のindexが2になる理由を説明してください。",
      "hint": "最初の要素のindexから数えます。",
      "answer": "最初が0、次が1、3番目が2となるためです。一般に最後の正のindexはlen(list)-1です。"
    },
    {
      "id": "ps04-k2",
      "kind": "knowledge",
      "title": "スライスのstop",
      "prompt": "xs[1:4]がindex 4の要素を含まない利点を1つ説明してください。",
      "hint": "取り出す要素数をstartとstopから考えます。",
      "answer": "半開区間にすると要素数がstop-startで求まり、隣り合う範囲を重複なくつなげやすいためです。"
    },
    {
      "id": "ps04-c1",
      "kind": "code",
      "title": "末尾へ追加",
      "prompt": "nums=[4,7,2]の末尾へ9を追加し、[4, 7, 2, 9]を表示してください。",
      "starterCode": "nums = [4, 7, 2]\n\n# 9を追加して表示\n",
      "hints": [
        "append()はnumsのメソッドです。",
        "nums = nums.append(9)とは書きません。"
      ],
      "solution": "nums = [4, 7, 2]\nnums.append(9)\nprint(nums)\n",
      "check": {
        "outputEquals": "[4, 7, 2, 9]",
        "required": [
          "append",
          "print"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps04-c2",
      "kind": "code",
      "title": "中央の3要素",
      "prompt": "data=[10,20,30,40,50]から20,30,40をスライスで取り出して表示してください。",
      "starterCode": "data = [10, 20, 30, 40, 50]\n\n# スライスして表示\n",
      "hints": [
        "20のindexは1です。",
        "40の次のindex 4をstopにします。"
      ],
      "solution": "data = [10, 20, 30, 40, 50]\nmid = data[1:4]\nprint(mid)\n",
      "check": {
        "outputEquals": "[20, 30, 40]",
        "required": [
          "[1:4]",
          "print"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "05-dict": [
    {
      "id": "ps05-k1",
      "kind": "knowledge",
      "title": "位置とキー",
      "prompt": "試料のID、質量、材質をlistよりdictで表す利点を説明してください。",
      "hint": "値を取り出すときに0,1,2と書く場合と比較します。",
      "answer": "キー名から各値の意味が分かり、列順を暗記せずに取り出せるため、読み間違いや保守上の負担を減らせます。"
    },
    {
      "id": "ps05-k2",
      "kind": "knowledge",
      "title": "角括弧とget",
      "prompt": "存在しないキーをd[\"x\"]で読む場合とd.get(\"x\", 0)で読む場合の違いを説明してください。",
      "hint": "キーがないときに何が起こるかを比べます。",
      "answer": "角括弧ではKeyErrorになります。get()は指定した既定値0を返すため、未登録が想定内のときに使えます。"
    },
    {
      "id": "ps05-c1",
      "kind": "code",
      "title": "得点を更新",
      "prompt": "d={\"name\":\"A\",\"score\":70}のscoreを85へ更新し、85を表示してください。",
      "starterCode": "d = {\"name\": \"A\", \"score\": 70}\n\n# scoreを更新して表示\n",
      "hints": [
        "キー\"score\"を角括弧で指定します。",
        "更新後にd[\"score\"]をprintします。"
      ],
      "solution": "d = {\"name\": \"A\", \"score\": 70}\nd[\"score\"] = 85\nprint(d[\"score\"])\n",
      "check": {
        "numericOutput": 85,
        "required": [
          "[\"score\"]",
          "print"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps05-c2",
      "kind": "code",
      "title": "未測定を扱う",
      "prompt": "d={\"temp\":22.5}からpressureを読み、キーがなければ「未測定」と表示してください。",
      "starterCode": "d = {\"temp\": 22.5}\n\n# get()を使って表示\n",
      "hints": [
        "get()の第2引数へ既定値を書きます。",
        "d.get(\"pressure\", \"未測定\")です。"
      ],
      "solution": "d = {\"temp\": 22.5}\np = d.get(\"pressure\", \"未測定\")\nprint(p)\n",
      "check": {
        "outputEquals": "未測定",
        "required": [
          "get",
          "pressure"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "06-tuple": [
    {
      "id": "ps06-k1",
      "kind": "knowledge",
      "title": "変更しない組",
      "prompt": "座標をtupleで表すことが適切な場面と、listの方が適切な場面を1つずつ説明してください。",
      "hint": "途中で要素を書き換える必要があるかを基準にします。",
      "answer": "固定した座標やRGB値はtupleが適切です。観測のたびに値を追加・変更する並びはlistが適切です。"
    },
    {
      "id": "ps06-k2",
      "kind": "knowledge",
      "title": "1要素tuple",
      "prompt": "(5)がtupleではなくintとして扱われる理由と、正しい1要素tupleの書き方を答えてください。",
      "hint": "tupleを作る決め手は括弧かカンマかを考えます。",
      "answer": "括弧は式のまとまりとして解釈されるため(5)はintです。1要素tupleは(5,)と末尾にカンマを書きます。"
    },
    {
      "id": "ps06-c1",
      "kind": "code",
      "title": "座標を分ける",
      "prompt": "p=(3,5)をxとyへアンパックし、x+yの8を表示してください。",
      "starterCode": "p = (3, 5)\n\n# xとyへ分けて合計を表示\n",
      "hints": [
        "x, y = p と書きます。",
        "print(x + y)で合計を表示します。"
      ],
      "solution": "p = (3, 5)\nx, y = p\nprint(x + y)\n",
      "check": {
        "numericOutput": 8,
        "required": [
          "x, y",
          "print"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps06-c2",
      "kind": "code",
      "title": "1要素tupleを確認",
      "prompt": "値7だけを持つtuple tを作り、type(t)を表示してください。",
      "starterCode": "t = None\n\n# 1要素tupleへ直して型を表示\n",
      "hints": [
        "t = (7,)です。",
        "最後のカンマを忘れないでください。"
      ],
      "solution": "t = (7,)\nprint(type(t))\n",
      "check": {
        "outputContains": [
          "tuple"
        ],
        "required": [
          "(7,)",
          "type"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "07-methods": [
    {
      "id": "ps07-k1",
      "kind": "knowledge",
      "title": "変更と戻り値",
      "prompt": "xs = xs.append(3)と書くとxsがNoneになる理由を説明してください。",
      "hint": "append()が返す値と、変更される対象を分けます。",
      "answer": "append()は元のlistを直接変更し、戻り値はNoneです。そのNoneをxsへ再代入するため、listへの参照を失います。"
    },
    {
      "id": "ps07-k2",
      "kind": "knowledge",
      "title": "strのメソッド",
      "prompt": "text.upper()を呼んでもtext自体が変わらない理由を説明してください。",
      "hint": "strが変更可能かどうかを思い出します。",
      "answer": "strは変更不能なので、upper()は大文字化した新しいstrを返します。必要ならtext = text.upper()と戻り値を代入します。"
    },
    {
      "id": "ps07-c1",
      "kind": "code",
      "title": "大文字へ変換",
      "prompt": "text=\"spica\"にupper()を使い、SPICAを表示してください。",
      "starterCode": "text = \"spica\"\n\n# 大文字化した値を表示\n",
      "hints": [
        "upper()の戻り値を変数へ代入できます。",
        "print(text.upper())でも構いません。"
      ],
      "solution": "text = \"spica\"\nup = text.upper()\nprint(up)\n",
      "check": {
        "outputEquals": "SPICA",
        "required": [
          "upper",
          "print"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps07-c2",
      "kind": "code",
      "title": "appendを正しく使う",
      "prompt": "nums=[1,2]へ3を追加し、[1, 2, 3]を表示してください。numsへappend()の戻り値を再代入しないでください。",
      "starterCode": "nums = [1, 2]\n\n# appendして表示\n",
      "hints": [
        "nums.append(3)を単独の文として書きます。",
        "次の行でprint(nums)します。"
      ],
      "solution": "nums = [1, 2]\nnums.append(3)\nprint(nums)\n",
      "check": {
        "outputEquals": "[1, 2, 3]",
        "required": [
          "append",
          "print"
        ],
        "forbidden": [
          "nums = nums.append"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "08-math": [
    {
      "id": "ps08-k1",
      "kind": "knowledge",
      "title": "名前空間",
      "prompt": "math.sqrt()のようにmath.を付ける利点を説明してください。",
      "hint": "同じ名前の関数が別の場所にある可能性を考えます。",
      "answer": "どのモジュールに属する機能かが明確になり、名前の衝突や読み違いを減らせます。"
    },
    {
      "id": "ps08-k2",
      "kind": "knowledge",
      "title": "角度の単位",
      "prompt": "math.sin(30)が0.5にならない理由と、30度のsinを求める正しい流れを説明してください。",
      "hint": "math.sin()が受け取る角度単位を確認します。",
      "answer": "math.sin()はラジアンを受け取るためです。math.radians(30)で変換し、その結果をmath.sin()へ渡します。"
    },
    {
      "id": "ps08-c1",
      "kind": "code",
      "title": "円の面積",
      "prompt": "math.piを使い、半径r=2の円の面積を小数点以下2桁で表示してください。",
      "starterCode": "import math\nr = 2\n\n# 面積を計算して表示\n",
      "hints": [
        "面積はmath.pi * r ** 2です。",
        "f-stringの:.2fを使います。"
      ],
      "solution": "import math\nr = 2\na = math.pi * r ** 2\nprint(f\"{a:.2f}\")\n",
      "check": {
        "outputEquals": "12.57",
        "required": [
          "math.pi",
          "** 2",
          ".2f"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps08-c2",
      "kind": "code",
      "title": "30度のsin",
      "prompt": "deg=30をmath.radians()で変換し、sinの値を小数点以下3桁で表示してください。",
      "starterCode": "import math\ndeg = 30\n\n# ラジアンへ変換してsinを表示\n",
      "hints": [
        "rad = math.radians(deg)とします。",
        "math.sin(rad)を:.3fで表示します。"
      ],
      "solution": "import math\ndeg = 30\nrad = math.radians(deg)\ny = math.sin(rad)\nprint(f\"{y:.3f}\")\n",
      "check": {
        "outputEquals": "0.500",
        "required": [
          "radians",
          "sin",
          ".3f"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "09-range": [
    {
      "id": "ps09-k1",
      "kind": "knowledge",
      "title": "stopを含まない",
      "prompt": "range(2, 6)が2,3,4,5となり6を含まないことを、半開区間という言葉を使って説明してください。",
      "hint": "startは含み、stopは含まない規則です。",
      "answer": "rangeはstartを含みstopを含まない半開区間を表すため、2以上6未満の整数2,3,4,5になります。"
    },
    {
      "id": "ps09-k2",
      "kind": "knowledge",
      "title": "空のrange",
      "prompt": "list(range(5, 1, 1))が空になる理由を説明してください。",
      "hint": "startからstopへ進む方向とstepを比べます。",
      "answer": "5から1未満へ向かうには減少が必要ですが、step=1は増加方向なのでstopへ近づかず、要素が生成されません。"
    },
    {
      "id": "ps09-c1",
      "kind": "code",
      "title": "偶数の並び",
      "prompt": "rangeを使い、[2, 4, 6, 8, 10]を表示してください。",
      "starterCode": "# rangeをlistへ変換して表示\n",
      "hints": [
        "start=2、stop=11、step=2です。",
        "確認のためlist(range(...))をprintします。"
      ],
      "solution": "r = range(2, 11, 2)\nprint(list(r))\n",
      "check": {
        "outputEquals": "[2, 4, 6, 8, 10]",
        "required": [
          "range",
          "list"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps09-c2",
      "kind": "code",
      "title": "カウントダウン",
      "prompt": "rangeを使い、[5, 4, 3, 2, 1]を表示してください。",
      "starterCode": "# 負のstepを使います\n",
      "hints": [
        "5から始めて1を含めます。",
        "stopは0、stepは-1です。"
      ],
      "solution": "r = range(5, 0, -1)\nprint(list(r))\n",
      "check": {
        "outputEquals": "[5, 4, 3, 2, 1]",
        "required": [
          "range",
          "-1"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "10-for": [
    {
      "id": "ps10-k1",
      "kind": "knowledge",
      "title": "累積変数の位置",
      "prompt": "total=0をfor文の内側へ置くと合計が正しく求まらない理由を説明してください。",
      "hint": "各反復の最初に何が起きるかを考えます。",
      "answer": "反復のたびにtotalが0へ戻り、それまでの合計を失うためです。初期化はforの前、更新はforの中へ置きます。"
    },
    {
      "id": "ps10-k2",
      "kind": "knowledge",
      "title": "インデント外",
      "prompt": "forの本体と、ループ終了後に1回だけ行う処理をどのように書き分けますか。",
      "hint": "行頭の半角スペースを基準にします。",
      "answer": "各反復で行う処理は同じ幅でインデントし、終了後に1回だけ行う処理はインデントをforと同じ位置へ戻します。"
    },
    {
      "id": "ps10-c1",
      "kind": "code",
      "title": "1から5の合計",
      "prompt": "forとrangeを使い、1から5までの合計15を表示してください。",
      "starterCode": "total = 0\n\n# forで1から5を加える\n\nprint(total)\n",
      "hints": [
        "range(1, 6)を使います。",
        "ループ内でtotal += nとします。"
      ],
      "solution": "total = 0\nfor n in range(1, 6):\n    total += n\nprint(total)\n",
      "check": {
        "numericOutput": 15,
        "required": [
          "for",
          "range",
          "+="
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps10-c2",
      "kind": "code",
      "title": "平方を順に表示",
      "prompt": "forを使い、1, 4, 9, 16を1行ずつ表示してください。",
      "starterCode": "# 1から4まで繰り返す\n",
      "hints": [
        "range(1, 5)を使います。",
        "ループ内でprint(n ** 2)します。"
      ],
      "solution": "for n in range(1, 5):\n    print(n ** 2)\n",
      "check": {
        "outputEquals": "1\n4\n9\n16",
        "required": [
          "for",
          "range",
          "** 2"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "11-conditions": [
    {
      "id": "ps11-k1",
      "kind": "knowledge",
      "title": "境界を含むか",
      "prompt": "「xは0以上10未満」を表す式を書き、0、9、10でTrue/Falseがどうなるか説明してください。",
      "hint": "以上は>=、未満は<です。",
      "answer": "0 <= x < 10です。x=0とx=9はTrue、x=10は上限を含まないためFalseです。"
    },
    {
      "id": "ps11-k2",
      "kind": "knowledge",
      "title": "andとor",
      "prompt": "「気温が30未満で、かつ雨ではない」と「気温が30未満、または雨ではない」の違いを説明してください。",
      "hint": "andとorがTrueになる条件を比べます。",
      "answer": "andは両条件を満たす必要があります。orはどちらか一方でも満たせばTrueなので、対象範囲が広くなります。"
    },
    {
      "id": "ps11-c1",
      "kind": "code",
      "title": "範囲内か判定",
      "prompt": "x=8が0以上10未満かを1つの比較式で判定し、Trueを表示してください。",
      "starterCode": "x = 8\n\n# 範囲内か判定\n",
      "hints": [
        "0 <= x < 10と書けます。",
        "結果をokへ代入してprintします。"
      ],
      "solution": "x = 8\nok = 0 <= x < 10\nprint(ok)\n",
      "check": {
        "outputEquals": "True",
        "required": [
          "0 <= x < 10",
          "print"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps11-c2",
      "kind": "code",
      "title": "2条件を組み合わせる",
      "prompt": "temp=28、rain=Falseについて、「30未満かつ雨ではない」を判定し、Trueを表示してください。",
      "starterCode": "temp = 28\nrain = False\n\n# andとnotを使う\n",
      "hints": [
        "temp < 30とnot rainをandで結びます。",
        "判定結果をprintします。"
      ],
      "solution": "temp = 28\nrain = False\nok = temp < 30 and not rain\nprint(ok)\n",
      "check": {
        "outputEquals": "True",
        "required": [
          "and",
          "not",
          "print"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "12-if": [
    {
      "id": "ps12-k1",
      "kind": "knowledge",
      "title": "分岐の順序",
      "prompt": "score>=60をscore>=90より先に書くと、95点をexcellentへ分類できない理由を説明してください。",
      "hint": "if/elifは上から何個の枝を実行するか考えます。",
      "answer": "95は最初のscore>=60を満たし、その枝を実行した時点で後ろのelifを調べないためです。狭い条件score>=90を先に置きます。"
    },
    {
      "id": "ps12-k2",
      "kind": "knowledge",
      "title": "境界値テスト",
      "prompt": "合格条件がscore>=60のとき、最低限どの3値を試すと境界を確認できますか。",
      "hint": "境界の直前・ちょうど・直後です。",
      "answer": "59、60、61です。59は不合格、60と61は合格になることを確認します。"
    },
    {
      "id": "ps12-c1",
      "kind": "code",
      "title": "偶数・奇数",
      "prompt": "n=7について、if/elseと%を使い「odd」と表示してください。",
      "starterCode": "n = 7\n\n# 偶数ならeven、そうでなければodd\n",
      "hints": [
        "n % 2 == 0が偶数条件です。",
        "else側でoddを表示します。"
      ],
      "solution": "n = 7\nif n % 2 == 0:\n    print(\"even\")\nelse:\n    print(\"odd\")\n",
      "check": {
        "outputEquals": "odd",
        "required": [
          "if",
          "else",
          "% 2"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps12-c2",
      "kind": "code",
      "title": "成績を分類",
      "prompt": "score=84を、90以上A、70以上B、それ以外Cとして分類し、Bを表示してください。",
      "starterCode": "score = 84\n\n# A, B, Cへ分類\n",
      "hints": [
        "狭い条件90以上を先にします。",
        "elif score >= 70を続けます。"
      ],
      "solution": "score = 84\nif score >= 90:\n    grade = \"A\"\nelif score >= 70:\n    grade = \"B\"\nelse:\n    grade = \"C\"\nprint(grade)\n",
      "check": {
        "outputEquals": "B",
        "required": [
          "if",
          "elif",
          "else"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "13-for-if": [
    {
      "id": "ps13-k1",
      "kind": "knowledge",
      "title": "抽出の基本形",
      "prompt": "条件に合う値を新しいlistへ集めるとき、空のlistをforの前へ置く理由を説明してください。",
      "hint": "反復のたびにlistを作り直した場合を考えます。",
      "answer": "forの前に1回だけ作ることで、それまでに採用した値を保持し、各反復で同じlistへ追加できるためです。"
    },
    {
      "id": "ps13-k2",
      "kind": "knowledge",
      "title": "数えるか集めるか",
      "prompt": "条件を満たす値の個数だけが必要な場合と、値そのものも必要な場合で、どの初期値と更新を使いますか。",
      "hint": "countと空のlistを比べます。",
      "answer": "個数だけならcount=0としてcount+=1、値も必要ならout=[]としてout.append(x)を使います。"
    },
    {
      "id": "ps13-c1",
      "kind": "code",
      "title": "偶数を数える",
      "prompt": "nums=[1,2,4,5,8]の偶数の個数3を、forとifで数えて表示してください。",
      "starterCode": "nums = [1, 2, 4, 5, 8]\ncount = 0\n\n# 偶数ならcountを増やす\n\nprint(count)\n",
      "hints": [
        "n % 2 == 0で判定します。",
        "ifの中でcount += 1とします。"
      ],
      "solution": "nums = [1, 2, 4, 5, 8]\ncount = 0\nfor n in nums:\n    if n % 2 == 0:\n        count += 1\nprint(count)\n",
      "check": {
        "numericOutput": 3,
        "required": [
          "for",
          "if",
          "count += 1"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps13-c2",
      "kind": "code",
      "title": "大きい値を抽出",
      "prompt": "nums=[3,8,2,9,5]から5より大きい値だけをoutへ集め、[8, 9]を表示してください。",
      "starterCode": "nums = [3, 8, 2, 9, 5]\nout = []\n\n# 5より大きい値を追加\n\nprint(out)\n",
      "hints": [
        "if n > 5とします。",
        "条件内でout.append(n)します。"
      ],
      "solution": "nums = [3, 8, 2, 9, 5]\nout = []\nfor n in nums:\n    if n > 5:\n        out.append(n)\nprint(out)\n",
      "check": {
        "outputEquals": "[8, 9]",
        "required": [
          "for",
          "if",
          "append"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "14-def": [
    {
      "id": "ps14-k1",
      "kind": "knowledge",
      "title": "printとreturn",
      "prompt": "関数内でprint(x)するだけの場合とreturn xする場合の違いを、後続の計算に触れて説明してください。",
      "hint": "呼び出し結果を変数へ代入した場合を考えます。",
      "answer": "printは画面へ表示するだけです。returnは値を呼び出し元へ返すため、変数へ代入したり、別の式で再利用したりできます。"
    },
    {
      "id": "ps14-k2",
      "kind": "knowledge",
      "title": "定義と呼び出し",
      "prompt": "defを書いた直後に関数本体が実行されない理由と、実行する方法を説明してください。",
      "hint": "関数名と丸括弧の役割を分けます。",
      "answer": "defは処理を関数として登録するだけです。関数名に丸括弧を付け、必要なargumentを渡して呼び出したときに本体が実行されます。"
    },
    {
      "id": "ps14-c1",
      "kind": "code",
      "title": "面積関数",
      "prompt": "wとhを受け取り積を返すarea関数を定義し、area(3,4)の12を表示してください。",
      "starterCode": "# area関数を定義\n\n\nprint(area(3, 4))\n",
      "hints": [
        "def area(w, h):と始めます。",
        "本体でreturn w * hとします。"
      ],
      "solution": "def area(w, h):\n    return w * h\n\nprint(area(3, 4))\n",
      "check": {
        "numericOutput": 12,
        "required": [
          "def area",
          "return",
          "area(3, 4)"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps14-c2",
      "kind": "code",
      "title": "あいさつ関数",
      "prompt": "nameを受け取り「Hello, name!」という文字列を返すgreet関数を作り、greet(\"Aoi\")を表示してください。",
      "starterCode": "# greet関数を定義\n\n\nprint(greet(\"Aoi\"))\n",
      "hints": [
        "return f\"Hello, {name}!\"とできます。",
        "関数内でprintせず文字列をreturnします。"
      ],
      "solution": "def greet(name):\n    return f\"Hello, {name}!\"\n\nprint(greet(\"Aoi\"))\n",
      "check": {
        "outputEquals": "Hello, Aoi!",
        "required": [
          "def greet",
          "return",
          "f\""
        ]
      },
      "difficulty": "定着"
    }
  ],
  "15-decompose-debug": [
    {
      "id": "ps15-k1",
      "kind": "knowledge",
      "title": "Tracebackの読み方",
      "prompt": "Tracebackを見たとき、最初に確認する3点を順に答えてください。",
      "hint": "末尾から読み始めます。",
      "answer": "最終行のエラー名とメッセージ、直前に示されたファイル名と行番号、その行および直前のコードを確認します。"
    },
    {
      "id": "ps15-k2",
      "kind": "knowledge",
      "title": "小さく試す",
      "prompt": "1000個のデータで失敗する平均関数を、[2,4,6]で試す利点を説明してください。",
      "hint": "手計算できるか、途中を追えるかを考えます。",
      "answer": "期待値4を手計算でき、各反復や変数を追いやすいため、データ固有の問題か関数の論理ミスかを切り分けられます。"
    },
    {
      "id": "ps15-c1",
      "kind": "code",
      "title": "NameErrorを直す",
      "prompt": "次のコードのNameErrorを、短い変数名をそろえて修正し、5.0を表示してください。",
      "starterCode": "d = 10\nt = 2\nv = d / time\nprint(v)\n",
      "hints": [
        "未定義なのはtimeです。",
        "定義済みのtへ綴りをそろえます。"
      ],
      "solution": "d = 10\nt = 2\nv = d / t\nprint(v)\n",
      "check": {
        "numericOutput": 5.0,
        "required": [
          "d / t",
          "print"
        ],
        "forbidden": [
          "time"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps15-c2",
      "kind": "code",
      "title": "平均関数を直す",
      "prompt": "len(value)が原因のバグを直し、[2,4,6]の平均4.0を表示してください。",
      "starterCode": "def mean(xs):\n    total = 0\n    for x in xs:\n        total += x\n    return total / len(x)\n\nprint(mean([2, 4, 6]))\n",
      "hints": [
        "len()へ渡すのは最後の要素xではなくlist全体xsです。",
        "return total / len(xs)へ直します。"
      ],
      "solution": "def mean(xs):\n    total = 0\n    for x in xs:\n        total += x\n    return total / len(xs)\n\nprint(mean([2, 4, 6]))\n",
      "check": {
        "numericOutput": 4.0,
        "required": [
          "len(xs)",
          "return"
        ],
        "forbidden": [
          "len(x)"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "16-integrated": [
    {
      "id": "ps16-k1",
      "kind": "knowledge",
      "title": "処理の流れ",
      "prompt": "小さな解析プログラムを「入力・処理・出力」に分ける利点を説明してください。",
      "hint": "データや計算式を交換する場面を考えます。",
      "answer": "各段階の役割と入出力が明確になり、別データへの変更、関数単位のテスト、原因箇所の特定が容易になります。"
    },
    {
      "id": "ps16-k2",
      "kind": "knowledge",
      "title": "公平な比較",
      "prompt": "2つの方法を比較するとき、入力データ・閾値・評価指標をそろえる必要がある理由を説明してください。",
      "hint": "異なる条件で得た結果を比べた場合を考えます。",
      "answer": "条件が違うと結果の差が方法そのものによるのか入力や評価法によるのか判断できず、公平な比較にならないためです。"
    },
    {
      "id": "ps16-c1",
      "kind": "code",
      "title": "平均と合格者数",
      "prompt": "scores=[55,70,85,60]について、平均67.5と60以上の個数3を表示してください。forとifを使って構いません。",
      "starterCode": "scores = [55, 70, 85, 60]\n\n# 平均と60以上の個数を計算\n",
      "hints": [
        "平均はsum(scores) / len(scores)で求められます。",
        "count=0から始め、60以上なら1を加えます。"
      ],
      "solution": "scores = [55, 70, 85, 60]\navg = sum(scores) / len(scores)\ncount = 0\nfor s in scores:\n    if s >= 60:\n        count += 1\nprint(avg)\nprint(count)\n",
      "check": {
        "outputContains": [
          "67.5",
          "3"
        ],
        "required": [
          "len",
          "for",
          "if"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps16-c2",
      "kind": "code",
      "title": "要約関数",
      "prompt": "数値listを受け取り、合計と平均をtupleで返すsummary関数を作り、summary([2,4,6])の(12, 4.0)を表示してください。",
      "starterCode": "# summary関数を定義\n\n\nprint(summary([2, 4, 6]))\n",
      "hints": [
        "s = sum(xs)、avg = s / len(xs)とします。",
        "return s, avgでtupleとして返せます。"
      ],
      "solution": "def summary(xs):\n    s = sum(xs)\n    avg = s / len(xs)\n    return s, avg\n\nprint(summary([2, 4, 6]))\n",
      "check": {
        "outputEquals": "(12, 4.0)",
        "required": [
          "def summary",
          "return",
          "len"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "17-objects-memory": [
    {
      "id": "ps17-k1",
      "kind": "knowledge",
      "title": "同じlistへの参照",
      "prompt": "a=[1,2]、b=aの後にb.append(3)するとaも[1,2,3]に見える理由を説明してください。",
      "hint": "aとbが何個のlistを参照しているか考えます。",
      "answer": "aとbは同じ1個のlistオブジェクトを参照しており、appendはそのオブジェクトを変更するため、どちらの名前から見ても変更後の内容になります。"
    },
    {
      "id": "ps17-k2",
      "kind": "knowledge",
      "title": "copyの目的",
      "prompt": "b=a.copy()が必要になる場面を説明してください。",
      "hint": "bを変更したときaを保ちたいかを考えます。",
      "answer": "元のlist aを保持したまま、別のlist bを独立に変更したい場面です。copy()で別のlistオブジェクトを作ります。"
    },
    {
      "id": "ps17-c1",
      "kind": "code",
      "title": "独立したコピー",
      "prompt": "a=[1,2]からbを独立したcopyとして作り、bへ3を追加してください。aとbを表示し、[1, 2]と[1, 2, 3]になるようにします。",
      "starterCode": "a = [1, 2]\n\n# bを独立したcopyにして3を追加\n\nprint(a)\nprint(b)\n",
      "hints": [
        "b = a.copy()とします。",
        "その後b.append(3)します。"
      ],
      "solution": "a = [1, 2]\nb = a.copy()\nb.append(3)\nprint(a)\nprint(b)\n",
      "check": {
        "outputEquals": "[1, 2]\n[1, 2, 3]",
        "required": [
          "copy",
          "append"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps17-c2",
      "kind": "code",
      "title": "別名参照を確認",
      "prompt": "a=[4,5]、b=aとし、b[0]=9と変更してaを表示してください。結果が[9, 5]になることを確認します。",
      "starterCode": "a = [4, 5]\nb = a\n\n# bの先頭を9へ変更\n\nprint(a)\n",
      "hints": [
        "b[0] = 9とします。",
        "aとbは同じlistを参照しています。"
      ],
      "solution": "a = [4, 5]\nb = a\nb[0] = 9\nprint(a)\n",
      "check": {
        "outputEquals": "[9, 5]",
        "required": [
          "b = a",
          "b[0]"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "18-class-oop": [
    {
      "id": "ps18-k1",
      "kind": "knowledge",
      "title": "classとinstance",
      "prompt": "classとinstanceの違いを、StarとStar(\"Spica\")を例に説明してください。",
      "hint": "設計図と具体物という比喩を使えます。",
      "answer": "Starは属性やメソッドの構造を定める設計図で、Star(\"Spica\")はその設計図から作られた具体的なinstanceです。"
    },
    {
      "id": "ps18-k2",
      "kind": "knowledge",
      "title": "selfの役割",
      "prompt": "instance methodのselfが必要な理由を説明してください。",
      "hint": "複数instanceのどれを操作するか考えます。",
      "answer": "selfは現在そのメソッドを呼び出しているinstanceを指し、そのinstance固有の属性を読み書きするために必要です。"
    },
    {
      "id": "ps18-c1",
      "kind": "code",
      "title": "名前を持つStar",
      "prompt": "name属性を持つStar classを作り、Star(\"Spica\")のnameを表示してください。",
      "starterCode": "class Star:\n    # __init__を書く\n    pass\n\n\ns = Star(\"Spica\")\nprint(s.name)\n",
      "hints": [
        "def __init__(self, name):とします。",
        "self.name = nameで属性へ保存します。"
      ],
      "solution": "class Star:\n    def __init__(self, name):\n        self.name = name\n\ns = Star(\"Spica\")\nprint(s.name)\n",
      "check": {
        "outputEquals": "Spica",
        "required": [
          "class Star",
          "__init__",
          "self.name"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps18-c2",
      "kind": "code",
      "title": "2倍するメソッド",
      "prompt": "値xを属性に持ち、double()で2倍した値を返すBox classを作り、Box(4).double()の8を表示してください。",
      "starterCode": "class Box:\n    def __init__(self, x):\n        self.x = x\n\n    # doubleメソッドを書く\n    pass\n\nb = Box(4)\nprint(b.double())\n",
      "hints": [
        "def double(self):とします。",
        "return self.x * 2とします。"
      ],
      "solution": "class Box:\n    def __init__(self, x):\n        self.x = x\n\n    def double(self):\n        return self.x * 2\n\nb = Box(4)\nprint(b.double())\n",
      "check": {
        "numericOutput": 8,
        "required": [
          "def double",
          "self.x",
          "return"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "19-numpy-array": [
    {
      "id": "ps19-k1",
      "kind": "knowledge",
      "title": "listとの違い",
      "prompt": "[1,2,3]*2とnp.array([1,2,3])*2の結果が異なる理由を説明してください。",
      "hint": "listの*とndarrayの*が表す操作を比べます。",
      "answer": "listの*は並びを繰り返して[1,2,3,1,2,3]を作り、ndarrayの*は各要素を2倍して[2,4,6]を作るためです。"
    },
    {
      "id": "ps19-k2",
      "kind": "knowledge",
      "title": "shapeとdtype",
      "prompt": "NumPy配列を受け取った直後にshapeとdtypeを確認する理由を説明してください。",
      "hint": "配列演算がどの次元・型で行われるかを考えます。",
      "answer": "想定した行列数と数値型かを確認し、列の取り違え、文字列化、整数除算やbroadcastの誤りを早期に見つけるためです。"
    },
    {
      "id": "ps19-c1",
      "kind": "code",
      "title": "配列を3倍",
      "prompt": "NumPy配列[1,2,3]を作り、各要素を3倍した[3 6 9]を表示してください。",
      "starterCode": "import numpy as np\n\n# 配列を作って3倍\n",
      "hints": [
        "np.array([1,2,3])で作ります。",
        "arr * 3をprintします。"
      ],
      "solution": "import numpy as np\na = np.array([1, 2, 3])\nprint(a * 3)\n",
      "check": {
        "outputContains": [
          "3",
          "6",
          "9"
        ],
        "required": [
          "np.array",
          "* 3"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps19-c2",
      "kind": "code",
      "title": "等間隔と平均",
      "prompt": "np.linspace(0,1,5)で配列を作り、その平均0.5を表示してください。",
      "starterCode": "import numpy as np\n\n# 0から1を5点で作り平均を表示\n",
      "hints": [
        "a = np.linspace(0, 1, 5)とします。",
        "a.mean()をprintします。"
      ],
      "solution": "import numpy as np\na = np.linspace(0, 1, 5)\nprint(a.mean())\n",
      "check": {
        "numericOutput": 0.5,
        "required": [
          "linspace",
          "mean"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "20-numpy-index-ufunc": [
    {
      "id": "ps20-k1",
      "kind": "knowledge",
      "title": "ブールmask",
      "prompt": "a[a>0]が正の要素だけを返す流れを、比較と抽出の2段階に分けて説明してください。",
      "hint": "a>0がまず何を作るか考えます。",
      "answer": "a>0が各要素を比較したbool配列を作り、そのTrue位置をa[...]が選んで新しい配列として返します。"
    },
    {
      "id": "ps20-k2",
      "kind": "knowledge",
      "title": "列の取り出し",
      "prompt": "2次元配列dataでdata[:,1]が何を意味するか、コロンと1を分けて説明してください。",
      "hint": "第1添字は行、第2添字は列です。",
      "answer": "コロンはすべての行、1は列index 1、つまり第2列を意味します。結果はその列の1次元配列です。"
    },
    {
      "id": "ps20-c1",
      "kind": "code",
      "title": "正の値を抽出",
      "prompt": "a=[-1,2,0,5]のNumPy配列から正の値だけを抽出し、[2 5]を表示してください。",
      "starterCode": "import numpy as np\na = np.array([-1, 2, 0, 5])\n\n# maskで抽出\n",
      "hints": [
        "mask = a > 0とします。",
        "print(a[mask])とします。"
      ],
      "solution": "import numpy as np\na = np.array([-1, 2, 0, 5])\nmask = a > 0\nprint(a[mask])\n",
      "check": {
        "outputContains": [
          "2",
          "5"
        ],
        "required": [
          "> 0",
          "a[mask]"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps20-c2",
      "kind": "code",
      "title": "列平均",
      "prompt": "2行3列の配列[[1,2,3],[4,5,6]]について、列ごとの平均[2.5 3.5 4.5]を表示してください。",
      "starterCode": "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])\n\n# axisを指定して列平均\n",
      "hints": [
        "列ごとの集約はaxis=0です。",
        "a.mean(axis=0)をprintします。"
      ],
      "solution": "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])\nprint(a.mean(axis=0))\n",
      "check": {
        "outputContains": [
          "2.5",
          "3.5",
          "4.5"
        ],
        "required": [
          "mean",
          "axis=0"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "21-data-io": [
    {
      "id": "ps21-k1",
      "kind": "knowledge",
      "title": "読み込み後の確認",
      "prompt": "ファイルをエラーなく読めても、shape・dtype・先頭行を確認する必要がある理由を説明してください。",
      "hint": "区切り文字や見出し行が誤っていても読み込める場合を考えます。",
      "answer": "列数・行数・型・列順が想定と違う可能性があり、そのまま解析すると意味の異なる列を使う危険があるためです。"
    },
    {
      "id": "ps21-k2",
      "kind": "knowledge",
      "title": "loadtxtとgenfromtxt",
      "prompt": "欠損値を含むCSVでgenfromtxtが便利な理由を説明してください。",
      "hint": "空欄やnanを数値配列でどう扱うかを考えます。",
      "answer": "欠損をNaNとして扱う設定がしやすく、欠損を含む列でも数値配列として読み込みやすいためです。"
    },
    {
      "id": "ps21-c1",
      "kind": "code",
      "title": "CSVのshape",
      "prompt": "experiment.csvをNumPyで読み込み、shapeの(12, 3)を表示してください。",
      "starterCode": "import numpy as np\n\n# 見出しを飛ばして読み込む\n",
      "hints": [
        "np.loadtxtを使います。",
        "delimiter=\",\"、skiprows=1を指定します。"
      ],
      "solution": "import numpy as np\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\nprint(data.shape)\n",
      "check": {
        "outputEquals": "(12, 3)",
        "required": [
          "loadtxt",
          "delimiter",
          "skiprows"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps21-c2",
      "kind": "code",
      "title": "第2列の平均",
      "prompt": "experiment.csvを読み、第2列responseの平均を小数点以下3桁で表示してください。",
      "starterCode": "import numpy as np\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\n\n# 第2列を取り出して平均\n",
      "hints": [
        "第2列のindexは1です。",
        "r = data[:, 1]としてr.mean()を:.3fで表示します。"
      ],
      "solution": "import numpy as np\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\nr = data[:, 1]\nprint(f\"{r.mean():.3f}\")\n",
      "check": {
        "outputEquals": "2.376",
        "required": [
          "[:, 1]",
          "mean",
          ".3f"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "22-missing-save": [
    {
      "id": "ps22-k1",
      "kind": "knowledge",
      "title": "NaNと平均",
      "prompt": "NaNを含む配列へ通常のmean()を使う場合とnanmean()を使う場合の違いを説明してください。",
      "hint": "NaNが計算結果へ伝播するかを考えます。",
      "answer": "通常のmean()はNaNを含むと結果もNaNになります。nanmean()はNaNを除外した有限値で平均を計算します。"
    },
    {
      "id": "ps22-k2",
      "kind": "knowledge",
      "title": "対応を保つ並べ替え",
      "prompt": "xで並べ替えるとき、yも同じargsort indexで並べ替える必要がある理由を説明してください。",
      "hint": "xとyが同じ行の測定値であると考えます。",
      "answer": "xとyの要素対応を保つためです。片方だけを並べ替えると、別の測定同士が誤って組み合わされます。"
    },
    {
      "id": "ps22-c1",
      "kind": "code",
      "title": "有限値の個数",
      "prompt": "experiment_missing.csvをgenfromtxtで読み、第2列の有限値の個数9を表示してください。",
      "starterCode": "import numpy as np\n\n# 欠損を含むCSVを読み込む\n",
      "hints": [
        "np.genfromtxt(..., delimiter=\",\", skip_header=1)を使います。",
        "mask = np.isfinite(data[:,1])とし、mask.sum()を表示します。"
      ],
      "solution": "import numpy as np\ndata = np.genfromtxt(\"experiment_missing.csv\", delimiter=\",\", skip_header=1)\nmask = np.isfinite(data[:, 1])\nprint(mask.sum())\n",
      "check": {
        "numericOutput": 9,
        "required": [
          "genfromtxt",
          "isfinite",
          "sum"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps22-c2",
      "kind": "code",
      "title": "対応を保って整列",
      "prompt": "x=[3,1,2]、y=[30,10,20]をxの昇順へ並べ、[1 2 3]と[10 20 30]を表示してください。",
      "starterCode": "import numpy as np\nx = np.array([3, 1, 2])\ny = np.array([30, 10, 20])\n\n# 同じindexで整列\n",
      "hints": [
        "idx = np.argsort(x)を作ります。",
        "x[idx]とy[idx]を表示します。"
      ],
      "solution": "import numpy as np\nx = np.array([3, 1, 2])\ny = np.array([30, 10, 20])\nidx = np.argsort(x)\nprint(x[idx])\nprint(y[idx])\n",
      "check": {
        "outputContains": [
          "1 2 3",
          "10 20 30"
        ],
        "required": [
          "argsort",
          "x[idx]",
          "y[idx]"
        ]
      },
      "difficulty": "定着"
    }
  ],
  "23-matplotlib": [
    {
      "id": "ps23-k1",
      "kind": "knowledge",
      "title": "図の選択",
      "prompt": "時間に沿う変化、2変数の関係、1変数の分布に、それぞれどの基本図を選びますか。",
      "hint": "plot、scatter、histを対応させます。",
      "answer": "時間に沿う変化は折れ線図、2変数の関係は散布図、1変数の分布はヒストグラムを基本とします。"
    },
    {
      "id": "ps23-k2",
      "kind": "knowledge",
      "title": "軸ラベル",
      "prompt": "科学図で軸ラベルへ量の名前だけでなく単位も書く必要がある理由を説明してください。",
      "hint": "同じ数値でも単位が違う場合を考えます。",
      "answer": "値の尺度と物理的意味を一意に解釈し、第三者が比較・再現できるようにするためです。"
    },
    {
      "id": "ps23-c1",
      "kind": "code",
      "title": "折れ線図を作る",
      "prompt": "x=[0,1,2]、y=[0,1,4]を折れ線で描き、x軸をtime、y軸をvalueとして表示してください。",
      "starterCode": "import matplotlib.pyplot as plt\nx = [0, 1, 2]\ny = [0, 1, 4]\n\n# 図を作る\n",
      "hints": [
        "fig, ax = plt.subplots()を使います。",
        "ax.plot、set_xlabel、set_ylabelを書きます。"
      ],
      "solution": "import matplotlib.pyplot as plt\nx = [0, 1, 2]\ny = [0, 1, 4]\nfig, ax = plt.subplots()\nax.plot(x, y, marker=\"o\")\nax.set_xlabel(\"time\")\nax.set_ylabel(\"value\")\nfig.tight_layout()\nplt.show()\n",
      "check": {
        "required": [
          "plt.subplots",
          "ax.plot",
          "set_xlabel",
          "set_ylabel"
        ]
      },
      "difficulty": "定着"
    },
    {
      "id": "ps23-c2",
      "kind": "code",
      "title": "散布図と単位",
      "prompt": "temp=[20,22,24]、resp=[1.0,1.8,2.7]を散布図にし、軸をTemperature [degC]、Response [a.u.]としてください。",
      "starterCode": "import matplotlib.pyplot as plt\ntemp = [20, 22, 24]\nresp = [1.0, 1.8, 2.7]\n\n# 散布図を作る\n",
      "hints": [
        "ax.scatter(temp, resp)を使います。",
        "両軸に量と単位を書きます。"
      ],
      "solution": "import matplotlib.pyplot as plt\ntemp = [20, 22, 24]\nresp = [1.0, 1.8, 2.7]\nfig, ax = plt.subplots()\nax.scatter(temp, resp)\nax.set_xlabel(\"Temperature [degC]\")\nax.set_ylabel(\"Response [a.u.]\")\nfig.tight_layout()\nplt.show()\n",
      "check": {
        "required": [
          "scatter",
          "Temperature [degC]",
          "Response [a.u.]"
        ]
      },
      "difficulty": "定着"
    }
  ]
};
