import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('statements', table => {
        table.uuid('id').primary()
        
        table.uuid('user_id').notNullable().index()
        table.text('option').notNullable()
        table.date('date').notNullable().index()

        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('statements')
}

