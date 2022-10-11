const express = require('express'); 
const router = express.Router(); 

// Definindo Rotas
router.get('/', (req, res) => {
    res.render("admin/index"); 
})

router.get('/posts', (req, res) => {
    res.send('Página de postagens'); 
})

router.get('/categorias', (req, res) => {
    res.send("Página de Categorias"); 
})


module.exports = router; 