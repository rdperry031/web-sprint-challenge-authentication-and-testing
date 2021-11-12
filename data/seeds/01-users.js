const users = [
    {username: 'Tom', password: 'assemblage23'}
]

exports.users = users
exports.seed = function (knex){
    return knex('users').insert(users)
}