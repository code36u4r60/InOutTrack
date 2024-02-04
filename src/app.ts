import fastify from "fastify";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";
import { authenticationRoutes } from "./routes/authentication";

export const app = fastify();


app.addHook('preHandler', async (request, reply) => { console.log(`[${request.method}] ${request.url}`) })

app.register(cookie)
app.register(authenticationRoutes, { prefix: '/authentication' })
app.register(transactionsRoutes, { prefix: '/transactions' })

