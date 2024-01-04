#! /usr/bin/env sh

git pull
pnpm install
pnpm run build
pm2 restart gabalarm
