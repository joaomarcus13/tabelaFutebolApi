const mongo = require('mongoose')


const partidaSchema = new mongo.Schema({
    campeonato:String,
    rodada:String,
    informacoes:String
    
})

module.exports = mongo.model('jogosDB',partidaSchema)