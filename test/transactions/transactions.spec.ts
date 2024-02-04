import { expect, afterAll, beforeAll, it, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../../src/app'

describe('Transactions', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(async () => {
        execSync('npm run knex migrate:rollback')
        execSync('npm run knex migrate:latest')
    })

    it('should be able to create a new transition', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'test',
                amount: 100,
                type: 'deposit'
            })
            .expect(201)

    })


    it('should be able to get a specific transaction', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'test',
                amount: 100,
                type: 'deposit'
            })

        const cookie = createTransactionResponse.headers['set-cookie']

        const listTransactionsResponse = await request(app.server).get('/transactions')
            .set('Cookie', cookie)
            .expect(200)

        expect(listTransactionsResponse.body.transactions).toEqual([

            expect.objectContaining({
                title: 'test',
                amount: 100,
            })
        ])

    })



})

