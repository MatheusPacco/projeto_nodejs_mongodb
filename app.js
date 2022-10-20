// Carregando Módulos 
    const express = require('express'); 
    const handlebars = require('express-handlebars'); 
    const app = express(); 
    const admin = require("./routes/admin");
    const path = require('path'); 
    const { default: mongoose } = require('mongoose');
    const session = require("express-session")
    const flash = require("connect-flash"); 
    const moment = require("moment"); 
    const Postagens = mongoose.model('postagens');
    const Categorias = mongoose.model('categorias');
    
    // const mongoose = require('mongoose'); 

// Configurações 
    // Sessão 
    // Criação e Configuração de Middlewares
        app.use(session({
            // Chave para gerar uma sessão
            secret: "cursodenode", 
            resave: true, 
            saveUninitialized: true 
        })); 
        app.use(flash()); 

    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg") 

            next()
        }); 

    // Estrutura de Dados
        app.use(express.urlencoded({extended: true}));
        app.use(express.json());
    // Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'})); 
        app.set('view engine', 'handlebars'); 

        // app.use('handlebars', handlebars.engine({
        //     defaultLayout: 'main',
                // helpers:{
                //     formatDate: (data) => {
                //         return moment(data).format('DD/MM/YYYY')
                //     }
                // }
        // })); 


    // Mongoose
        mongoose.connect('mongodb://localhost/blogapp').then(() => {
            console.log("Servidor Conectado!");
        }).catch(err=>{
            console.log("Não foi possível conectar" + err);
        })  
    
    // Public
        // Porque essa linha deu errado?

        //  app.use(express.static(path.join(__dirname + "public")))
        // app.use(express.static(path.join( 'public/css')))
        app.use(express.static(__dirname + '/public'))
        console.log(__dirname);


// Rotas principais
    app.get("/", (req, res) => {
        Postagens.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
            res.render('index', {postagens}); 
        }).catch((err) => {
            console.log("Não foi possível listar as postagens na Index" + err);
            res.redirect("/404"); 
        })
    })

    app.get("/postagens/:slug", (req, res) => {
        Postagens.findOne({slug: req.params.slug}).lean().populate('categoria').then((post) => {
            if(post){
                console.log(post);
                res.render('postagens/index', {post: post});
            } else {
                req.flash('error_msg', 'Essa postagem não existe');
                res.redirect('/'); 
            }
        }).catch((err) => {
            console.log(err);
            req.flash('error_msg', 'Erro interno com a postagem');
            res.redirect('/'); 
        });
    });

    app.get("/categorias", (req, res) => {
        Categorias.find().lean().sort({data: 'desc'}).then((categorias) => {
            
            res.render('categorias/index', {categorias}); 

        }).catch((err) => {
            console.log(err);
            req.flash('error_msg', 'Não foi possível listar as categorias'); 
            res.redirect('/'); 
        });
        
    }); 

    app.get("/categorias/:slug", (req, res) => {
        const slug = req.params.slug; 
        Categorias.findOne({slug: slug}).then((categoria) => {

            if (categoria) {
                Postagens.find({categoria: categoria._id}).populate('categoria').lean().sort({data: 'desc'}).then((postagens) => {
                    res.render('categorias/postagens', {postagens, categoria}); 

                }).catch((err) => {
                    console.log(err);
                    req.flash('error_msg', 'Erro interno, não foi possível listas as postagens dessa categoria!'); 
                    res.redirect('/categorias'); 
                }); 
            } else {
                req.flash('error_msg', 'Essa categoria não existe'); 
                res.redirect('/categorias'); 
            }
        });
    });

    // Rota de erro
    app.get("/404", (req, res) => {
        res.send("De ruim... /404");
    });

    // Rotas seservadas somente para ao prefixo admin
    app.use('/admin', admin); 

// Outros
const PORT = 8080; 
app.listen(PORT, () => {
    console.log("Servidor Rodando!")   
})
