// Carregando Módulos 
    const express = require('express'); 
    const handlebars = require('express-handlebars'); 
    const app = express(); 
    const admin = require("./routes/admin")
    const path = require('path'); 

    // const mongoose = require('mongoose'); 

// Configurações 
    // Estrutura de Daods
        app.use(express.urlencoded({extended: true}));
        app.use(express.json());
    // Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'})); 
        app.set('view engine', 'handlebars'); 
    // Mongoose
        //em breve
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
