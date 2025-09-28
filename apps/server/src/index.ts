import { Elysia, t } from "elysia"
import { RedisClient } from "bun"
import { randomBytes, timingSafeEqual } from "crypto"
import cors from "@elysiajs/cors"
import { logger } from '@grotto/logysia'

const port = Number(Bun.env.PORT ?? "3000")
const r = new RedisClient(Bun.env.REDIS_URL)

if (!(await r.exists("API_KEY"))){
  console.log("API key not found! generating one...")
  const k = randomBytes(32).toString('hex')
  r.set("API_KEY", k)
  console.log(`API Key set to ${k} . this will not be shown again in subsequent launch.`)
}

for (let i = 0; i < 6; i++){
  if(!(await r.exists(i.toString()))){
    const unsubmittedData = { ans: -1, submitTime: null }
    await r.set(i.toString(), JSON.stringify(unsubmittedData))
    console.log(`seeding gid ${i}`)
  }
  else {
    console.log(`gid ${i} existed. skipping...`)
  }
}

const app = new Elysia()
  .use(cors())
  .use(logger({ 
    logIP: false,
    writer: {
        write(msg: string) {
          console.log(msg)
        }
    }
  }))
  .post("/submit", async ({ set, body }) => {
    const cur = await r.get(`${body.gid}`)
    if (!cur) {
      set.status = 404
      return { m: "NOT_FOUND" }
    }
    
    let currentData
    try {
      currentData = JSON.parse(cur)
    } catch {
      set.status = 500
      return { m: "INVALID_DATA" }
    }
    
    if (currentData.ans !== -1) {
      set.status = 403
      return { m: "FORBIDDEN" }
    }

    set.status = 201
    const answerData = {
      ans: body.ans,
      submitTime: new Date().toISOString()
    }
    await r.set(`${body.gid}`, JSON.stringify(answerData))
  }, { body: t.Object({ gid: t.Number(), ans: t.Number({ minimum: 0, maximum: 7 })}) })

  .get('/admin/get', async ({ set, headers }) => {
    const k = await r.get("API_KEY")
    if (!timingSafeEqual(Buffer.from(headers.authorization), Buffer.from(k!))){
      set.status = 403
      return { m: "FORBIDDEN" }
    }

    const gRes = await Promise.all([
      r.get("0"),
      r.get("1"),
      r.get("2"),
      r.get("3"),
      r.get("4"),
      r.get("5"),
    ])

    const parsedRes = gRes.map(data => {
      if (!data) return { ans: -1, submitTime: null }
      try {
        return JSON.parse(data)
      } catch {
        // Handle legacy data format - convert to new format
        if (data === "-1") {
          return { ans: -1, submitTime: null }
        }
        return { ans: parseInt(data), submitTime: null }
      }
    })

    return parsedRes
  }, { headers: t.Object({ authorization: t.String() })})

  .post('/admin/reset-all', async({ set, headers }) => {
    const k = await r.get("API_KEY")
    if (!timingSafeEqual(Buffer.from(headers.authorization), Buffer.from(k!))){
      set.status = 403
      return { m: "FORBIDDEN" }
    }

    const unsubmittedData = { ans: -1, submitTime: null }
    await Promise.all([
      r.set("0", JSON.stringify(unsubmittedData)),
      r.set("1", JSON.stringify(unsubmittedData)),
      r.set("2", JSON.stringify(unsubmittedData)),
      r.set("3", JSON.stringify(unsubmittedData)),
      r.set("4", JSON.stringify(unsubmittedData)),
      r.set("5", JSON.stringify(unsubmittedData)),
      r.set("6", JSON.stringify(unsubmittedData)),
      r.set("7", JSON.stringify(unsubmittedData)),
      r.set("8", JSON.stringify(unsubmittedData)),
      r.set("9", JSON.stringify(unsubmittedData)),
    ])
    return { m: "OK"}
  }, { headers: t.Object({ authorization: t.String() })})

  .post('/admin/reset', async({ set, headers, body }) => {
    const k = await r.get("API_KEY")
    if (!timingSafeEqual(Buffer.from(headers.authorization), Buffer.from(k!))){
      set.status = 403
      return { m: "FORBIDDEN" }
    }

    if (!(await r.exists(body.gid.toString()))){
      set.status = "Bad Request"
      return { m: "Invalid Input" }
    }

    const unsubmittedData = { ans: -1, submitTime: null }
    await r.set(body.gid.toString(), JSON.stringify(unsubmittedData))

    return { m: "OK" }

  }, { body: t.Object({ gid: t.Number({ minimum: 0, maximum: 5 }) }), headers: t.Object({ authorization: t.String() })})
  .listen(port)
console.log(
  `API is running at ${app.server?.hostname}:${app.server?.port}`
)
