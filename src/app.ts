import fastify from "fastify";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";
import { authenticationRoutes } from "./routes/authentication";
import { statementsRoutes } from "./routes/statements";
import { testsRoutes } from "./routes/tests";

import jwt from "@fastify/jwt"



export const app = fastify();


app.addHook('preHandler', async (request, reply) => { console.log(`[${request.method}] ${request.url}`) })


app.register(jwt, {secret: '65ffda0134ae55ef5e8fe1e2bc959c3f'})
app.register(cookie)


app.register(authenticationRoutes, { prefix: '/authentication' })
app.register(transactionsRoutes, { prefix: '/transactions' })
app.register(statementsRoutes, { prefix: '/statements' })
app.register(testsRoutes, { prefix: '/tests' })