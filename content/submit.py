h = "aHR0cDovLzEwLjM1LjI3LjEwMg=="

e = [
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

from base64 import b16decode as a, b32decode as b, b64decode as c, b85decode as d

gid = int(input(b("IVXHIZLSEB4W65LSEBTXE33VOAQG45LNMJSXEORA").decode("utf-8")))
ans = int(input(b("IVXHIZLSEB2GQZJAMVWXA3DPPFSWKIDJMQQG6ZRAORUGKIDDOVWHA4TJOQ5CA===").decode("utf-8")))

print("\n------ Confirming ------")
print(f"{b('I5ZG65LQEBUWIOQ=').decode('utf-8')} {gid}")
print(f"{c('QW5zd2VyIHBpY2tlZDo=').decode('utf-8')} {ans}")
print(f"{c('TmFtZTo=').decode('utf-8')} {c(e[ans]['n']).decode('utf-8')}")
print(f"{b('JZUWG23OMFWWKOQ=').decode('utf-8')} {b(e[ans]['ni']).decode('utf-8')}")
if e[ans]['s'] is not None: print(f"{c('U3RhZ2UgTmFtZTo=').decode('utf-8')} {b(e[ans]['s']).decode('utf-8')}")
print(f"{c('UG9zaXRpb246').decode('utf-8')} {c(e[ans]['p']).decode('utf-8')}")
print("\n")

cfm = input(c('Q29uZmlybSB0aGlzIGFuc3dlcj8gW3kvTl06IA==').decode('utf-8'))

import requests as rr

if cfm.lower() == 'y':
    res = rr.post(f"{c(h).decode('utf-8')}/submit", json={
        "gid": gid,
        "ans": ans
    })
    if res.status_code == 201:
        print(c("QW5zd2VyIHN1Ym1pdHRlZC4gVGVsbCB5b3VyIFRBIHRoYXQgeW91J3ZlIHN1Ym1pdHRlZCB5b3VyIGFuc3dlciB0byBkb3VibGUgY2hlY2sga3ViLg==").decode('utf-8'))
    elif res.status_code == 403:
        print(c('WW91IGFscmVhZHkgc3VibWl0dGVkIHlvdXIgYW5zd2VyISBJZiBub3QsIHRlbGwgeW91ciBUQSB0byBjaGVjay4=').decode('utf-8'))
    else:
        print(c('U3VibWlzc2lvbiBmYWlsZWQhIHRyeSBhZ2Fpbi4=').decode('utf-8'))
else:
    print("Exiting...")