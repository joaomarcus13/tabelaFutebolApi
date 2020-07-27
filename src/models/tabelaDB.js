const mongo = require('mongoose')


const campeonatoSchema = new mongo.Schema({
    campeonato:String,
    tabela:String
    
})

module.exports = mongo.model('tabelaDB',campeonatoSchema)