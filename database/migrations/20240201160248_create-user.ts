import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('user', table => {
        table.uuid('id').primary()
        table.text('name').notNullable()
        table.text('username').notNullable().index()
        table.text('email').notNullable().unique()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('user')
}

