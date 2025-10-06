#!/usr/bin/env bash
set -euo pipefail

if [ "$PWD" = "$HOME" ]; then
  cd "$HOME"
fi

mkdir -p ~/.oph-tmp
mkdir -p ~/oph2025

curl -fsSL -o ~/.oph-tmp/demo.tar.gz https://objects.guntxjakka.me/demo.tar.gz

tar -xzf ~/.oph-tmp/demo.tar.gz -C ~/oph2025

rm -rf ~/.oph-tmp

cp -Rn ~/oph2025/kfcmd-demo/* ~/oph2025/

rm -rf ~/oph2025/kfcmd-demo
