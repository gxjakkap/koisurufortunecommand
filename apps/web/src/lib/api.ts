interface AnsRes {
    data: string[] | null
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
    const res = await fetch(`${host}/admin/reset`, { headers: { "authorization": `${apiKey}` }, body: JSON.stringify({ gid: gid })})
    if (res.status !== 200) throw new Error(res.statusText)
    else return { success: true }
}