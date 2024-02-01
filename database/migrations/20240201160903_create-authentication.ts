import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('authentication', table => {
        table.uuid('id').primary()
        table.uuid('user_id').notNullable()
        table.text('token').notNullable().unique()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('authentication')
}