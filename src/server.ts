import fastify from "fastify";
import { knex } from "./database";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";
import { authenticationRoutes } from "./routes/authentication";

const app = fastify();


app.register(cookie)

app.addHook('preHandler', async (request, reply) => {
  console.log(`[${request.method}] ${request.url}`)
})

app.register(authenticationRoutes, { prefix: '/authentication' })
app.register(transactionsRoutes, { prefix: '/transactions' })

app
  .listen({
    port: env.PORT,
    host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost',
  })
  .then(() => console.log(`Server is running on port ${env.PORT}`));