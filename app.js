// Carregando Módulos 
    const express = require('express'); 
    const handlebars = require('express-handlebars'); 
    const app = express(); 
    const admin = require("./routes/admin")
    const path = require('path'); 
    const { default: mongoose } = require('mongoose');
    const session = require("express-session")
    const flash = require("connect-flash"); 

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


// Rotas
    // Rotas seservadas somente para ao prefixo admin
    app.use('/admin', admin); 

// Outros
const PORT = 8080; 
app.listen(PORT, () => {
    console.log("Servidor Rodando!")   
})
