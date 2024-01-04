#! /usr/bin/env sh

git pull
pnpm install
pnpm build dev
pm2 restart gabalarm
