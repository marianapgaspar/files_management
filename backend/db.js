const knex = require('knex')

module.exports = knex({
  client: 'postgres',
  connection: {
    host: '10.5.0.1',
    user: 'docker',
    password: 'toor',
    database: 'docker',
  },
})