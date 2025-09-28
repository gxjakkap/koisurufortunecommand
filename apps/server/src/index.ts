import { Elysia, t } from "elysia"
import { RedisClient } from "bun"
import { randomBytes, timingSafeEqual } from "crypto"
import cors from "@elysiajs/cors"
import { logger } from '@grotto/logysia'

const port = Number(Bun.env.PORT ?? "3000")
const r = new RedisClient(Bun.env.REDIS_URL)

// Store connected SSE clients
const sseClients = new Set<ReadableStreamDefaultController>()

if (!(await r.exists("API_KEY"))){
  console.log("API key not found! generating one...")
  const k = randomBytes(32).toString('hex')
  r.set("API_KEY", k)
  console.log(`API Key set to ${k} . this will not be shown again in subsequent launch.`)
}

for (let i = 0; i < 6; i++){
  if(!(await r.exists(i.toString()))){
    await r.set(i.toString(), "-1")
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
    if (cur !== "-1") {
      set.status = 403
      return { m: "FORBIDDEN" }
    }

    set.status = 201
    await r.set(`${body.gid}`, body.ans.toString())
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

    return gRes
  }, { headers: t.Object({ authorization: t.String() })})

  .post('/admin/reset-all', async({ set, headers }) => {
    const k = await r.get("API_KEY")
    if (!timingSafeEqual(Buffer.from(headers.authorization), Buffer.from(k!))){
      set.status = 403
      return { m: "FORBIDDEN" }
    }

    await Promise.all([
      r.set("0", "-1"),
      r.set("1", "-1"),
      r.set("2", "-1"),
      r.set("3", "-1"),
      r.set("4", "-1"),
      r.set("5", "-1"),
      r.set("6", "-1"),
      r.set("7", "-1"),
      r.set("8", "-1"),
      r.set("9", "-1"),
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

    await r.set(body.gid.toString(), "-1")

    return { m: "OK" }

  }, { body: t.Object({ gid: t.Number({ minimum: 0, maximum: 5 }) }), headers: t.Object({ authorization: t.String() })})
  .listen(port)
console.log(
  `API is running at ${app.server?.hostname}:${app.server?.port}`
)
