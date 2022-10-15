const express = require('express'); 
const router = express.Router(); 

// Importando os models para rotas
const mongoose = require('mongoose'); 
require("../models/Categoria"); 
const Categoria = mongoose.model("categorias"); 
require("../models/Postagens"); 
const Postagens = mongoose.model('postagens'); 

// Importando funções
const ValidandoForms = require('../models/funcoes/ValidandoForms'); 

// Definindo Rotas
router.get('/', (req, res) => {
    res.render("admin/index"); 
})

router.get('/posts', (req, res) => {
    res.send('Página de postagens'); 
})

router.get('/categorias', (req, res) => {
    Categoria.find().lean().sort({data: 'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias:categorias}); 
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias"); 
        console.log(err);
        res.redirect("/admin");
    })
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias"); 
})

router.post("/categorias/nova", (req, res) => {

// Tratando erros do formulário 
    
    const novaCategoria = {
        nome: req.body.nome, 
        slug: req.body.slug
    }

    const erros = ValidandoForms({nome: novaCategoria.nome, slug: novaCategoria.slug});

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    } 
    else {

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

}); 

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findById({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/editarcategoria", {categoria: categoria})

    }).catch((err) => {
        console.log(err);
        req.flash('error_msg', 'Essa categoria não existe')
        res.redirect('/admin/categorias')
    });
    // res.send(".pEntrou em Editar categorias" + reqarams.id);
}); 

router.post("/categorias/edit/:id", (req, res) => {
    const id = req.params.id;     
    const update = {
        nome: req.body.nome,
        slug: req.body.slug
    }; 

    const erros = ValidandoForms({nome: update.nome, slug: update.slug}); 

    if(erros.length > 0){
        res.render(`admin/editarcategoria`, {categoria: {nome: update.nome, slug: update.slug, _id: id}, erros: erros});
    } else {

        Categoria.findByIdAndUpdate(id, update).then(()=>{
            req.flash('success_msg', "Categoria editada com sucesso!"); 
            res.redirect("/admin/categorias"); 
    
        }).catch((err) => {
            req.flash('error_msg', "Não foi possível editar a categoria, tente novamente"); 
            res.redirect("/admin/categorias"); 
        });
    }
});

router.post("/categorias/deletar/:id", (req, res) => {
    const id = req.params.id; 

    Categoria.findByIdAndDelete(id).then(() => {
        req.flash('success_msg', "Categoria removida com sucesso!"); 
        res.redirect("/admin/categorias"); 

    }).catch((err) => {
        req.flash('error_msg', "Não foi possível remover a categoria, tente novamente"); 
        res.redirect("/admin/categorias"); 
    })
}); 

router.get("/postagens", (req, res) => {
    res.render("admin/postagens"); 
}); 

router.get("/postagens/add", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", {categorias});
    }).catch((err) => {
        res.flash('error_msg', "Não foi possível gerar as categorias")
        res.redirect("admin/postagens")
    })

});

module.exports = router; 