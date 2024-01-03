const db = require('../db')

;(async () => {
  try {
    await db('users').insert({ name: 'Mariana', email: 'mariana@email.com', password: 'teste', permission: 2 })
    await db('users').insert({ name: 'Carol', email: 'carol@email.com', password: 'teste', permission: 1 })
    await db('users').insert({ name: 'Aline', email: 'aline@email.com', password: 'teste', permission: 0 })
    console.log('Usuários adicionados!')

    await db('documents').insert({ name: 'Imagens', owner_id: 2})
    await db('documents').insert({ name: 'Viagens', owner_id: 2, father_id: 1})
    await db('documents').insert({ name: 'Projetos do trabalho', owner_id: 1, father_id: 1})
    await db('documents').insert({ name: 'Downloads', owner_id: 1})
    await db('documents').insert({ name: 'Arquivos privativos', owner_id: 1})
    console.log('Documentos adicionados!')

    await db('document_guests').insert({ document_id: 1, guest_id: 3, permission: 0})
    await db('document_guests').insert({ document_id: 2, guest_id: 3, permission: 1})
    await db('document_guests').insert({ document_id: 3, guest_id: 3, permission: 2})
    console.log('Colaboradores adicionados!')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()