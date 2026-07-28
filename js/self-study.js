export const SELF_STUDY = {
  "01-variables": {
    "lead": [
      "変数は、値そのものを暗記するための箱ではなく、値へ意味のある名前を付ける仕組みです。プログラムが長くなっても「この数値は何か」を読み取れるようにすることが、最初の目的です。",
      "Pythonの = は数学の等号ではありません。右側を先に計算し、その結果を左側の名前から使えるようにします。同じ名前へもう一度代入すると、その後は新しい値を参照します。"
    ],
    "grammar": [
      {
        "title": "代入文の基本形",
        "pattern": "名前 = 値または式",
        "body": "右辺を評価してから、その結果を左辺の変数名へ結び付けます。最初は短く読みやすい名前で構いません。",
        "code": "stars = 3\nprice = 120\nname = \"Sora\"\n"
      },
      {
        "title": "値を更新する",
        "pattern": "x = x + 1",
        "body": "右辺のxは更新前の値です。計算結果が改めて左辺のxへ代入されます。",
        "code": "x = 4\nx = x + 1\nprint(x)  # 5\n"
      },
      {
        "title": "型を確かめる",
        "pattern": "type(値)",
        "body": "int、float、str、boolなど、値がどの種類として扱われているかを確認できます。引用符の有無で数値と文字列は別物になります。",
        "code": "print(type(3))\nprint(type(3.0))\nprint(type(\"3\"))\nprint(type(True))\n"
      }
    ],
    "walkthrough": {
      "title": "星の数を更新してみる",
      "code": "stars = 3\nstars = stars + 2\nprint(stars)\n",
      "steps": [
        "1行目で整数3をstarsという名前から参照できるようにします。",
        "2行目では、右辺のstarsがまず3として読み出され、3+2が計算されます。",
        "計算結果5がstarsへ再代入されるため、print()は5を表示します。"
      ],
      "try": "2を10へ変えると何が表示されるか、実行前に予想してください。"
    },
    "checkpoints": [
      {
        "q": "x = 2 + 3 では、xへの代入と2+3の計算のどちらが先ですか。",
        "a": "右辺の2+3を先に計算し、その結果5をxへ代入します。"
      },
      {
        "q": "3と\"3\"は同じ値ですか。",
        "a": "同じではありません。3はint、\"3\"はstrで、できる演算が異なります。"
      }
    ]
  },
  "02-print": {
    "lead": [
      "print()は、プログラムの中で起きていることを人間が観察するための最も基本的な道具です。最終結果だけでなく途中の値も表示すると、どこから期待と違ったかを調べやすくなります。",
      "丸括弧の中へ渡す値を引数と呼びます。複数の引数はカンマで区切れます。sepは値どうしの区切り、endは行末を変更します。"
    ],
    "grammar": [
      {
        "title": "1つまたは複数の値を表示",
        "pattern": "print(a, b, c)",
        "body": "複数の値を渡すと、既定では空白で区切って1行に表示します。文字列のラベルを添えると、出力の意味が伝わります。",
        "code": "x = 8\nprint(x)\nprint(\"x =\", x)\n"
      },
      {
        "title": "区切りを変える",
        "pattern": "print(..., sep=\"区切り\")",
        "body": "日付やCSV風の出力など、値の間に置く文字を指定できます。",
        "code": "print(2026, 7, 28, sep=\"/\")\n"
      },
      {
        "title": "改行を変える",
        "pattern": "print(..., end=\"末尾\")",
        "body": "通常は末尾に改行が入ります。endを指定すると次のprint()を同じ行へ続けられます。",
        "code": "print(\"計算中\", end=\" ... \")\nprint(\"完了\")\n"
      },
      {
        "title": "コメント",
        "pattern": "# 説明",
        "body": "#より右側は実行されません。単位、仮定、処理の目的など、後から読む人に必要な説明を残します。",
        "code": "time = 2.5  # 単位は秒\n"
      }
    ],
    "walkthrough": {
      "title": "途中の値を追う",
      "code": "energy = 100\nprint(\"最初:\", energy)\nenergy = energy * 0.8\nprint(\"後:\", energy)\n",
      "steps": [
        "最初のprint()で更新前の100を確認します。",
        "energy * 0.8が80.0となり、energyへ再代入されます。",
        "2回目のprint()に説明を添えることで、どちらの値かを見分けられます。"
      ],
      "try": "0.8を0.5へ変え、2回目の出力を予想してください。"
    },
    "checkpoints": [
      {
        "q": "print()を書かずに計算だけした場合、計算は行われますか。",
        "a": "行われます。ただし通常のプログラムでは、人間が結果を確認できないためprint()などで出力します。"
      },
      {
        "q": "sepとendは何を変えますか。",
        "a": "sepは複数の値の間、endはprint()の末尾を変えます。"
      }
    ]
  },
  "03-fstrings": {
    "lead": [
      "f-stringは、文章の中へ変数や式の値を埋め込むための書き方です。文字列の引用符の直前へfを付け、値を入れたい場所を波括弧 {} で囲みます。",
      "表示する桁数や割合の形式も指定できます。これは見せ方だけを変え、変数に保存された値そのものは変えません。"
    ],
    "grammar": [
      {
        "title": "基本形",
        "pattern": "f\"文章{式}文章\"",
        "body": "{}の中はPythonの式として評価されます。変数だけでなく、足し算なども書けます。",
        "code": "name = \"Aoi\"\nscore = 82\nprint(f\"{name}さんは{score}点\")\n"
      },
      {
        "title": "小数の桁数",
        "pattern": "{x:.2f}",
        "body": "fは浮動小数点表示、.2は小数点以下2桁を意味します。四捨五入して表示されます。",
        "code": "x = 1 / 3\nprint(f\"{x:.2f}\")  # 0.33\n"
      },
      {
        "title": "割合表示",
        "pattern": "{rate:.1%}",
        "body": "値を100倍して%を付け、小数点以下1桁で表示します。0.85は85.0%になります。",
        "code": "rate = 17 / 20\nprint(f\"{rate:.1%}\")\n"
      },
      {
        "title": "表示と保存値の違い",
        "pattern": "formatは表示だけ",
        "body": "{x:.2f}で表示してもxの中身は丸められません。後の計算には元の精度が使われます。",
        "code": "x = 1 / 3\nprint(f\"表示: {x:.2f}\")\nprint(x)\n"
      }
    ],
    "walkthrough": {
      "title": "距離を文章にする",
      "code": "dist = 12.345\ntime = 0.5\nspeed = dist / time\nprint(f\"速度は{speed:.1f} km/h\")\n",
      "steps": [
        "distとtimeからspeedを計算します。",
        "f-stringの{}へspeedを置き、文章と数値を一つにします。",
        ":.1fにより24.7と小数1桁で表示されます。"
      ],
      "try": "小数2桁へ変えるには、:.1fのどこを変更すればよいでしょうか。"
    },
    "checkpoints": [
      {
        "q": "文字列の先頭のfを忘れると、{name}はどう表示されますか。",
        "a": "変数の値へ置き換わらず、波括弧を含む文字として表示されます。"
      },
      {
        "q": "{x:.2f}はxを永久に小数2桁へ丸めますか。",
        "a": "いいえ。表示形式だけを変えます。"
      }
    ]
  },
  "04-list": {
    "lead": [
      "listは、同じ目的で扱う複数の値を順序付きでまとめるデータ構造です。点数、測定値、名前の一覧など、「1番目、2番目」と位置が意味を持つ場面で使います。",
      "Pythonの位置番号は0から始まります。範囲を取り出すスライスでは、終了位置を含まないという規則が重要です。"
    ],
    "grammar": [
      {
        "title": "listを作る",
        "pattern": "[値1, 値2, ...]",
        "body": "角括弧の中へ値をカンマで並べます。空のlistは[]です。",
        "code": "scores = [72, 88, 65]\nempty = []\n"
      },
      {
        "title": "要素を読む",
        "pattern": "data[index]",
        "body": "先頭は0、最後は-1です。存在しない位置を読むとIndexErrorになります。",
        "code": "data = [10, 20, 30]\nprint(data[0])\nprint(data[-1])\n"
      },
      {
        "title": "範囲を切り出す",
        "pattern": "data[start:stop]",
        "body": "startからstopの直前までを新しいlistとして取り出します。stop自身は含まれません。",
        "code": "data = [10, 20, 30, 40]\nprint(data[1:3])  # [20, 30]\n"
      },
      {
        "title": "変更と追加",
        "pattern": "data[i] = 値 / data.append(値)",
        "body": "listは作成後に要素を変更できます。append()は末尾へ1要素を追加します。",
        "code": "data = [1, 2]\ndata[0] = 10\ndata.append(3)\n"
      }
    ],
    "walkthrough": {
      "title": "星の明るさを修正する",
      "code": "mag = [1.2, 9.9, 0.8]\nmag[1] = 1.0\nmag.append(1.5)\nprint(mag[1:3])\n",
      "steps": [
        "mag[1]は2番目の9.9を指します。",
        "代入によって2番目を1.0へ修正します。",
        "1.5を末尾へ追加し、スライス[1:3]で位置1と2を取り出します。"
      ],
      "try": "mag[:2]とmag[-2:]が何を返すか予想してください。"
    },
    "checkpoints": [
      {
        "q": "4番目の要素のインデックスはいくつですか。",
        "a": "3です。インデックスは0から始まります。"
      },
      {
        "q": "data[1:4]にはインデックス4の要素が含まれますか。",
        "a": "含まれません。stopは終了位置の直前までです。"
      }
    ]
  },
  "05-dict": {
    "lead": [
      "dictは、値を位置ではなくキーと呼ばれる名前で管理します。1つの試料について名前、質量、温度など意味の異なる値をまとめるとき、各値の意味がコードに残ります。",
      "キーは同じdictの中で重複できません。同じキーへ代入すると更新になり、まだないキーへ代入すると新しい項目が追加されます。"
    ],
    "grammar": [
      {
        "title": "dictを作る",
        "pattern": "{\"キー\": 値, ...}",
        "body": "キーと値をコロンで結び、組どうしをカンマで区切ります。",
        "code": "star = {\"name\": \"Spica\", \"mag\": 0.98}\n"
      },
      {
        "title": "値を読む・更新する",
        "pattern": "d[\"key\"]",
        "body": "角括弧へキーを書いて値を読みます。同じ形の左辺へ代入すると更新または追加になります。",
        "code": "star[\"mag\"] = 1.00\nstar[\"color\"] = \"blue\"\n"
      },
      {
        "title": "キーがない場合",
        "pattern": "d.get(\"key\", 既定値)",
        "body": "必須キーなら[]で早くエラーに気付くのが有効です。欠けてもよい項目はget()で既定値を返せます。",
        "code": "print(star.get(\"distance\", \"不明\"))\n"
      },
      {
        "title": "全項目を見る",
        "pattern": "keys / values / items",
        "body": "items()はキーと値の組を返します。for文を学ぶと全項目を順に処理できます。",
        "code": "print(list(star.items()))\n"
      }
    ],
    "walkthrough": {
      "title": "プロフィールを更新する",
      "code": "user = {\"name\": \"Mio\", \"score\": 70}\nuser[\"score\"] = 85\nuser[\"clear\"] = True\nprint(user[\"name\"], user[\"score\"])\n",
      "steps": [
        "最初はnameとscoreの2項目です。",
        "既存キーscoreへ代入するため値だけが更新されます。",
        "新しいclearキーへ代入すると3項目になります。"
      ],
      "try": "user.get(\"rank\", \"未設定\")は何を返すでしょうか。"
    },
    "checkpoints": [
      {
        "q": "listとdictの主な違いは何ですか。",
        "a": "listは位置で、dictはキーで値を参照します。"
      },
      {
        "q": "存在しないキーをd[\"x\"]で読むとどうなりますか。",
        "a": "KeyErrorになります。欠けてもよい場合はget()を使えます。"
      }
    ]
  },
  "06-tuple": {
    "lead": [
      "tupleは、順序のある複数の値をまとめますが、作成後に要素を変更できません。座標やRGB値など、「この組を途中で変えたくない」と示すときに向きます。",
      "丸括弧が目印に見えますが、tupleを決める本質はカンマです。1要素tupleでは末尾のカンマを忘れないことが重要です。"
    ],
    "grammar": [
      {
        "title": "tupleを作る",
        "pattern": "(a, b, c)",
        "body": "複数要素では丸括弧を省略できる場合もありますが、読みやすさのため通常は付けます。",
        "code": "point = (1.5, -2.0, 4.5)\n"
      },
      {
        "title": "1要素tuple",
        "pattern": "(value,)",
        "body": "(42)は整数42を括弧で囲んだだけです。(42,)とカンマを付けてtupleになります。",
        "code": "one = (42,)\nprint(type(one))\n"
      },
      {
        "title": "アンパック",
        "pattern": "x, y = pair",
        "body": "要素数と左辺の変数数が一致すれば、各値を一度に分けて代入できます。",
        "code": "x, y, z = point\n"
      },
      {
        "title": "変更できない",
        "pattern": "tupleはimmutable",
        "body": "point[0] = 9 のような変更はTypeErrorです。変更が必要なら新しいtupleを作ります。",
        "code": "point = (9, point[1], point[2])\n"
      }
    ],
    "walkthrough": {
      "title": "座標を分解する",
      "code": "p = (3, 4)\nx, y = p\nr2 = x ** 2 + y ** 2\nprint(r2)\n",
      "steps": [
        "pはx座標とy座標の組です。",
        "アンパックで3をx、4をyへ代入します。",
        "x²+y²を計算すると25になります。"
      ],
      "try": "pへ3要素を入れたままx, y = pとすると、どのような問題が起きるでしょうか。"
    },
    "checkpoints": [
      {
        "q": "(5)と(5,)は同じですか。",
        "a": "異なります。(5)はint、(5,)は1要素tupleです。"
      },
      {
        "q": "tupleの要素を直接書き換えられますか。",
        "a": "書き換えられません。新しいtupleを作ります。"
      }
    ]
  },
  "07-methods": {
    "lead": [
      "関数は処理へ名前を付けたものです。メソッドは特定のオブジェクトに備わった関数で、data.append(3)のように「オブジェクト.メソッド名()」と呼び出します。",
      "メソッドには、新しい値を返すものと、元のオブジェクトを変更するものがあります。戻り値を代入すべきかどうかを区別することが重要です。"
    ],
    "grammar": [
      {
        "title": "関数とメソッド",
        "pattern": "func(x) / x.method()",
        "body": "len(data)は関数、data.append(x)はlistのメソッドです。呼び方の形から区別できます。",
        "code": "data = [1, 2]\nprint(len(data))\ndata.append(3)\n"
      },
      {
        "title": "文字列メソッド",
        "pattern": "text.strip().lower()",
        "body": "strのメソッドは多くの場合、新しい文字列を返します。元の文字列は変わらないため、必要なら戻り値を代入します。",
        "code": "text = \"  HELLO  \"\nclean = text.strip().lower()\n"
      },
      {
        "title": "listを変えるメソッド",
        "pattern": "data.append(x)",
        "body": "append()は元のlistを変更し、戻り値はNoneです。data = data.append(x)とするとdataがNoneになります。",
        "code": "data = [1, 2]\ndata.append(3)\nprint(data)\n"
      },
      {
        "title": "helpの使い方",
        "pattern": "help(type.method)",
        "body": "メソッドの役割や引数が分からないとき、help()や用語集で確認できます。",
        "code": "help(str.replace)\n"
      }
    ],
    "walkthrough": {
      "title": "名前を整形する",
      "code": "text = \"  SPICA Star  \"\nname = text.strip().lower().replace(\" \", \"_\")\nprint(name)\n",
      "steps": [
        "strip()が前後の余分な空白を除きます。",
        "lower()が大文字を小文字へ変えます。",
        "replace()が途中の空白を_へ置き換えます。各メソッドの戻り値を次のメソッドへ渡しています。"
      ],
      "try": "replace(\" \", \"-\")へ変えると出力はどうなりますか。"
    },
    "checkpoints": [
      {
        "q": "append()の戻り値は追加後のlistですか。",
        "a": "いいえ。Noneです。list自体が変更されます。"
      },
      {
        "q": "str.lower()は元の文字列を直接変更しますか。",
        "a": "変更しません。小文字化した新しい文字列を返します。"
      }
    ]
  },
  "08-math": {
    "lead": [
      "mathはPythonに標準で含まれる数学用ライブラリです。import mathで読み込み、math.piやmath.sqrt()のように名前空間を付けて使います。",
      "三角関数は角度ではなくラジアンを受け取ります。度を使う場合はmath.radians()で変換してからsinやcosへ渡します。"
    ],
    "grammar": [
      {
        "title": "ライブラリを読み込む",
        "pattern": "import math",
        "body": "importした後、math.名前の形で定数や関数を使います。どのライブラリの機能かがコードに明示されます。",
        "code": "import math\nprint(math.pi)\n"
      },
      {
        "title": "平方根とべき乗",
        "pattern": "math.sqrt(x) / x ** 0.5",
        "body": "平方根はsqrt()で計算できます。負の実数を渡すとmath domain errorになります。",
        "code": "print(math.sqrt(25))\n"
      },
      {
        "title": "度からラジアン",
        "pattern": "math.radians(deg)",
        "body": "180°がπラジアンです。手計算でπ/180を掛けてもよいですが、radians()は意図が明確です。",
        "code": "rad = math.radians(30)\nprint(math.sin(rad))\n"
      },
      {
        "title": "丸めと表示",
        "pattern": "round / f-string",
        "body": "round()は数値を丸めた値、f-stringの書式指定は表示だけを丸めます。計算途中では早く丸めすぎないようにします。",
        "code": "x = math.pi\nprint(f\"{x:.3f}\")\n"
      }
    ],
    "walkthrough": {
      "title": "円の周りの長さ",
      "code": "import math\nr = 2.5\nc = 2 * math.pi * r\nprint(f\"{c:.2f} m\")\n",
      "steps": [
        "importでmathを使えるようにします。",
        "円周2πrをそのままPythonの演算へ置き換えます。",
        "計算値は保持したまま、表示だけ小数2桁にします。"
      ],
      "try": "半径を5.0へすると円周は何倍になるか、計算前に考えてください。"
    },
    "checkpoints": [
      {
        "q": "math.sin(30)はsin 30°を計算しますか。",
        "a": "いいえ。30ラジアンとして計算します。30°はmath.radians(30)で変換します。"
      },
      {
        "q": "math.piを使う前に何が必要ですか。",
        "a": "import mathが必要です。"
      }
    ]
  },
  "09-range": {
    "lead": [
      "range()は、for文で使う規則的な整数列を表します。終了値を含まない半開区間という規則は、listのスライスと共通です。",
      "rangeは必要な整数をすべてlistとして先に保存するのではなく、規則を表すオブジェクトです。内容を確認するときだけlist(range(...))とします。"
    ],
    "grammar": [
      {
        "title": "0からstopの直前",
        "pattern": "range(stop)",
        "body": "range(5)は0,1,2,3,4です。5は含まれません。",
        "code": "print(list(range(5)))\n"
      },
      {
        "title": "開始と終了",
        "pattern": "range(start, stop)",
        "body": "startからstopの直前まで、1ずつ増えます。",
        "code": "print(list(range(2, 6)))\n"
      },
      {
        "title": "刻み幅",
        "pattern": "range(start, stop, step)",
        "body": "stepを2にすれば飛び飛び、負にすれば逆順です。stepに0は指定できません。",
        "code": "print(list(range(2, 11, 2)))\nprint(list(range(10, 0, -3)))\n"
      },
      {
        "title": "回数と値を区別",
        "pattern": "range(n)はn回",
        "body": "0からn-1までのn個が得られるため、処理をn回繰り返すときに自然です。",
        "code": "for i in range(3):\n    print(i)\n"
      }
    ],
    "walkthrough": {
      "title": "カウントダウンを作る",
      "code": "nums = list(range(10, 0, -3))\nprint(nums)\n",
      "steps": [
        "開始は10です。",
        "step=-3なので10,7,4,1と減ります。",
        "次の値-2はstop=0を越えるため終了します。"
      ],
      "try": "0も含めたい場合、stopをいくつにすればよいか考えてください。"
    },
    "checkpoints": [
      {
        "q": "range(1, 5)に5は含まれますか。",
        "a": "含まれません。1,2,3,4です。"
      },
      {
        "q": "range(5, 0, 1)が空になるのはなぜですか。",
        "a": "開始が終了より大きいのに正のstepで増やそうとしているためです。"
      }
    ]
  },
  "10-for": {
    "lead": [
      "for文は、データの各要素またはrange()の各整数について、同じ処理を繰り返します。末尾のコロンと、その次の行からのインデントがブロックの範囲を示します。",
      "繰り返しのたびに変わる値をループ変数と呼びます。合計や個数を求めるときは、ループの外で初期値を用意し、内側で少しずつ更新します。"
    ],
    "grammar": [
      {
        "title": "基本形",
        "pattern": "for x in data:",
        "body": "dataから1要素ずつxへ取り出し、インデントされた処理を実行します。",
        "code": "for x in [2, 4, 6]:\n    print(x)\n"
      },
      {
        "title": "rangeと組み合わせる",
        "pattern": "for i in range(n):",
        "body": "0からn-1までのiについてn回処理します。必要ならi+1で1始まりの番号を表示できます。",
        "code": "for i in range(3):\n    print(i + 1)\n"
      },
      {
        "title": "合計を作る",
        "pattern": "total = 0 → total += x",
        "body": "初期値はループの外へ置きます。内側へ置くと毎回0に戻ってしまいます。",
        "code": "total = 0\nfor x in [1, 2, 3]:\n    total += x\nprint(total)\n"
      },
      {
        "title": "インデント",
        "pattern": "同じ幅で字下げ",
        "body": "Pythonでは空白が構造です。通常は半角スペース4個を使い、タブと混在させません。",
        "code": "for x in [1, 2]:\n    y = x ** 2\n    print(y)\nprint(\"終了\")\n"
      }
    ],
    "walkthrough": {
      "title": "平方の表を作る",
      "code": "for n in range(1, 4):\n    y = n ** 2\n    print(f\"{n} -> {y}\")\n",
      "steps": [
        "range(1,4)から1,2,3が順にnへ入ります。",
        "各回でnの平方をyへ計算します。",
        "print()は3回実行され、3行の表になります。"
      ],
      "try": "range(1, 6)へ変えると、最後の行は何になりますか。"
    },
    "checkpoints": [
      {
        "q": "for文の処理を3回繰り返すのにrange(3)を使うと、iは何になりますか。",
        "a": "0、1、2です。"
      },
      {
        "q": "合計用のtotal=0をループ内へ書くとどうなりますか。",
        "a": "毎回0へ戻るため、それまでの合計を保持できません。"
      }
    ]
  },
  "11-conditions": {
    "lead": [
      "比較式は、条件が成り立つかをTrueまたはFalseで返します。if文はこのbool値を見て処理を選びます。まず比較式だけをprint()して、条件が期待どおりか確かめる習慣が有効です。",
      "and、or、notで条件を組み合わせられます。境界値を含むかどうかは < と <= の違いで決まるため、問題文を数直線として考えます。"
    ],
    "grammar": [
      {
        "title": "比較演算子",
        "pattern": "== != < <= > >=",
        "body": "=は代入、==は等しいかの比較です。数値だけでなく文字列も比較できます。",
        "code": "x = 5\nprint(x == 5)\nprint(x != 3)\n"
      },
      {
        "title": "連続比較",
        "pattern": "low <= x <= high",
        "body": "数学の不等式に近い形で範囲判定を書けます。両方の条件が成り立つとTrueです。",
        "code": "x = 1.05\nprint(0.95 <= x <= 1.10)\n"
      },
      {
        "title": "and / or / not",
        "pattern": "条件1 and 条件2",
        "body": "andは両方、orはいずれか、notは真偽を反転します。複雑なら括弧を使って意図を明確にします。",
        "code": "age = 20\nmember = True\nprint(age >= 18 and member)\n"
      },
      {
        "title": "余りで分類",
        "pattern": "n % 2 == 0",
        "body": "%は割り算の余りです。2で割った余りが0なら偶数です。",
        "code": "n = 8\nprint(n % 2 == 0)\n"
      }
    ],
    "walkthrough": {
      "title": "安全範囲を判定する",
      "code": "temp = 24\nhum = 55\nok = 20 <= temp <= 28 and hum < 70\nprint(ok)\n",
      "steps": [
        "温度が20以上28以下かを連続比較します。",
        "湿度が70未満かを別の比較式で作ります。",
        "andにより両方がTrueのときだけokがTrueになります。"
      ],
      "try": "humを70へ変えたとき、<と<=で結果がどう違うか試してください。"
    },
    "checkpoints": [
      {
        "q": "x = 3とx == 3は何が違いますか。",
        "a": "前者は代入、後者は等しいかを比較してboolを返します。"
      },
      {
        "q": "0 <= x < 10は10を含みますか。",
        "a": "含みません。x < 10だからです。"
      }
    ]
  },
  "12-if": {
    "lead": [
      "if文は、条件に応じて実行する処理を選びます。if、elif、elseの並びでは、上から調べて最初にTrueになった枝だけが実行されます。",
      "条件は具体的なものから先に書くのが基本です。広い条件を先に書くと、後ろのより厳しい条件へ到達しないことがあります。"
    ],
    "grammar": [
      {
        "title": "ifだけの分岐",
        "pattern": "if 条件:",
        "body": "条件がTrueのときだけ、インデントされた処理を実行します。Falseならそのブロックを飛ばします。",
        "code": "score = 75\nif score >= 60:\n    print(\"pass\")\n"
      },
      {
        "title": "二者択一",
        "pattern": "if ... else ...",
        "body": "条件がTrueならif側、Falseならelse側のどちらか一方が実行されます。",
        "code": "if score >= 60:\n    result = \"pass\"\nelse:\n    result = \"fail\"\n"
      },
      {
        "title": "複数の区分",
        "pattern": "if / elif / else",
        "body": "上から順に判定し、最初のTrueだけを実行します。条件の順序もプログラムの意味です。",
        "code": "if score >= 90:\n    rank = \"A\"\nelif score >= 60:\n    rank = \"B\"\nelse:\n    rank = \"C\"\n"
      },
      {
        "title": "境界値を試す",
        "pattern": "直前・ちょうど・直後",
        "body": "60以上なら、59、60、61を試すと不等号の間違いを見つけやすくなります。",
        "code": "for score in [59, 60, 61]:\n    print(score, score >= 60)\n"
      }
    ],
    "walkthrough": {
      "title": "点数を3段階に分ける",
      "code": "score = 95\nif score >= 90:\n    result = \"excellent\"\nelif score >= 60:\n    result = \"pass\"\nelse:\n    result = \"retry\"\nprint(result)\n",
      "steps": [
        "95はscore>=90を満たすため最初の枝へ入ります。",
        "最初の枝が選ばれた後、elifとelseは調べません。",
        "広い条件score>=60を先にすると95もpassになってしまいます。"
      ],
      "try": "scoreを90、60、59へ変え、境界の結果を確認してください。"
    },
    "checkpoints": [
      {
        "q": "elifは、前のifがTrueだった場合にも調べられますか。",
        "a": "調べられません。最初にTrueになった枝だけが実行されます。"
      },
      {
        "q": "score>=60をscore>=90より先に置くと何が問題ですか。",
        "a": "90以上も先にscore>=60へ入り、excellentへ到達しません。"
      }
    ]
  },
  "13-for-if": {
    "lead": [
      "forとifを組み合わせると、複数のデータから条件に合うものだけを選ぶ、数える、合計する、といった基本的なデータ処理ができます。",
      "目的に応じて、空のlistへ集める、countを増やす、totalへ足すという3つの型を使い分けます。"
    ],
    "grammar": [
      {
        "title": "抽出する",
        "pattern": "if 条件: result.append(x)",
        "body": "条件を満たした値そのものが必要なら、空のlistへ追加します。",
        "code": "evens = []\nfor n in range(1, 7):\n    if n % 2 == 0:\n        evens.append(n)\n"
      },
      {
        "title": "数える",
        "pattern": "count += 1",
        "body": "値ではなく個数だけが必要なら、整数カウンターを増やします。",
        "code": "count = 0\nfor x in [42, 60, 73]:\n    if x >= 60:\n        count += 1\n"
      },
      {
        "title": "条件付き合計",
        "pattern": "total += x",
        "body": "条件を満たす値の合計が必要なら、totalへ加えます。",
        "code": "total = 0\nfor x in [1, -2, 3]:\n    if x > 0:\n        total += x\n"
      },
      {
        "title": "処理順を追う",
        "pattern": "各回の値をprint",
        "body": "分からなくなったら、ループ変数、条件結果、countなどを一時的にprint()して1回ずつ追います。",
        "code": "for x in [1, 2, 3]:\n    print(\"x=\", x, \"条件=\", x > 1)\n"
      }
    ],
    "walkthrough": {
      "title": "合格者数を数える",
      "code": "scores = [42, 60, 73, 58]\ncount = 0\nfor score in scores:\n    if score >= 60:\n        count += 1\nprint(count)\n",
      "steps": [
        "countはループ前に0で始めます。",
        "scoreを1つずつ取り出し、60以上か判定します。",
        "60と73の2回だけcountが増えるため、最後は2です。"
      ],
      "try": "合格した点数自体も必要な場合、どこに空のlistとappend()を追加するか考えてください。"
    },
    "checkpoints": [
      {
        "q": "条件に合う値そのものを残したいとき、countだけで十分ですか。",
        "a": "不十分です。空のlistへappend()して値を保存します。"
      },
      {
        "q": "count=0はforの内側と外側のどちらへ置きますか。",
        "a": "外側です。内側だと毎回0へ戻ります。"
      }
    ]
  },
  "14-def": {
    "lead": [
      "defを使うと、何度も使う処理へ名前を付け、入力と出力の関係としてまとめられます。関数を小さく作ると、同じ計算の書き直しを減らし、単独でテストできます。",
      "defを書いただけでは関数の中身は実行されません。関数名に丸括弧を付けて呼び出したときに処理が始まります。"
    ],
    "grammar": [
      {
        "title": "関数を定義する",
        "pattern": "def name(param):",
        "body": "def、関数名、丸括弧、コロンの順です。処理本体をインデントします。paramは関数内で使う仮の名前です。",
        "code": "def double(x):\n    return 2 * x\n"
      },
      {
        "title": "関数を呼ぶ",
        "pattern": "name(argument)",
        "body": "呼び出し時に渡す具体的な値を引数と呼びます。double(3)ではxに3が入ります。",
        "code": "y = double(3)\nprint(y)\n"
      },
      {
        "title": "returnとprintの違い",
        "pattern": "return 値",
        "body": "returnは値を呼び出し元へ返し、そこで計算に再利用できます。printは画面へ表示するだけです。",
        "code": "def area(w, h):\n    return w * h\na = area(3, 2)\nprint(a + 1)\n"
      },
      {
        "title": "既定値",
        "pattern": "def f(x, scale=1):",
        "body": "省略可能な引数へ既定値を設定できます。既定値付き引数は通常、必須引数の後ろへ置きます。",
        "code": "def mul(x, scale=1):\n    return x * scale\n"
      }
    ],
    "walkthrough": {
      "title": "合格判定を関数にする",
      "code": "def passed(score):\n    return score >= 60\n\nprint(passed(55))\nprint(passed(72))\n",
      "steps": [
        "scoreは関数が受け取る値の名前です。",
        "比較式はTrueまたはFalseを作るため、そのままreturnできます。",
        "2回呼び出して異なる入力に同じ規則を適用します。"
      ],
      "try": "基準点も引数にするなら、def passed(score, limit):へどのように直せるでしょうか。"
    },
    "checkpoints": [
      {
        "q": "defを書いた時点で関数本体は実行されますか。",
        "a": "実行されません。関数を呼び出したときに実行されます。"
      },
      {
        "q": "計算結果を後で使いたい場合、printとreturnのどちらを使いますか。",
        "a": "returnを使います。"
      }
    ]
  },
  "15-decompose-debug": {
    "lead": [
      "デバッグは、エラーを避けることではなく、原因を小さな範囲へ絞って直す作業です。Tracebackの最後にあるエラー名とメッセージ、問題が起きた行番号から読み始めます。",
      "一度に多くを書き換えると、どの変更が効いたか分かりません。入力を小さくし、途中の値をprint()し、1か所ずつ変更します。"
    ],
    "grammar": [
      {
        "title": "Tracebackの読み順",
        "pattern": "最後の行 → 行番号 → 該当行",
        "body": "NameError、TypeError、IndexErrorなどのエラー名は原因の種類を示します。まず最後の行を読みます。",
        "code": "# NameError: name 'times' is not defined\n"
      },
      {
        "title": "NameError",
        "pattern": "名前が定義されていない",
        "body": "つづり、大文字小文字、定義より前に使っていないかを確認します。",
        "code": "time = 2\nprint(times)  # sが余分\n"
      },
      {
        "title": "TypeError",
        "pattern": "型に合わない操作",
        "body": "type()で左右の値を確認します。文字列と数値を足そうとしていないかなどを調べます。",
        "code": "x = \"3\"\nprint(type(x))\n"
      },
      {
        "title": "小さくテスト",
        "pattern": "最小の入力で確認",
        "body": "関数を作ったら、簡単に答えが分かる値、境界値、空に近い値で試します。",
        "code": "print(mean([2, 4, 6]))\n"
      }
    ],
    "walkthrough": {
      "title": "変数名のずれを直す",
      "code": "dist = 25.0\ntime = 2.0\nspeed = dist / times\nprint(speed)\n",
      "steps": [
        "実行するとNameErrorが起き、timesが定義されていないと表示されます。",
        "上の代入を見ると定義済みの名前はtimeです。",
        "timesをtimeへ1か所だけ修正し、再実行して12.5を確認します。"
      ],
      "try": "エラーを直した後、timeを0にすると別の何というエラーが起きるか試してください。"
    },
    "checkpoints": [
      {
        "q": "Tracebackは上から全部読む必要がありますか。",
        "a": "まず最後のエラー名とメッセージから読み、次に自分のコードの行番号を確認します。"
      },
      {
        "q": "バグ修正で一度に多くを書き換えない方がよいのはなぜですか。",
        "a": "どの変更が原因を直したか、また新しい問題を作ったかを判別しやすくするためです。"
      }
    ]
  },
  "16-integrated": {
    "lead": [
      "少し長い問題では、入力、処理、出力を分け、処理を小さな関数へ分解します。まず「何を受け取り、何を返すか」を文章で決めると、必要なforやifが見えやすくなります。",
      "完成後は、通常の値だけでなく境界値や極端な値を試します。空のlistなど、結果を定義できない入力をどう扱うかも設計の一部です。"
    ],
    "grammar": [
      {
        "title": "入力・処理・出力",
        "pattern": "input → process → output",
        "body": "コードを書く前に、入力データ、適用する規則、欲しい結果を1行ずつ書き出します。",
        "code": "# 入力: nums, low, high\n# 処理: 範囲内だけ選ぶ\n# 出力: その平均\n"
      },
      {
        "title": "小さな関数へ分ける",
        "pattern": "1関数1役割",
        "body": "選ぶ、数える、平均するなど、意味のまとまりへ名前を付けます。複雑な1関数より確認しやすくなります。",
        "code": "def in_range(x, low, high):\n    return low <= x <= high\n"
      },
      {
        "title": "中間結果を作る",
        "pattern": "keep = []",
        "body": "最初は内包表記より、forとifで中間listを作る方が処理順を確認しやすい場合があります。",
        "code": "keep = []\nfor x in nums:\n    if low <= x <= high:\n        keep.append(x)\n"
      },
      {
        "title": "テストを用意する",
        "pattern": "答えが分かる小さな例",
        "body": "[1,2,100,3]から1〜3を選ぶなど、手計算できる入力で関数を確認します。",
        "code": "print(mean_in([1, 2, 100, 3], 1, 3))\n"
      }
    ],
    "walkthrough": {
      "title": "範囲内の平均を組み立てる",
      "code": "def mean_in(nums, low, high):\n    keep = []\n    for x in nums:\n        if low <= x <= high:\n            keep.append(x)\n    return sum(keep) / len(keep)\n",
      "steps": [
        "入力はnumsと範囲low, highです。",
        "条件に合う値だけkeepへ集めます。",
        "ループ後にkeepの合計を個数で割り、結果を返します。"
      ],
      "try": "条件に合う値が1つもない場合をどう扱うべきか、自分の方針を考えてください。"
    },
    "checkpoints": [
      {
        "q": "関数を書く前に決める3要素は何ですか。",
        "a": "入力、処理、出力です。"
      },
      {
        "q": "手計算できる小さな入力で試す利点は何ですか。",
        "a": "期待値が明確なので、誤りを見つけやすいからです。"
      }
    ]
  },
  "17-objects-memory": {
    "lead": [
      "Pythonの変数名は、オブジェクトそのものではなく、オブジェクトへの参照です。数値、文字列、list、関数など、Pythonで扱う値はすべてオブジェクトです。",
      "listのような変更可能オブジェクトを2つの名前が参照すると、一方から変更した結果がもう一方にも見えます。独立させたい場合はcopy()などで別のオブジェクトを作ります。"
    ],
    "grammar": [
      {
        "title": "名前と参照",
        "pattern": "b = a",
        "body": "b=aは内容を必ず複製する操作ではなく、同じオブジェクトをbからも参照できるようにします。",
        "code": "a = [1, 2]\nb = a\n"
      },
      {
        "title": "変更可能性",
        "pattern": "mutable / immutable",
        "body": "listやdictは変更可能、int、float、str、tupleは変更不可です。変更不可の値を更新すると新しいオブジェクトが作られます。",
        "code": "x = 10\nx = x + 1\n"
      },
      {
        "title": "浅いコピー",
        "pattern": "b = a.copy()",
        "body": "1階層のlistを独立させる基本です。入れ子では内側のオブジェクトが共有される場合があり、必要ならdeepcopyを検討します。",
        "code": "a = [1, 2]\nb = a.copy()\nb.append(3)\n"
      },
      {
        "title": "== と is",
        "pattern": "値の等しさ / 同一性",
        "body": "==は内容が等しいか、isは同じオブジェクトかを調べます。通常の数値・文字列比較には==を使います。",
        "code": "a = [1, 2]\nb = [1, 2]\nprint(a == b)\nprint(a is b)\n"
      }
    ],
    "walkthrough": {
      "title": "別名による変化を観察",
      "code": "a = [1, 2]\nb = a\nb.append(3)\nprint(a)\nprint(a is b)\n",
      "steps": [
        "b=aによりaとbは同じlistを参照します。",
        "b.append(3)はその共有listを変更します。",
        "aから見ても[1,2,3]となり、a is bはTrueです。"
      ],
      "try": "b = a.copy()へ変えたとき、aとa is bがどう変わるか確認してください。"
    },
    "checkpoints": [
      {
        "q": "b=aはlistを必ず複製しますか。",
        "a": "複製しません。同じlistへの参照をbにも持たせます。"
      },
      {
        "q": "値が等しいか調べる一般的な演算子は==とisのどちらですか。",
        "a": "==です。isは同じオブジェクトかを調べます。"
      }
    ]
  },
  "18-class-oop": {
    "lead": [
      "classは、関連するデータと処理を新しい型としてまとめる仕組みです。classから作られた具体的な1個のオブジェクトをinstanceと呼びます。",
      "小さな処理ならdictと関数で十分な場合もあります。複数の同種オブジェクトがあり、それぞれが状態と振る舞いを持つとき、classが役立ちます。"
    ],
    "grammar": [
      {
        "title": "classを定義する",
        "pattern": "class Name:",
        "body": "class名は慣例として大文字から始めます。中へメソッドをインデントして書きます。",
        "code": "class Star:\n    pass\n"
      },
      {
        "title": "初期化する",
        "pattern": "def __init__(self, ...):",
        "body": "instance作成時に呼ばれ、引数をself.nameなどの属性へ保存します。selfは作成中のinstance自身です。",
        "code": "class Star:\n    def __init__(self, name):\n        self.name = name\n"
      },
      {
        "title": "instanceを作る",
        "pattern": "obj = Class(args)",
        "body": "class名を関数のように呼ぶとinstanceが作られます。属性はobj.nameの形で参照します。",
        "code": "s = Star(\"Spica\")\nprint(s.name)\n"
      },
      {
        "title": "メソッド",
        "pattern": "def method(self):",
        "body": "instanceの属性を使う処理をclass内へ置きます。呼び出し時はobj.method()とし、selfは自動で渡されます。",
        "code": "def show(self):\n    return f\"Star: {self.name}\"\n"
      }
    ],
    "walkthrough": {
      "title": "状態を持つカウンター",
      "code": "class Counter:\n    def __init__(self):\n        self.n = 0\n\n    def add(self):\n        self.n += 1\n\nc = Counter()\nc.add()\nprint(c.n)\n",
      "steps": [
        "Counter()でinstance cを作ると__init__が実行され、n=0になります。",
        "c.add()を呼ぶとselfはcを指し、c.nが1増えます。",
        "属性nが状態、add()が状態を変える振る舞いです。"
      ],
      "try": "cを2個作ると、それぞれのnは独立するか確認してください。"
    },
    "checkpoints": [
      {
        "q": "selfは何を表しますか。",
        "a": "そのメソッドを呼び出しているinstance自身を表します。"
      },
      {
        "q": "すべての処理をclassにする必要がありますか。",
        "a": "ありません。状態と関連処理を複数の同種オブジェクトへまとめたい場合に有効です。"
      }
    ]
  },
  "19-numpy-array": {
    "lead": [
      "NumPyのndarrayは、同じ型の数値を大量に扱う科学計算向け配列です。Pythonのlistより、要素ごとの計算をまとめて書きやすく、高速に実行できる場合が多くあります。",
      "配列を受け取ったら、shapeで大きさ、dtypeで要素型を確認します。数式を配列へ直接適用するベクトル化がNumPyの中心的な考え方です。"
    ],
    "grammar": [
      {
        "title": "NumPyを読み込む",
        "pattern": "import numpy as np",
        "body": "npという短い別名は広く使われる慣例です。以後np.array()などと書きます。",
        "code": "import numpy as np\n"
      },
      {
        "title": "配列を作る",
        "pattern": "np.array(list)",
        "body": "listからndarrayを作れます。同じ配列では基本的に1つのdtypeへそろえられます。",
        "code": "x = np.array([1, 2, 3], dtype=float)\n"
      },
      {
        "title": "shapeとdtype",
        "pattern": "x.shape / x.dtype",
        "body": "shapeは各軸の長さ、dtypeは要素のデータ型です。2行3列ならshapeは(2,3)です。",
        "code": "a = np.array([[1,2,3],[4,5,6]])\nprint(a.shape, a.dtype)\n"
      },
      {
        "title": "ベクトル化",
        "pattern": "y = 3 * x + 2",
        "body": "配列全体へ式を書けば、各要素へ同じ計算が適用されます。明示的なforを短く表せます。",
        "code": "x = np.array([0, 1, 2])\ny = 3 * x + 2\n"
      }
    ],
    "walkthrough": {
      "title": "等間隔の点へ式を適用",
      "code": "import numpy as np\nx = np.linspace(0, 1, 5)\ny = 3 * x + 2\nprint(x)\nprint(y)\n",
      "steps": [
        "linspace(0,1,5)は両端を含む5点を作ります。",
        "3*xは全要素を3倍し、+2も全要素へ適用されます。",
        "xとyは同じshapeのndarrayになります。"
      ],
      "try": "np.arange(0, 1, 0.25)との端点の違いを確認してください。"
    },
    "checkpoints": [
      {
        "q": "ndarrayの大きさを確認する属性は何ですか。",
        "a": "shapeです。"
      },
      {
        "q": "3*x+2は配列の先頭要素だけへ適用されますか。",
        "a": "いいえ。全要素へ適用されます。"
      }
    ]
  },
  "20-numpy-index-ufunc": {
    "lead": [
      "NumPy配列はlistに似たインデックスやスライスを使えますが、多次元の軸、ブール配列による抽出、配列全体へ働くufuncが加わります。",
      "条件式data > 0は1個のboolではなく、各要素に対応するbool配列を返します。それをdata[...]へ入れるとTrueの位置だけを抽出できます。"
    ],
    "grammar": [
      {
        "title": "多次元の位置",
        "pattern": "a[行, 列]",
        "body": "2次元配列ではカンマで軸ごとの位置を指定します。a[:,0]は全行の0列目です。",
        "code": "a = np.array([[1,2],[3,4]])\nprint(a[:, 0])\n"
      },
      {
        "title": "集約とaxis",
        "pattern": "a.mean(axis=...)",
        "body": "axis=0は0番軸をたたみ、列ごとの結果になります。axis=1は行ごとです。shapeを見ながら考えます。",
        "code": "print(a.mean(axis=0))\nprint(a.mean(axis=1))\n"
      },
      {
        "title": "ufunc",
        "pattern": "np.sin(a)",
        "body": "NumPyの関数は配列の各要素へまとめて適用されます。math.sinは通常、配列全体を直接扱えません。",
        "code": "x = np.array([0, np.pi/2])\nprint(np.sin(x))\n"
      },
      {
        "title": "ブール抽出",
        "pattern": "a[条件]",
        "body": "条件からbool maskを作り、Trueの要素だけを取り出します。複数条件は各条件を括弧で囲み、&や|で結びます。",
        "code": "data = np.array([-1, 0, 2])\nprint(data[data >= 0])\n"
      },
      {
        "title": "np.where",
        "pattern": "np.where(cond, A, B)",
        "body": "条件ごとにAまたはBを選び、元と同じshapeの配列を作ります。",
        "code": "tag = np.where(data >= 0, \"plus\", \"minus\")\n"
      }
    ],
    "walkthrough": {
      "title": "0から1の値だけ選ぶ",
      "code": "import numpy as np\ndata = np.array([-0.2, 0.0, 0.4, 1.0, 1.3])\nmask = (data >= 0) & (data <= 1)\nselected = data[mask]\nprint(selected)\n",
      "steps": [
        "2つの比較がそれぞれbool配列を作ります。",
        "括弧で囲んだ条件を&で要素ごとに結びます。",
        "maskがTrueの位置だけをdataから抽出します。"
      ],
      "try": "&を|へ変えると、どの値が選ばれるか考えてください。"
    },
    "checkpoints": [
      {
        "q": "data > 0の結果は1個のTrue/Falseですか。",
        "a": "いいえ。各要素に対応したbool配列です。"
      },
      {
        "q": "NumPyの複数条件でandではなく&を使うのはなぜですか。",
        "a": "配列要素ごとの論理演算を行うためです。各条件は括弧で囲みます。"
      }
    ]
  },
  "21-data-io": {
    "lead": [
      "外部データを読み込むとき、最初から計算へ進まず、shape、dtype、先頭数行を確認します。列数、区切り文字、ヘッダの有無が想定と違うだけで、後の計算が誤るためです。",
      "欠損のない数値表にはloadtxt、欠損を含む可能性がある表にはgenfromtxtが便利です。読み込み後は列を取り出し、意味のある短い名前へ割り当てます。"
    ],
    "grammar": [
      {
        "title": "CSVを読む",
        "pattern": "np.loadtxt(path, delimiter=\",\", skiprows=1)",
        "body": "delimiterは区切り、skiprowsは読み飛ばす先頭行数です。ファイルの実際の形式に合わせます。",
        "code": "data = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\n"
      },
      {
        "title": "読み込み三点セット",
        "pattern": "shape / dtype / head",
        "body": "読み込んだ直後に大きさ、型、先頭を表示し、想定と一致するか確認します。",
        "code": "print(data.shape)\nprint(data.dtype)\nprint(data[:5])\n"
      },
      {
        "title": "列を取り出す",
        "pattern": "data[:, col]",
        "body": "全行の指定列を1次元配列として取り出します。列番号は0からです。",
        "code": "t = data[:, 0]\ny = data[:, 1]\n"
      },
      {
        "title": "CSVへ保存",
        "pattern": "np.savetxt(...)",
        "body": "delimiter、header、fmtなどを明示すると、後で読み直しやすいファイルになります。",
        "code": "out = np.column_stack([t, y])\nnp.savetxt(\"out.csv\", out, delimiter=\",\", header=\"t,y\", comments=\"\")\n"
      }
    ],
    "walkthrough": {
      "title": "読み込んで平均する",
      "code": "import numpy as np\ndata = np.loadtxt(\"experiment.csv\", delimiter=\",\", skiprows=1)\nprint(data.shape, data.dtype)\nprint(data[:3])\ny = data[:, 1]\nprint(y.mean())\n",
      "steps": [
        "CSVを2次元配列dataとして読みます。",
        "三点セットで12行3列の数値表かを確認します。",
        "1列目をyへ取り出し、その平均を計算します。"
      ],
      "try": "data[1,:]とdata[:,1]の違いを実行して確かめてください。"
    },
    "checkpoints": [
      {
        "q": "データ読み込み直後に確認する三点は何ですか。",
        "a": "shape、dtype、先頭数行です。"
      },
      {
        "q": "data[:,0]は何を表しますか。",
        "a": "全行の0列目を表します。"
      }
    ]
  },
  "22-missing-save": {
    "lead": [
      "実データには欠損値NaNや無限大infが含まれることがあります。通常の平均へNaNが1つ入ると結果もNaNになるため、欠損を確認し、除外、補間、欠損対応関数のどれが妥当か判断します。",
      "欠損を機械的に0へ置き換えるとデータの意味を変える可能性があります。処理方法と理由を記録することが重要です。"
    ],
    "grammar": [
      {
        "title": "欠損と有限値を調べる",
        "pattern": "np.isnan / np.isfinite",
        "body": "isnanはNaN、isfiniteはNaNと±infを除いた有限値を判定します。",
        "code": "mask = np.isfinite(data)\nclean = data[mask]\n"
      },
      {
        "title": "NaN対応集約",
        "pattern": "np.nanmeanなど",
        "body": "NaNを無視する関数ですが、無視してよいという判断が先です。欠損数も同時に確認します。",
        "code": "print(np.isnan(data).sum())\nprint(np.nanmean(data))\n"
      },
      {
        "title": "対応を保った並べ替え",
        "pattern": "order = np.argsort(x)",
        "body": "xを並べる順序のインデックスを作り、関連するyにも同じorderを適用します。",
        "code": "order = np.argsort(x)\nprint(x[order])\nprint(y[order])\n"
      },
      {
        "title": "保存形式",
        "pattern": "CSV / NPY / NPZ",
        "body": "CSVは交換しやすく、NPYは1配列、NPZは複数配列のdtypeとshapeを保ちやすい形式です。目的で選びます。",
        "code": "np.save(\"data.npy\", data)\nnp.savez(\"result.npz\", x=x, y=y)\n"
      }
    ],
    "walkthrough": {
      "title": "有限値だけで平均する",
      "code": "import numpy as np\ndata = np.array([1.0, np.nan, 2.0, np.inf, 3.0])\nclean = data[np.isfinite(data)]\nprint(clean)\nprint(clean.mean())\n",
      "steps": [
        "isfiniteが各要素のbool maskを作ります。",
        "Trueの1.0、2.0、3.0だけをcleanへ取り出します。",
        "有限値だけの平均は2.0です。"
      ],
      "try": "np.mean(data)とnp.nanmean(data)がそれぞれどうなるか比較してください。"
    },
    "checkpoints": [
      {
        "q": "NaNを0へ置き換える前に何を考えるべきですか。",
        "a": "欠損が本当に0を意味するか、除外や補間が妥当かというデータの意味です。"
      },
      {
        "q": "np.sortとnp.argsortの違いは何ですか。",
        "a": "sortは並べた値、argsortは並び順のインデックスを返します。"
      }
    ]
  },
  "23-matplotlib": {
    "lead": [
      "可視化は、数値の並びを形として観察し、変化、関係、分布、外れ値を見つけるための方法です。図の種類は見栄えではなく、何を確かめたいかで選びます。",
      "第三者が読み取れる図には、軸名、単位、必要な凡例やタイトルを付けます。軸範囲や点の結び方は解釈を変えるため、データにない連続性を作らないよう注意します。"
    ],
    "grammar": [
      {
        "title": "FigureとAxes",
        "pattern": "fig, ax = plt.subplots()",
        "body": "Figureは図全体、Axesはグラフを描く領域です。axへ描画やラベル設定をまとめると整理しやすくなります。",
        "code": "fig, ax = plt.subplots()\n"
      },
      {
        "title": "図の種類を選ぶ",
        "pattern": "plot / scatter / hist",
        "body": "順序ある変化はplot、2変数の関係はscatter、1変数の分布はhistが基本です。",
        "code": "ax.plot(x, y)\nax.scatter(x, y)\nax.hist(y)\n"
      },
      {
        "title": "軸と単位",
        "pattern": "set_xlabel / set_ylabel",
        "body": "量の名前と単位を明示します。単位がなければ数値の尺度を正しく解釈できません。",
        "code": "ax.set_xlabel(\"Time [s]\")\nax.set_ylabel(\"Distance [m]\")\n"
      },
      {
        "title": "整えて表示・保存",
        "pattern": "tight_layout / show / savefig",
        "body": "tight_layout()で重なりを減らし、show()で表示、savefig()で画像へ保存します。保存はshow()より前に行うと安全です。",
        "code": "fig.tight_layout()\nfig.savefig(\"figure.png\", dpi=150)\nplt.show()\n"
      },
      {
        "title": "数値要約と併用",
        "pattern": "平均だけで終わらない",
        "body": "同じ平均や相関でも形が異なる場合があります。元データの図も確認して外れ値や群構造を見ます。",
        "code": ""
      }
    ],
    "walkthrough": {
      "title": "時間変化を描く",
      "code": "import matplotlib.pyplot as plt\nx = [0, 1, 2, 3]\ny = [0, 1, 4, 9]\nfig, ax = plt.subplots()\nax.plot(x, y, marker=\"o\")\nax.set_xlabel(\"Time [s]\")\nax.set_ylabel(\"Distance [m]\")\nfig.tight_layout()\nplt.show()\n",
      "steps": [
        "subplots()でFigureとAxesを作ります。",
        "順序のある時間変化なのでplotを選び、点も見えるようmarkerを付けます。",
        "x軸とy軸へ量と単位を付けてから表示します。"
      ],
      "try": "同じデータをscatterで描き、線で結ぶ情報がなくなると印象がどう変わるか比べてください。"
    },
    "checkpoints": [
      {
        "q": "2変数の関係を点で調べる基本的な図は何ですか。",
        "a": "散布図scatterです。"
      },
      {
        "q": "軸ラベルへ単位を付ける理由は何ですか。",
        "a": "数値の尺度と物理的意味を正しく解釈・比較できるようにするためです。"
      }
    ]
  }
};
