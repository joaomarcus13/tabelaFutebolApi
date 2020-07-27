const tabela = require('../tabela')
const tabelaDB = require('../models/tabelaDB')

async function verificarDB(fileName) {
    const table = await tabelaDB.findOne({ campeonato: fileName })
    return table
}

async function gravarDB(fileName, conteudo) {
    let result = await tabelaDB.findOneAndUpdate({ campeonato: fileName }, { tabela: JSON.stringify(conteudo) }, { new: true })
    //console.log('resultado', result)
    if (!result)
        await tabelaDB.create({ campeonato: fileName, tabela: JSON.stringify(conteudo) })
}

module.exports = async (req, res) => {
    const refresh = req.query.refresh === 'true' ? true : false
    console.log(req.params.nomeCampeonato)
    console.log(refresh)

    if (!refresh) {
        const table = await verificarDB(req.params.nomeCampeonato)
        if (table) {
            console.log('no cache')
            return res.json(JSON.parse(table.tabela))
        } else {
            tabela(req.params.nomeCampeonato)
                .then(async (e) => {
                    await gravarDB(req.params.nomeCampeonato, e)
                    return res.json(e)
                })
                .catch(()=>{
                    return res.json('dados nao disponiveis')
                })
        }
    } else {
        tabela(req.params.nomeCampeonato)
            .then(async (e) => {
                await gravarDB(req.params.nomeCampeonato, e)
                return res.json(e)
            })
            .catch(()=>{
                return res.json('dados nao disponiveis')
            })
    }


}