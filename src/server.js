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

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    app.use(cors())
    next()
})


app.get('/tabela/:nomeCampeonato',tabelaController )
app.get('/jogos/:nomeCampeonato',jogosController )


app.listen(3000, () => {
    console.log('server port 3000')
})