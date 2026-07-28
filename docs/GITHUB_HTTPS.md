# GitHubへHTTPSで公開する

## 1. 前提

GitHub上に空のrepositoryを作成してください。推奨repository名は `lavi-spica` です。初回公開時は、GitHub側でREADME、`.gitignore`、Licenseを自動生成しない方が手順が単純です。

repositoryのHTTPS URLは次の形式です。

```text
https://github.com/ACCOUNT/lavi-spica.git
```

URLへaccess tokenやpasswordを直接埋め込まないでください。

## 2. 同梱scriptを使う

release directoryで次を実行します。

```bash
chmod +x publish-github-https.command
./publish-github-https.command
```

scriptは次を行います。

1. 現在のdirectoryがLAVi-SPICA releaseであることを確認
2. Git repositoryを初期化
3. HTTPS remote `origin`を登録
4. remoteの`main`が存在する場合は、その履歴を現在のreleaseへ接続
5. release内容をcommit
6. `main`へpush

これにより、各releaseを別の`vX.Y.Z` directoryへ展開しても、同じGitHub repositoryの履歴を引き継いで更新できます。

## 3. HTTPS認証

GitHub accountの通常passwordによるGit操作は使用できません。次のいずれかを使います。

- **Git Credential Manager**：browser認証とmacOS Keychain保存を利用できる推奨方式
- **Personal Access Token**：password入力欄へtokenを入力

Git Credential Managerの案内：

```text
https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git
```

GitHub認証の案内：

```text
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github
```

## 4. 手動で行う場合

新規repositoryへ初回公開する基本commandは次です。

```bash
git init -b main
git add -A
git commit -m "Release LAVi-SPICA v1.0.0"
git remote add origin https://github.com/ACCOUNT/lavi-spica.git
git push -u origin main
```

別のversion directoryから既存repositoryを更新する場合は、remoteの履歴を先に取得し、現在のworking treeをその次のcommitとして登録します。

```bash
git init -b main
git remote add origin https://github.com/ACCOUNT/lavi-spica.git
git fetch origin main
git reset --mixed origin/main
git add -A
git commit -m "Release LAVi-SPICA vX.Y.Z"
git push -u origin main
```

`git reset --mixed origin/main`はremoteのcommitを現在のbranchの基点にしつつ、展開済みreleaseのファイルをworking treeに残します。その後の`git add -A`で、旧versionとの差分を新しいcommitとして登録します。

## 5. GitHub Pages

初回push後、GitHub repositoryで次を設定します。

1. **Settings**
2. **Pages**
3. **Build and deployment**
4. **Source: GitHub Actions**

同梱workflowが検証後に静的siteを公開します。

```text
.github/workflows/deploy-pages.yml
```

公開URLの基本形は次です。

```text
https://ACCOUNT.github.io/lavi-spica/
```

## 6. tokenや個人情報をcommitしない

次をrepositoryへ保存しないでください。

- Personal Access Token
- password
- macOS Keychainのexport
- `.env`内の秘密情報
- 個人環境の絶対PATH
- 学生の小テスト結果JSONや学籍番号一覧

`publish-github-https.command`はtokenをfileへ保存せず、remote URLへcredentialが埋め込まれている場合は拒否します。
