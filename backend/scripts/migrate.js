const db = require('../db')

;(async () => {
  try {
    await db.schema.dropTableIfExists('users')
    await db.schema.withSchema('public').createTable('users', (table) => {
      table.increments()
      table.string('name')
      table.string('email')
      table.string('password')
      table.integer("permission")
    })
    console.log('Tabela de usuários criada!')


    await db.schema.dropTableIfExists('documents')
    await db.schema.withSchema('public').createTable('documents', (table) => {
      table.increments()
      table.integer('owner_id')
      table.string('name')
      table.integer("father_id")
    })
    console.log('Tabela de documentos criada!')

    await db.schema.dropTableIfExists('document_guests')
    await db.schema.withSchema('public').createTable('document_guests', (table) => {
      table.increments()
      table.integer('document_id')
      table.integer('guest_id')
      table.integer("permission")
    })
    console.log('Tabela de arquivos criada!')

    await db.schema.dropTableIfExists('files')
    await db.schema.withSchema('public').createTable('files', (table) => {
      table.increments()
      table.integer('document_id')
      table.integer('owner_id')
      table.string('original_name')
      table.string('name')
    })
    console.log('Tabela de arquivos criada!')
    
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()