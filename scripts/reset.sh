#!/usr/bin/env bash
set -euo pipefail

if [ "$(basename "$PWD")" != "oph2025" ]; then
  echo "You are not in oph2025"
  exit 1
fi

mkdir -p ~/.oph-tmp

curl -fsSL -o ~/.oph-tmp/demo.tar.gz https://objects.guntxjakka.me/demo.tar.gz

rm -rf ./{*,.*}

tar -xzf ~/.oph-tmp/demo.tar.gz -C .

rm -rf ~/.oph-tmp

cp -Rn ./kfcmd-demo/* .

rm -rf ./kfcmd-demo