import sys
from base64 import b64encode, b32encode, b85encode

fn = sys.argv[1]
t = ""

try:
    with open(fn, "r") as f:
        t = f.read()
except FileNotFoundError:
    print(f"Error: The file '{fn}' was not found.")
except Exception as e:
    print(f"An error occurred: {e}")


pr_et = b85encode(b32encode(b64encode(t.encode('utf-8')))).decode('utf-8')

et = pr_et[::-1]

print(et)

with open(f"{fn}.enc", "x") as f:
    f.write(et)