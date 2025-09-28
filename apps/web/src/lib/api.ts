export interface AnswerData {
    ans: number
    submitTime: string | null
}

interface AnsRes {
    data: AnswerData[] | null
}

export const getAns = async(host: string, apiKey: string): Promise<AnsRes> => {
    const res = await fetch(`${host}/admin/get`, { headers: { "authorization": `${apiKey}` }})

    if (res.status !== 200) throw new Error(res.statusText)

    const rj = await res.json()

    return { data: rj }
}

interface RemAnsRes {
    success: boolean
}

export const removeAns = async(host: string, apiKey: string, gid: number): Promise<RemAnsRes> => {
    const res = await fetch(`${host}/admin/reset`, { 
        method: 'POST',
        headers: { 
            "authorization": `${apiKey}`,
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({ gid: gid })
    })
    if (res.status !== 200) throw new Error(res.statusText)
    else return { success: true }
}

export const resetAllAns = async(host: string, apiKey: string): Promise<RemAnsRes> => {
    const res = await fetch(`${host}/admin/reset-all`, { 
        method: 'POST',
        headers: { 
            "authorization": `${apiKey}`,
            "Content-Type": "application/json"
        }
    })
    if (res.status !== 200) throw new Error(res.statusText)
    else return { success: true }
}