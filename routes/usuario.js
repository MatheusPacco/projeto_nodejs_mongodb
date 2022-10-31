const express = require('express'); 
const router = express.Router(); 
const mongoose = require('mongoose'); 
require("../models/Usuario"); 
const Usuario = mongoose.model("usuarios"); 
const bcrypt = require('bcrypt'); 

router.get("/registro", (req, res) => {
    res.render("usuarios/registro");
    // res.send("chegou registro"); 
}); 

router.post("/registro", (req,res) => {
    const usuario = {
        email: req.body.email, 
        senha: req.body.senha, 
        senha2: req.body.senha2
    }

    const erros = []; 

    if(usuario.senha.length < 4){
        erros.push({texto: "A senha é menor do que 4 caracteres"})
    }

    if(usuario.senha != usuario.senha2){
        erros.push({texto: "As senhas não são iguais! Tente novamente!"});
    } 
    
    if(erros.length > 0){
        // req.flash('error_msg', 'Não foi possível criar a conta!');
        res.render('usuarios/registro', {erros});
    } else {

        // Enviando o cadastro para o banco!

        Usuario.findOne({email: usuario.email}).then((usuario) => {

            if(usuario) {
                req.flash('error_msg', 'Já existe um usuário cadastrado com esse Email!');
                res.redirect('/usuarios/registro');
            } else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha 
                });

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash('error_msg', 'Houve um erro durante o salvamento do usuário!'); 
                            res.redirect('/'); 
                        }
                            novoUsuario.senha = hash; 

                            novoUsuario.save().then(() => {
                                req.flash('success_msg', 'Usuário criado com sucesso!')
                                res.redirect('/');
                            }).catch(err => {
                                console.log("Erro na etapa da hash" + err); 
                                req.flash('error_msg', 'Houve um erro durante ao criar o usuário!'); 
                                res.redirect('/');
                            })
                    }); 
                }); 

            }

        }).catch(err => {   
            console.log("Erro em comparar email a partir do banco de dados" + err); 
            req.flash('error_msg', 'Ocorreu um erro interno!');
        })
    }
}); 
module.exports = router