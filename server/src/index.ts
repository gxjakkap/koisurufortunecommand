import { Elysia } from "elysia"

const port = process.env.PORT ?? 3000

const app = new Elysia()
  .listen(port)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
