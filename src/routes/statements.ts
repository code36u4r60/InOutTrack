import { FastifyInstance, FastifyRequest } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { checkSessionIdExists } from "../middleware/check-session-id-exists"

export async function statementsRoutes(app: FastifyInstance) {


    app.addHook("onRequest", async (request: FastifyRequest, reply) => {
        try {
          const jwt = await request.jwtVerify().then((res) => {
            request.user = res
          })

          console.log(jwt)
        } catch (err) {
          reply.send(err)
        }
      })

    app.get('/',
        {
            
        },
        async (request, reply) => {
            reply.send(request.user)
        })

}