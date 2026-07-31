# LAVi-SPICA Cloud v1.5.0 初回セットアップ

この版では、旧GAS Backend/Gatewayを使用しません。個人Googleアカウントが所有する一つのFirebaseプロジェクトに、次をまとめます。

- Firebase Hosting：教員用管理コンソールと学生用小テスト入口
- Firebase Authentication：Googleアカウントの選択と本人確認
- Cloud Firestore：クラス、授業回、QR認証、救済申請、提出回答
- Firestore Security Rules：本番提出を`@g.nihon-u.ac.jp`へ限定

GitHub Pagesは、Python lessonと小テストの問題表示エンジンを引き続き担当します。

## 0. 使用するアカウント

Firebaseプロジェクトは、管理用の個人Googleアカウントで作成します。二段階認証を有効にし、授業専用または管理専用のアカウントを推奨します。

実在学生の学籍番号、氏名、Googleメール、認証時刻、回答が保存されます。利用にあたっては、大学・授業の情報管理方針を確認してください。

## 1. Firebaseプロジェクトを作る

1. 個人GoogleアカウントでFirebase Consoleを開く。
2. 「プロジェクトを作成」を選ぶ。
3. 例として`lavi-spica-cloud`のようなproject IDを設定する。
4. Google Analyticsは、この教材では必須ではありません。

## 2. Googleログインを有効にする

Firebase Consoleで次を開きます。

```text
Authentication
→ 始める
→ Sign-in method
→ Google
→ 有効にする
```

プロジェクトのサポートメールには管理用個人Googleアカウントを指定します。

学生はGoogleのアカウント選択画面からNUメールを選べます。本番授業回に対するFirestore書込みは、Security Rulesが`@g.nihon-u.ac.jp`かつ確認済みGoogleアカウントであることを検査します。

## 3. Firestore Databaseを作る

```text
Firestore Database
→ データベースを作成
```

- ロケーション：授業で使う地域に近いものを選ぶ
- モード：本番モード

「テストモード」は使用しません。`firebase/firestore.rules`をデプロイして必要な操作だけを許可します。

## 4. Firebase Webアプリを登録する

```text
プロジェクトの設定
→ マイアプリ
→ ウェブ（</>）
```

アプリ名は`LAVi-SPICA Cloud`などとします。表示されたFirebase SDK設定から、次を控えます。

```text
apiKey
projectId
storageBucket
messagingSenderId
appId
```

## 5. ローカル設定を作る

ターミナルで次を実行します。

```bash
cd /Users/shogo/Dropbox/share_data/open_material/misc/apps/SPICA/v1.5.0/firebase
./configure-firebase.command
```

画面に従い、Firebase Web設定とGitHub Pages URLを入力します。

```text
https://shogo-ishikawa.github.io/lavi-spica/
```

次の二つが作成されます。

```text
firebase/.firebaserc
firebase/hosting/js/firebase-config.js
```

Firebase Web設定はブラウザアプリの識別情報で、サービスアカウント秘密鍵ではありません。ただし、`firebase/`全体はGitHubから除外され、ローカル管理用として扱います。

## 6. Firebaseへ初回デプロイする

```bash
cd /Users/shogo/Dropbox/share_data/open_material/misc/apps/SPICA/v1.5.0/firebase
./deploy-cloud.command
```

初回はFirebase CLIが個人Googleアカウントへのログインを求めます。デプロイ対象は次です。

```text
Firestore Security Rules
Firestore index定義
Firebase Hosting
```

完了後のURLは概ね次です。

```text
学生入口：https://PROJECT_ID.web.app/student.html
教員画面：https://PROJECT_ID.web.app/teacher.html
```

## 7. 最初の管理者UIDを登録する

1. `https://PROJECT_ID.web.app/teacher.html`を開く。
2. 管理用個人Googleアカウントを選ぶ。
3. 画面に表示されたFirebase UIDをコピーする。
4. Firebase ConsoleのFirestore Databaseを開く。
5. `admins` collectionを作成する。
6. コピーしたUIDをdocument IDにする。
7. 次のfieldsを追加する。

| field | type | value |
|---|---|---|
| `active` | boolean | `true` |
| `email` | string | 管理用個人Googleアカウント |
| `name` | string | 任意の管理者名 |

教員画面へ戻り、「管理者登録を確認」を押します。

管理者を追加する場合も、対象者に教員画面へ一度ログインしてUIDを表示してもらい、同様に`admins`へ追加します。

## 8. 公開教材URLを保存する

教員用管理コンソールの「接続設定」で、GitHub PagesのLAVi-SPICA URLを保存します。

```text
https://shogo-ishikawa.github.io/lavi-spica/
```

このURLの`quiz/`が、Firebase Hostingの学生画面内へ安全なiframeとして読み込まれます。

## 9. 非公開問題バンクを読み込む

教員用管理コンソールの「非公開問題バンク」で、次を選びます。

```text
firebase/private/question-bank-v1.5.0.json
```

56問の問題、正答、解説、コード隠しテストがFirestoreの管理者専用collectionへ保存されます。学生はSecurity Rulesにより`questionBank`を読めません。学生が受験時に受け取るのは、選択された問題文・選択肢・開始コードだけです。

## 10. クラスを登録する

クラス数に固定上限はありません。年度をIDへ含めると整理しやすくなります。

```text
クラスID：2026-3Q-Tue3Fri3
表示名：2026年度 3Q Tue3/Fri3
年度：2026
クォーター：3Q
曜日・時限：Tue3 / Fri3
```

一つのFirebase環境で同時にactiveにできる授業回は一つです。順番に開講するクラスは同じ環境で管理できます。

## 11. 教員テストを行う

最初は次の短い設定を推奨します。

```text
実施区分：教員テスト
問題数：3問
回答時間：3分
送信猶予：5秒
QR受付：60秒
認証回数：1回
```

教員テストでは管理者Googleアカウントが仮想学生になります。

```text
学籍番号：TEST-XXXXXXXX
氏名：教員テスト
```

テストの流れは`OPERATIONS_GUIDE.md`を参照してください。

## 12. `open-teacher.command`へ教員URLを登録する

versionディレクトリ直下で次を実行します。

```bash
cd /Users/shogo/Dropbox/share_data/open_material/misc/apps/SPICA/v1.5.0
./open-teacher.command
```

初回だけFirebase Hostingの教員画面URLを入力します。

```text
https://PROJECT_ID.web.app/teacher.html
```

以後は、次の二画面が同時に開きます。

- Firebase上の`LAVi-SPICA 教員用管理コンソール`
- ローカルの回答採点画面

URLを変更するときは次を実行します。

```bash
rm .spica-cloud-url
./open-teacher.command
```

## 13. 本番前の確認

- 教員テストでQR認証、PC開放、提出、bundle保存まで成功する
- Firestoreの`checkins`と`submissions`へ記録される
- 個人Gmailなど学生以外のアカウントでは本番授業回へ提出できない
- 実学生1名の`@g.nihon-u.ac.jp`でログイン・提出できる
- GitHub Pagesの`quiz/`がiframe内で表示される
- スマートフォンなしの教員確認申請を承認できる
