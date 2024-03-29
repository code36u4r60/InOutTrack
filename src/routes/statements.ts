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

    app.get('/:start:end',
        async (request, reply) => {
          const paramsSchema = z.object({
            start: z.date(),
            end: z.date(),
        })

        try {
          const parse = paramsSchema.safeParse(request.params)


          reply.send({ parse})
        }     
        catch (error) {
          reply.status(400).send({ error: error })
          return
      }
      })
}
        