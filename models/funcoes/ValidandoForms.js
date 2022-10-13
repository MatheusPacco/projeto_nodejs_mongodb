const validando = function Chamada({nome, slug}){

    const erros = []; 

    if(!nome || typeof nome == undefined || nome == null){
        erros.push({texto: "Nome inválido"}); 
    }
    
    if(!slug || typeof slug == undefined || slug == null) {
        erros.push({texto: "Slug inválido"})
    }
    
    if(nome.length <= 2){
        erros.push({texto: "Noma da categoria é muito pequeno"})
    }
    
    if(slug.length <= 2) {
        erros.push({texto: "Noma do Slug é muito pequeno"})
    }

    return erros; 
    
}

module.exports = validando; 


