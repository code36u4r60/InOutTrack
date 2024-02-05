import fastify from "fastify";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";
import { authenticationRoutes } from "./routes/authentication";
import cors from '@fastify/cors'

export const app = fastify();


app.register(cors, {
    origin: true,
    credentials: true
})


app.addHook('preHandler', async (request, reply) => { console.log(`[${request.method}] ${request.url}`) })



app.register(cookie)
app.register(authenticationRoutes, { prefix: '/authentication' })
app.register(transactionsRoutes, { prefix: '/transactions' })

