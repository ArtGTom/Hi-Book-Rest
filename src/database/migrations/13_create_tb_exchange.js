const { onUpdateTriggerExchange } = require('../../../knexfile');

exports.up = function(knex) {
    return knex.schema.createTable('tb_exchange', table => {
        
        table.increments('cd_exchange').primary();
        table.integer('cd_status_exchange').notNullable().defaultTo(1);
        table.integer('cd_first_user').notNullable();
        table.integer('cd_first_book').notNullable();
        table.string('nm_first_confirmation', 10).defaultTo('pendente');;
        table.integer('cd_second_user').notNullable();
        table.integer('cd_second_book');
        table.string('nm_second_confirmation', 10).defaultTo('pendente');
        table.timestamps();

        table.foreign('cd_status_exchange').references('cd_status_exchange').inTable('tb_status_exchange');
        
        table.foreign('cd_first_user').references('cd_user').inTable('tb_user');
        table.foreign('cd_first_book').references('cd_book').inTable('tb_book');
        table.foreign('cd_second_user').references('cd_user').inTable('tb_user');
        table.foreign('cd_second_book').references('cd_book').inTable('tb_book');
    }).then(() => knex.raw(onUpdateTriggerExchange()));
}

exports.down = function(knex) {
    return knex.schema.dropTable('item_user_book');
}