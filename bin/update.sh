#! /usr/bin/env sh
set -e

git pull
pnpm install
pnpm run build
pm2 restart gab-alarm
