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
            console.log(error)
            reply.status(400).send({ error: error })
            return
        }

    }
    )




    // } catch (error) {
    //     console.log(error)
    // }

    // console.log({ name, username, email, password })

    // await knex('user').insert({
    //     id: crypto.randomUUID(),
    //     name,
    //     username,
    //     email,
    //     password: crypto.createHash('sha1').update(password).digest('hex')
    // })

    // reply.status(201).send({ message: 'User created' })


    app.post('/login', async (request, reply) => {
        const bodySchema = z.object({
            username: z.string(),
            password: z.string().min(8).regex(/[A-Z]/, { message: 'At least one uppercase letter' })
                .regex(/[a-z]/, { message: 'At least one lowercase letter' })
                .regex(/\d/, { message: 'At least one digit' })
        })


        const { username, password } = bodySchema.parse(request.body)

        const user = await knex('user')
            .where('name', username).first()

        if (!user) {
            reply.status(401).send({ error: 'Invalid credentials' })
            return
        }

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

        await knex('sessions').insert({
            user_id: user.id,
            token: sessionId,
        })

        reply.status(201).send({ message: 'Logged in' })
    })
}