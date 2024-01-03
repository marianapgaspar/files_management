const express = require('express');
const db = require("./db");
const app = express();
const cors = require('cors')
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const crypto = require("crypto");
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
app.use(cors())
app.use(express.json());


function verifyJAuth(req, res, next){
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, 'PRIVATEKEY', function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}
// ---------AUTHENTICATE ---------
    app.post("/authenticate", async(req,res)=>{
        await db.raw("select * from users where name = '"+req.body.name+"' AND password = '"+req.body.password+"'").then(function(result){
            if (result.rows[0] !== undefined){
                const user = result.rows[0];
                const token = jwt.sign(user, 'PRIVATEKEY', {expiresIn: 3000});
                res.json({user, token: token, message: "Bem vindo"})
            } else {
                res.statusMessage = "Informações inválidas"
                res.json({message: "Informações inválidas"})
            }
        });
    })
// --------- USERS ---------------
    app.get('/getAllUsers', verifyJAuth, async (req, res, next) => {
        const users = await db.select().from('users').orderBy("id");
        res.json(users)
    });

    app.get('/getUserById', verifyJAuth, async (req, res) => {
        await db.raw("select * from users where id = "+req.query.id).then(function(result){
            if (result.rows[0].permission !== null){
                result.rows[0].permission = result.rows[0].permission.toString();
            }
            res.json(result.rows[0])
        })
    });

    app.post('/addUser', verifyJAuth, async (req, res) => {
        await db.raw("select count(*) as total from users u where name = '"+req.body.name+"' ").then(function(result){
            if (result.rows[0].total > 0){
                res.statusMessage = "Já existe usuário com esse nome"
                res.json({"message": "Já existe usuário com esse nome"})
            } else {
                db.insert(req.body).into("users").then(
                    data => {
                        res.statusMessage = "Usuários inserido com sucesso"
                        res.json({"message": "Usuário inserido com sucesso"})
                    }
                ).catch(err=>{
                    res.statusMessage = "Não foi possível inserir o usuário"
                    res.json({"message": err.message})
                })
            }
        })
    });

    app.post('/updateUser', verifyJAuth, async (req, res) => {
        await db.raw("select count(*) as total from users u where id = '"+req.query.id+"' ").then(function(result){
            if (result.rows[0].total == 0){
                res.statusMessage = "Usuário não existente"
                res.json({"message": "Usuário não existente"})
            } else {
                db("users").where("id", req.query.id)
                    .update({
                        "email": req.body.email,
                        "password": req.body.password
                    })
                    .then(function(){
                        res.statusMessage = "Usuários atualizado com sucesso"
                        res.json({"message": "Usuário atualizado com sucesso"})
                    }).catch(err=>{
                        res.statusMessage = "Não foi possível atualizar o usuário"
                        res.json({"message": err.message})
                    })
            }
        })
    });

    app.post('/deleteUser', verifyJAuth, async (req, res) => {
        await db.raw("select count(*) as total from users u where id = '"+req.body.id+"' ").then(function(result){
            if (result.rows[0].total == 0){
                res.statusMessage = "Usuário não existente"
                res.json({"message": "Usuário não existente"})
            } else {
                db("users").where("id", req.body.id)
                    .del()
                    .then(function(){
                        res.statusMessage = "Usuários deletado com sucesso"
                        res.json({"message": "Usuário deletado com sucesso"})
                    }).catch(err=>{
                        res.statusMessage = "Não foi possível deletar o usuário"
                        res.json({"message": err.message})
                    })
            }
        })
    });

// ------------ DOCUMENTS ---------------
    app.get('/getDocs', verifyJAuth, async (req, res) => {
        if (req.query.creator != 0){
            await db.raw("select d.*, u.name AS user_name from documents d inner join users u on u.id = d.owner_id where father_id is null and owner_id = "+req.query.creator).then(function(result){
                res.json(result.rows)
            })
        } else if (req.query.guest != 0){
            await db.raw("select d.*, u.name AS user_name from documents d inner join users u on u.id = d.owner_id inner join document_guests dg on dg.document_id = d.id where dg.guest_id = "+req.query.guest+" and father_id is null").then(function(result){
                res.json(result.rows)
            })
        } else {
            await db.raw("select d.*, u.name AS user_name from documents d inner join users u on u.id = d.owner_id where father_id is null").then(function(result){
                res.json(result.rows)
            })
        }
    });

    app.post('/addDocs', verifyJAuth, async (req, res) => {
        db.insert(req.body).into("documents").then(
            data => {
                res.statusMessage = "Documento inserido com sucesso"
                res.json({"message": "Documento inserido com sucesso"})
            }
        ).catch(err=>{
            res.statusMessage = "Não foi possível inserir o documento"
            res.json({"message": err.message})
        })
    });
    app.post('/deleteDoc', verifyJAuth, async (req, res) => {
        await db.raw("select count(*) as total from documents u where father_id = '"+req.body.id+"' ").then(function(result){
            if (result.rows[0].total > 0){
                res.statusMessage = "Não é possível deletar pastas com pastas dentro"
                res.json({"message": "Não é possível deletar pastas com pastas dentro"})
            } else {
                db("documents").where("id", req.body.id)
                .del()
                .then(function(){
                    res.statusMessage = "Documentos deletado com sucesso"
                    res.json({"message": "Documento deletado com sucesso"})
                }).catch(err=>{
                    res.statusMessage = "Não foi possível deletar o Documento"
                    res.json({"message": err.message})
                })
            }
        })
    });
    app.get('/getDocsByFather', verifyJAuth, async (req, res) => {
        if (req.query.creator != 0){
            await db.raw("select d.*, u.name AS user_name from documents d inner join users u on u.id = d.owner_id where father_id = "+req.query.father_id+" and owner_id = "+req.query.creator).then(function(result){
                res.json(result.rows)
            })
        } else if (req.query.guest != 0){
            await db.raw("select d.*, dg.*, u.name AS user_name from documents d inner join users u on u.id = d.owner_id inner join document_guests dg on dg.document_id = d.id where dg.guest_id = "+req.query.guest+" and father_id = "+req.query.father_id).then(function(result){
                res.json(result.rows)
            })
        } else {
            await db.raw("select d.*, u.name AS user_name from documents d inner join users u on u.id = d.owner_id where father_id = "+req.query.father_id).then(function(result){
                res.json(result.rows)
            })
        }
    });
    app.get('/getPermission', verifyJAuth, async (req, res) => {
        await db.raw("select permission from document_guests where document_id = "+req.query.document_id+" and guest_id = "+req.query.guest).then(function(result){
            res.json(result.rows[0])
        })
    });
    app.get('/getDocById', verifyJAuth, async (req, res) => {
        await db.raw("select * from documents where id = "+req.query.id).then(function(result){
            res.json(result.rows[0])
        })
    });

// ------------ GUESTS ---------------
    app.get('/getGuestsByDocs', verifyJAuth, async (req, res) => {
        await db.raw("select dg.id as id, u.name as user_name, case when dg.permission = 0 then 'Leitura' when dg.permission = 1 then 'Edição' else 'Edição e exclusão' end as permission from document_guests dg inner join users u on u.id = dg.guest_id  where document_id = "+req.query.document_id).then(function(result){
            res.json(result.rows)
        })
    });
    app.get('/getGuestOptions', verifyJAuth, async (req, res) => {
        await db.raw("select * from users WHERE permission = 0").then(function(result){
            res.json(result.rows)
        })
    });
    app.post('/addGuest', verifyJAuth, async (req, res) => {
        await db.raw("select count(*) as total from document_guests u where guest_id = '"+req.body.guest_id+"' AND document_id = "+req.body.document_id).then(function(result){
            if (result.rows[0].total > 0){
                res.statusMessage = "Esse usuário já está na lista de colaboradores"
                res.json({"message": "Esse usuário já está na lista de colaboradores"})
            } else {
                db.insert(req.body).into("document_guests").then(function(){
                    res.statusMessage = "Colaborador adicionado com sucesso"
                    res.json({"message": "Colaborador adicionado com sucesso"})
                }).catch(err=>{
                    res.statusMessage = "Não foi possível adicionar colaborador"
                    res.json({"message": err.message})
                })
            }
        })
    });
    app.post('/deleteGuest', verifyJAuth, async (req, res) => {
        db("document_guests").where("id", req.body.id)
        .del()
        .then(function(){
            res.statusMessage = "Colaborador deletado com sucesso"
            res.json({"message": "Colaborador deletado com sucesso"})
        }).catch(err=>{
            res.statusMessage = "Não foi possível deletar o Colaborador"
            res.json({"message": err.message})
        })
    });
    
// ------------ FILES ---------------
    app.post('/addFile', verifyJAuth, upload.single("files"), (req, res) => {
        var file = path.join(__dirname, 'uploads', req.file.originalname)
        var extension = path.extname(file);
        const newName = crypto.randomBytes(16).toString("hex") + extension;
        const newFilePath = path.join(__dirname, 'uploads', newName)

        var newFileDb = {original_name: req.file.originalname, name:newName, owner_id: req.body.owner_id}
        if (req.body.document_id > 0){
            var newFileDb = {document_id: req.body.document_id, original_name: req.file.originalname, name:newName, owner_id: req.body.owner_id}
        }

        fs.rename(req.file.path, newFilePath, function (err) {
            if (err) {
                console.log(err);
            } else {
                db.insert(newFileDb).into("files").then(function(){
                    res.statusMessage = "Arquivo inserido com sucesso"
                    res.json({"message": "Arquivo inserido com sucesso"})
                }).catch(err=>{
                    res.statusMessage = "Não foi possível adicionar arquivo"
                    res.json({"message": err.message})
                })
            }

        })
    });
    app.get('/getFiles', verifyJAuth, async (req, res) => {
        await db.raw("select f.*, u.name AS user_name from files f inner join users u on u.id = f.owner_id order by id asc").then(function(result){
            res.json(result.rows)
        })
    });
    app.get('/getFilesByDoc', verifyJAuth, async (req, res) => {
        await db.raw("select f.*, u.name AS user_name from files f inner join users u on u.id = f.owner_id WHERE f.document_id = "+req.query.document_id+" order by id asc").then(function(result){
            res.json(result.rows)
        })
        // const files = await db.select().from('files').where("document_id", req.query.document_id).orderBy("id");
        // res.json(files)
    });
    app.post('/deleteFile', verifyJAuth, async (req, res) => {
        const pathFile = path.join(__dirname, 'uploads', req.body.name);
        if (fs.existsSync(pathFile)) { 
            fs.unlink(pathFile,(err) => {
                if (err) {
                    throw err;
                }
                console.log('Arquivo removido do diretório');
            });
        }
        
        db("files").where("id", req.body.id)
        .del()
        .then(function(){
            res.statusMessage = "Arquivo deletado com sucesso"
            res.json({"message": "Arquivo deletado com sucesso"})
        }).catch(err=>{
            res.statusMessage = "Não foi possível deletar o Arquivo"
            res.json({"message": err.message})
        })
    });

    app.get('/getFile', async (req, res) => {
        const filePath = path.join(__dirname, 'uploads', req.query.name);
        fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
            if (!err) {
                res.download(filePath);
            } else {
                console.log(err);
            }
        });
    })

app.listen(3000, () => {
    console.log('Listening on port 3000');
});