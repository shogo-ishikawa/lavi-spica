/** 講義資料の正規レジストリ。URLは各画面へ直書きせず、必ずIDで参照します。 */
export const MATERIALS = Object.freeze({
  "colab-variables": { id: "colab-variables", title: "変数・代入・型・出力", type: "colab", access: "enrolled", url: "https://colab.research.google.com/drive/1Semh_Yi_RwwMUPti4oUgh_6iW8xKdXXf?usp=sharing", description: "1_variables.ipynb。変数、代入、型、出力を扱う講義notebookです。" },
  "colab-basic-features": { id: "colab-basic-features", title: "Pythonの基本的な機能", type: "colab", access: "enrolled", url: "https://colab.research.google.com/drive/1fRdLJvOBjPUbVMVzZKSOR-X2Matev0em?usp=sharing", description: "2_basic_features.ipynb。コメント、import、math、リスト、辞書などを扱います。" },
  "colab-loop-branch": { id: "colab-loop-branch", title: "ループと条件分岐", type: "colab", access: "enrolled", url: "https://colab.research.google.com/drive/1K5hDMd_GQqxWp3Ac9R77MraQX3kmZrpr?usp=sharing", description: "3_loop_and_branch.ipynb。range、for、while、ifを扱います。" },
  "colab-functions": { id: "colab-functions", title: "自作関数", type: "colab", access: "enrolled", url: "https://colab.research.google.com/drive/1ipS5l5G1uW9OGczT-dg8Y8YN4oXFaw-w?usp=sharing", description: "4_def_function.ipynb。関数定義、引数、returnを扱います。" },
  "pdf-oop": { id: "pdf-oop", title: "オブジェクト指向の導入", type: "pdf", access: "public", url: "https://www.dropbox.com/scl/fi/681xl6g07mam8uf3nf5vj/introducing_oop.pdf?rlkey=j9eugcjmxzfcm4omyxz5370vd&st=49xk0hhn&dl=0", description: "introducing_oop.pdf。オブジェクト、属性、メソッド、クラスの追加講義資料です。" },
  "pdf-numpy-basic": { id: "pdf-numpy-basic", title: "NumPyの基礎", type: "pdf", access: "public", url: "https://www.dropbox.com/scl/fi/b37pmxcpucdbmnibanf4v/numpy_basic.pdf?rlkey=e13ruqrw7b1ilwxi59p5n11i0&st=njt1eh3c&dl=0", description: "numpy_basic.pdf。NumPy配列、shape、dtype、添字、配列演算の追加講義資料です。" },
  "pdf-numpy-analysis": { id: "pdf-numpy-analysis", title: "NumPyによるデータ解析", type: "pdf", access: "public", url: "https://www.dropbox.com/scl/fi/8dgfce36of0wu69imeajh/numpy_data_analysis.pdf?rlkey=rvfffhukf7bjo0bbbg3j68af1&st=kwto963y&dl=0", description: "numpy_data_analysis.pdf。データの読み込み、処理、解析の追加講義資料です。" },
});

export const ENROLLED_NOTICE = "このColab資料は履修者限定です。授業のGoogle Classroomに参加しているGoogleアカウントで開いてください。開けない場合は、利用中のアカウントとClassroomへの参加状況を確認してください。";
