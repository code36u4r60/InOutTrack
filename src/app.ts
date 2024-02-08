import fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from '@fastify/cors'
import jwt from "@fastify/jwt"


import { authenticationRoutes } from "./routes/authentication";
import { statementsRoutes } from "./routes/statements";



export const app = fastify();




app.addHook('preHandler', async (request, reply) => { console.log(`[${request.method}] ${request.url}`) })

app.register(cors, {
    hook: 'preHandler',
 })
app.register(jwt, {secret: '65ffda0134ae55ef5e8fe1e2bc959c3f'})
app.register(cookie)

app.register(authenticationRoutes, { prefix: '/authentication' })
app.register(statementsRoutes, { prefix: '/statements' })
