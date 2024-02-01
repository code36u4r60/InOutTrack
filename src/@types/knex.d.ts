import { Knex } from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        transactions: {
            id: string
            title: string
            amount: number
            created_at: Date
            session_id?: string
        },
        statements: {
            id: string
            user_id: string
            option: string
            date: Date
            created_at: Date
        },
        user: {
            id: string
            name: string
            username: string
            email: string
            created_at: Date
        },
        authentication: {
            id: string
            user_id: string
            token: string
            created_at: Date
        },
        session: {
            id: string
            user_id: string
            token: string
            created_at: Date
        }
    }
}

