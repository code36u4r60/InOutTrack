import { FastifyInstance } from "fastify"


export async function testsRoutes(app: FastifyInstance) {


    app.get('/',
        async (request, reply) => {

            reply.send({ message: "Hello World !!!" })
        })

    }