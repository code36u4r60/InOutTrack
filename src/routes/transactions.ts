import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { checkSessionIdExists } from "../middleware/check-session-id-exists"

export async function transactionsRoutes(app: FastifyInstance) {

    app.addHook('preHandler', async (request, reply) => {
        console.log(`[${request.method}] ${request.url}`)
    })

    app.get('/',
        {
            preValidation: [checkSessionIdExists],
        },
        async (request, reply) => {

            const sessionId = request.cookies.sessionId

            const transactions = await knex('transactions').where('session_id', sessionId).select('*')

            reply.send({ transactions })
        })

    app.get('/:id',
        {
            preValidation: [checkSessionIdExists],
        },
        async (request, reply) => {

            const paramsSchema = z.object({
                id: z.string().uuid(),
            })

            const { id } = paramsSchema.parse(request.params)
            const sessionId = request.cookies.sessionId

            const transaction = await knex('transactions')
                .where('session_id', sessionId)
                .andWhere('id', id)
                .first()

            if (!transaction) {
                reply.status(404).send({ error: 'Transaction not found' })
                return
            }

            reply.send({ transaction })
        })

    app.get('/summary',
        {
            preValidation: [checkSessionIdExists],
        },
        async (request, reply) => {

            const sessionId = request.cookies.sessionId

            const transactions = await knex('transactions')
                .where('session_id', sessionId)
                .select('*')

            const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0)

            const deposit = transactions.filter(transaction => transaction.amount > 0).reduce((acc, transaction) => acc + transaction.amount, 0)

            const withdraw = transactions.filter(transaction => transaction.amount < 0).reduce((acc, transaction) => acc + transaction.amount, 0)

            reply.send({
                balance,
                deposit,
                withdraw,
            })
        })

    app.post('/', async (request, reply) => {

        const bodySchema = z.object({
            title: z.string(),
            amount: z.number().positive(),
            type: z.enum(['deposit', 'withdraw']),
        })

        const { title, amount, type } = bodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = crypto.randomUUID()
            reply.cookie('sessionId', sessionId, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })
        }

        const transaction = await knex('transactions').insert({
            id: crypto.randomUUID(),
            title,
            amount: type === 'withdraw' ? -amount : amount,
            session_id: sessionId,
        }).returning('*')


        reply.status(201).send(transaction)
    })
}