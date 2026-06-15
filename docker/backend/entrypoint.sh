#!/bin/sh
set -e

mkdir -p \
    storage/framework/cache \
    storage/framework/data \
    storage/framework/sessions \
    storage/framework/testing \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache || true
chmod -R ug+rwX storage bootstrap/cache || true

exec docker-php-entrypoint "$@"
