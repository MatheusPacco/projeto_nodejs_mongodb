const express = require('express'); 
const router = express.Router(); 

// Importando os models para rotas
const mongoose = require('mongoose'); 
require("../models/Categoria")

const Categoria = mongoose.model("categorias")

// Definindo Rotas
router.get('/', (req, res) => {
    res.render("admin/index"); 
})

router.get('/posts', (req, res) => {
    res.send('Página de postagens'); 
})

router.get('/categorias', (req, res) => {
    res.render("admin/categorias"); 
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias"); 
})

router.post("/categorias/nova", (req, res) => {

// Tratando erros do formulário 
    var erros = []; 

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"}); 
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length <= 2){
        erros.push({texto: "Noma da categoria é muito pequeno"})
    }

    if (req.body.slug.length <= 2) {
        erros.push({texto: "Noma do Slug é muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    } 
    else {

        const novaCategoria= {
            nome: req.body.nome, 
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            // registra uma mensagem
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect("/admin/categorias")

        }).catch(err => {
            req.flash("error_msg", "Houve um erro em salvar a categoria, tente novamente!")
            res.redirect("/admin")
            console.log("Erro ao SALVAR categoria" + err);
        })
    }   

})

module.exports = router; 