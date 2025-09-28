from base64 import b64decode, b32decode, b85decode
import sys
import os

if len(sys.argv) < 2:
    print(f"Usage: python3 {os.path.basename(sys.argv[0])} <encoded_file_path>")
    print("Decodes a file that was encoded.")
    sys.exit(1)

fn = sys.argv[1]
t = ""

try:
    with open(fn, "r") as f:
        t = f.read()
except FileNotFoundError:
    print(f"Error: The file '{fn}' was not found.")
except Exception as e:
    print(f"An error occurred: {e}")

rt = t[::-1]

dt = b64decode(b32decode(b85decode(rt))).decode('utf-8')

dfn = f"{fn}.decoded"

with open(dfn, "w") as f:
    f.write(dt)

print(f"Decoded file written to {dfn}")