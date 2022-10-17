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

// ROTA DE POSTAGENS    

router.get("/postagens", (req, res) => {
    Postagens.find().lean().sort({data: 'desc'}).then((postagens) => {

    // Substituindo o ID da categoria pelo seu respectivo NOME

    for (const key in postagens) {  
        let id_categoria = postagens[key].categoria;
        
        Categoria.findById(id_categoria).lean().then(categoria => {
            postagens[key].categoria = categoria.nome; 
        }).catch(err => {
            console.log("Não foi possível recuperar a categoria" + err); 
        }); 
    }; 

    res.render("admin/postagens", {postagens: postagens}); 

    }).catch(err => {
        res.send("Ocorreu um erro na lstagem" + err); 
    }); 
}); 

router.get("/postagens/add", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", {categorias});
    }).catch((err) => {
        req.flash('error_msg', "Não foi possível gerar as categorias")
        res.redirect("/admin/postagens")
    });
});

router.post("/postagens/nova", (req, res) => {
    
    const postagem = {
        titulo: req.body.titulo, 
        slug: req.body.slug, 
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria
    }

    new Postagens(postagem).save().then(() => {
        req.flash('success_msg', 'Postagem salva com sucesso!')
        res.redirect("/admin/postagens"); 
    }).catch((err) =>{  
        // res.flash('error_msg', 'Não foi possível salvar a postagem!');
        req.flash('error_msg', 'Não foi possível salvar a Postagem!')
        res.redirect("/admin/postagens"); 
    });
}); 

router.post("/postagens/deletar/:id" , (req, res) => {
    const id = req.params.id;  
    Postagens.findByIdAndDelete(id).then(() => {
        req.flash('success_msg', 'Postagem deletada com sucesso!'); 
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível deletar a postagem!'); 
        res.redirect("/admin/postagens")
    }) 
}); 

router
module.exports = router; 