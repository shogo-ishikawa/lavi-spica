#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

APP_NAME="LAVi-SPICA"
VERSION="$(cat VERSION 2>/dev/null || printf '1.1.0')"
COMMIT_MESSAGE="Update ${APP_NAME} to v${VERSION}"

printf '\n%s\n' "${APP_NAME} v${VERSION} — GitHub HTTPS push"
printf '%s\n\n' "Working directory: $(pwd)"

if [ ! -f "index.html" ] || [ ! -f "package.json" ] || [ ! -f "assets/lavi-spica-hero.png" ]; then
  printf '%s\n' "Error: Run this command inside the LAVi-SPICA vX.Y.Z directory." >&2
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  printf '%s\n' "Error: git is not installed or is not on PATH." >&2
  exit 1
fi

if [ ! -d .git ]; then
  git init -b main
else
  git branch -M main
fi

for protected_file in teacher/teacher.js teacher/question-bank.js teacher/answer-key.js; do
  if ! git check-ignore -q "$protected_file" 2>/dev/null; then
    printf '%s\n' "Error: teacher/ is not excluded by .gitignore. Push was stopped to protect instructor-only files." >&2
    exit 1
  fi
done

if [ -z "$(git config --get user.name 2>/dev/null || true)" ]; then
  printf 'Git commit author name: '
  IFS= read -r GIT_NAME
  [ -n "$GIT_NAME" ] || { printf '%s\n' "Author name is required." >&2; exit 1; }
  git config user.name "$GIT_NAME"
fi

if [ -z "$(git config --get user.email 2>/dev/null || true)" ]; then
  printf 'Git commit author email: '
  IFS= read -r GIT_EMAIL
  [ -n "$GIT_EMAIL" ] || { printf '%s\n' "Author email is required." >&2; exit 1; }
  git config user.email "$GIT_EMAIL"
fi

REPO_URL="${SPICA_REPOSITORY_URL:-}"
if [ -z "$REPO_URL" ]; then
  printf 'GitHub repository HTTPS URL (example: https://github.com/ACCOUNT/lavi-spica.git): '
  IFS= read -r REPO_URL
fi

case "$REPO_URL" in
  https://*) ;;
  *) printf '%s\n' "Error: An HTTPS repository URL is required." >&2; exit 1 ;;
esac

case "$REPO_URL" in
  https://*@*)
    printf '%s\n' "Error: Do not embed a username, password, or token in the repository URL." >&2
    exit 1
    ;;
esac

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

if [ "${SPICA_PREPARE_ONLY:-0}" != "1" ]; then
  printf '\n%s\n' "Checking origin/main..."
  if git ls-remote --exit-code --heads origin main >/dev/null 2>&1; then
    git fetch origin main
    if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
      git reset --mixed origin/main
    elif ! git merge-base --is-ancestor origin/main HEAD >/dev/null 2>&1; then
      printf '%s\n' "The local history does not contain origin/main." >&2
      printf '%s' "Use origin/main as the base while keeping the current files? [y/N]: "
      IFS= read -r ANSWER
      case "$ANSWER" in
        y|Y|yes|YES) git reset --mixed origin/main ;;
        *) printf '%s\n' "Cancelled without changing the remote."; exit 1 ;;
      esac
    fi
  fi
fi

git add -A

if [ -n "$(git ls-files 'teacher/*')" ]; then
  printf '%s\n' "Error: instructor-only files under teacher/ are staged or tracked. Push was stopped." >&2
  exit 1
fi

if git diff --cached --quiet; then
  printf '%s\n' "No file changes to commit. The existing commit will be pushed."
else
  git commit -m "$COMMIT_MESSAGE"
fi

git branch -M main

if [ "${SPICA_PREPARE_ONLY:-0}" = "1" ]; then
  printf '\n%s\n' "Prepared the local Git commit. Push was skipped because SPICA_PREPARE_ONLY=1."
  printf '%s\n' "The teacher/ directory remains only on this computer."
  exit 0
fi

printf '\n%s\n' "Pushing to GitHub over HTTPS..."
git push -u origin main

printf '\n%s\n' "Push completed."
printf '%s\n' "The student app is in the repository; teacher/ and its answer key remain local."
printf '%s\n' "For GitHub Pages, set Settings → Pages → Source to GitHub Actions."
