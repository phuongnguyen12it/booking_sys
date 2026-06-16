#!/bin/sh
set -e

if [ -f package.json ] && [ ! -x node_modules/.bin/vite ]; then
    npm install
fi

exec "$@"
