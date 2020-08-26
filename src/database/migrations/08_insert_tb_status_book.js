exports.up = function(knex) {
    const status = 
    [
        {
            nm_status: 'Disponível',
            ds_status: 'O livro está disponível para trocas',
        },
        {
            nm_status: 'Reservado',
            ds_status: 'O livro está reservado para outro usuário',
        },
        {
            nm_status: 'Lendo',
            ds_status: 'O livro está sendo lido pelo seu proprietário',
        }
    ]

    return knex.insert(status).into('tb_status_book')
}

exports.down = function(knex) {
    return knex.delete().from('tb_status_book');
}