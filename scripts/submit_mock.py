import requests
import os

host = "http://localhost:3000"


employees = [
    {
        id: 0,
        "n": "U3V3YXQgQ2hlYWNoaXJhbm9u",
        "ni": "K5QXI===",
        "s": None,
        "p": "Q0VP"
    },
    {
        id: 1,
        "n": "SmlyYXRjaGF5YSBCb3JpYm9vbnNhd2F0",
        "ni": "JRXW2LLOMFXQ====",
        "s": None,
        "p": ""
    },
    {
        id: 2,
        "n": "UG9vbWlwYXQgTWFoYXRoZXA=",
        "ni": "Poom",
        "s": None,
        "p": "VGFsZW50IE1hbmFnZXI="
    },
    {
        id: 3,
        "n": "UG90c2F3YXQgU2FlLXlhbmc=",
        "ni": "JJQXS===",
        "s": None,
        "p": "UFIgTWFuYWdlcg=="
    },
    {
        id: 4,
        "n": "VGhhbW9ud2FuIFBhdHRhbmFwcmFzaXRjaG90ZQ==",
        "ni": "JVXW62Y=",
        "s": "KNSXEYLQNBUW4ZI=",
        "p": "VGFsZW50"
    },
    {
        id: 5,
        "n": "TmF0dGhhcmlrYSBXYW5uYQ==",
        "ni": "JJSSA5BHMFUW2ZI=",
        "s": "JJQXMYLSNFXGC===",
        "p": "VGFsZW50"
    },
    {
        id: 6,
        "n": "Q2hyaXN0aW4gQW5uZSBMYXVyZW50",
        "ni": "INUHE2LTORUW4===",
        "s": "KBUXQZLMNRSQ====",
        "p": "VGFsZW50"
    },
    {
        id: 7,
        "n": "UHJlYXdhaCBTdXdhbm5ha3Vs",
        "ni": "INUGY33F",
        "s": "KZSWG5DSME======",
        "p": "VGFsZW50"
    },
]

gid = int(input("Enter your group number: "))

ans = int(input("Enter the employee id of the culprit: "))
from base64 import b16decode as a, b32decode as b, b64decode as c, b85decode as d
print("\n------ Confirming ------")
print(f"Group id: {gid}")
print(f"Answer picked: {ans}")
print(f"Name: {c(employees[ans]['n']).decode('utf-8')}")
print(f"Nickname: {b(employees[ans]['ni']).decode('utf-8')}")
if employees[ans]['s'] is not None: print(f"Stage Name: {b(employees[ans]['s']).decode('utf-8')}")
print(f"Position: {c(employees[ans]['p']).decode('utf-8')}")
print("\n")

confirm = input("Confirm this answer? [y/N]: ")

if confirm.lower() == 'y':
    res = requests.post(f"{host}/submit", json={
        "gid": gid,
        "ans": ans
    })
    print(res.reason)
    if res.status_code == 201:
        print("Answer submitted. Tell your TA that you've submitted your answer to double check kub.")
    elif res.status_code == 403:
        print("You already submitted your answer! If not, tell your TA to check.")
    else:
        print("Submission failed! try again.")
else:
    print("Exiting...")