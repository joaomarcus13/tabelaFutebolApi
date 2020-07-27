const jogos = require('../jogos')
const jogosDB = require('../models/jogosDB')

async function verificarDB(campeonato,rodada) {
    const table = await jogosDB.findOne({ campeonato, rodada })
    return table
}

async function gravarDB(campeonato,rodada, conteudo) {
    let result = await jogosDB.findOneAndUpdate({ campeonato,rodada }, { informacoes: JSON.stringify(conteudo) }, { new: true })
    //console.log('resultado', result)
    if (!result)
        await jogosDB.create({ campeonato,rodada,informacoes: JSON.stringify(conteudo[rodada]) })
}

module.exports = async (req,res)=>{
    let campeonato = req.params.nomeCampeonato
    let n_rodada  = req.query.n_rodada ?  `${req.query.n_rodada}ª RODADA` : false
    const refresh = req.query.refresh === 'true' ? true : false

    if(!refresh){
        const rodada = await verificarDB(campeonato,n_rodada)
        if (rodada) {
            console.log('no cache')
            //console.log(rodada)
            return res.json(JSON.parse(rodada.informacoes))
        } else {
            jogos(campeonato,n_rodada)
                .then(async (e) => {
                    await gravarDB(campeonato,Object.keys(e)[0], e)
                    return res.json(e)
                })
                .catch(()=>{
                    return res.json('dados nao disponiveis')
                })
        }
    }else{
        jogos(campeonato,n_rodada)
            .then(async (e) => {
                await gravarDB(campeonato,Object.keys(e)[0], e)
                return res.json(e)
            })
            .catch(()=>{
                return res.json('dados nao disponiveis')
            })
    }
    
}