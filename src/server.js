const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const tabelaController = require('./controllers/tabelaController')
const jogosController = require('./controllers/jogosController')
require('dotenv').config()
//

mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('conectado com sucesso') })
    .catch(() => { console.log('erro ao conectar') });

mongoose.set('useFindAndModify', false);

//app.use((req, res, next) => {
    //res.header("Access-Control-Allow-Origin", "http://localhost:192.168.0.100")
    //app.use(cors({origin:'localhost:192.168.0.100'}))
  //  next()
//})

function verify(req,res,next){
    if(req.headers['token'] != process.env.TOKEN || !req.headers['token'])
        return res.status(403).send("acesso negado")
    
    next()
}

app.get('/tabela/:nomeCampeonato',verify,tabelaController )
app.get('/jogos/:nomeCampeonato',verify,jogosController )


app.listen(process.env.PORT || 3000, () => {
    console.log('server port 3000')
})