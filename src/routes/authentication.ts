import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import * as crypto from 'crypto';

export async function authenticationRoutes(app: FastifyInstance) {


    const toHash = (text: string): string => crypto.createHash('sha1').update(text).digest('hex')


    app.post('/register', async (request, reply) => {

        const bodySchema = z.object({
            name: z.string().min(3),
            username: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(8)
                .regex(/[A-Z]/, { message: 'At least one uppercase letter' })
                .regex(/[a-z]/, { message: 'At least one lowercase letter' })
                .regex(/\d/, { message: 'At least one digit' })
        })

        try {
            const { name, username, email, password } = bodySchema.parse(request.body)


            const user = await knex('user').where('email', email).first()

            if (user) {
                reply.status(409).send({ error: 'User already exists' })
                return
            }

            const userToSave = {
                id: crypto.randomUUID(),
                name,
                username,
                email,
            }

            const user_created = await knex('user').insert(userToSave).returning('*')

            await knex('authentication').insert({
                id: crypto.randomUUID(),
                user_id: toHash(user_created[0].id),
                token: toHash(password),
            })

            reply.status(201).send({ message: 'User created', user: user_created[0] })

        } catch (error) {
            reply.status(400).send({ error: error })
            return
        }

    }
    )

    app.delete('/register', async (request, reply) => {
        let sessionId = request.cookies.InOutTrackSessionId

        if (!sessionId) {
            reply.status(401).send({ error: 'Not logged in' })
            return
        }

        const session = await knex('session').where('token', sessionId).first()

        if (!session) {
            reply.status(401).send({ error: 'Not logged in' })
            return
        }

        await knex('authentication').where('user_id', toHash(session.user_id)).del()
        await knex('session').where('user_id', session.user_id).del()
        await knex('user').where('id', session.user_id).del()

        reply.status(200).send({ message: 'User deleted' })

    })



    app.post('/login', async (request, reply) => {
        const bodySchema = z.object({
            username: z.string().min(3),
            password: z.string().min(8).regex(/[A-Z]/, { message: 'At least one uppercase letter' })
                .regex(/[a-z]/, { message: 'At least one lowercase letter' })
                .regex(/\d/, { message: 'At least one digit' })
        })

        try {
            const { username, password } = bodySchema.parse(request.body)

            const user = await knex('user')
                .where('username', username).first()

            if (!user) {
                reply.status(401).send({ error: 'Invalid credentials' })
                return
            }

            const authentication = await knex('authentication').where('user_id', toHash(user.id)).first()

            if (!authentication) {
                reply.status(401).send({ error: 'Invalid credentials' })
                return
            }

            if (authentication.token !== toHash(password)) {
                reply.status(401).send({ error: 'Invalid credentials' })
                return
            }

            let sessionId = request.cookies.InOutTrackSessionId



            if (sessionId) {
                reply.clearCookie('InOutTrackSessionId')
            }


            sessionId = crypto.randomUUID()
            reply.cookie('InOutTrackSessionId', sessionId, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 1 days
            })


            await knex('session').insert({
                id: crypto.randomUUID(),
                user_id: user.id,
                token: sessionId,
            })

            reply.status(201).send({ message: 'Logged in' })

        } catch (error) {
            reply.status(400).send({ error: error })
            return
        }

    })


}