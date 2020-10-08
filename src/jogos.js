const puppeter = require('puppeteer')

async function main(nomeCampeonato, n_rodada = false) {
    const url = nomeCampeonato === 'brasileiro' ?
        'https://globoesporte.globo.com/futebol/brasileirao-serie-a/' :
        `https://globoesporte.globo.com/futebol/futebol-internacional/futebol-${nomeCampeonato}/`

    const browser = await puppeter.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: "load" })


    async function capturarRodada() {
        let rodada, seta, sub
        try {
            while (true) {
                rodada = await page.$eval('span.lista-jogos__navegacao--rodada', (a) => a.innerHTML)
                sub = rodada.substring(0, 2)
                if(sub.substring(1) === 'ª')
                    sub = sub.substring(0,1)
             
                if (!n_rodada || Number(sub) === Number(n_rodada))
                    break
                seta = Number(sub) > Number(n_rodada) ? 'esquerda' : 'direita'
                await page.click(`.lista-jogos__navegacao--setas.lista-jogos__navegacao--seta-${seta}.lista-jogos__navegacao--setas-ativa`)
                await page.waitFor(800)
            };
        } catch (error) {
            //console.log(error)
            return null
        }

        return rodada
    }

    async function capturarJogos() {
        let placar
        try {
            placar = await page.evaluate(() => {
                let info = [], arrMandante = [], arrVisitante = [], arrPlacarMandante = [], arrPlacarVisitante = [], 
                arrVejaComoFoi = []
                document.querySelectorAll(".jogo__informacoes").forEach(el => {
                    const arr = []
                    for (let i = 0; i < 3; i++) {
                        arr.push(el.children[i].innerText.trim())
                    }
                    info.push(arr)
                })

                /* document.querySelectorAll('.placar__equipes.placar__equipes--mandante').forEach(el => {
                    arrMandante.push(el.children[2].innerText)
                }) */
                document.querySelectorAll('div.placar__equipes.placar__equipes--mandante > span.equipes__sigla').forEach(el => {
                    arrMandante.push(el.innerText)})
                    
                /* document.querySelectorAll('.placar__equipes.placar__equipes--visitante').forEach(el => {
                    arrVisitante.push(el.children[3].innerText)
                }) */

                document.querySelectorAll('div.placar__equipes.placar__equipes--visitante > span.equipes__sigla').forEach(el => {
                    arrVisitante.push(el.innerText)
                })


                document.querySelectorAll('.placar-box__valor.placar-box__valor--mandante').forEach(el => {
                    arrPlacarMandante.push(el.innerText)
                })
                document.querySelectorAll('.placar-box__valor.placar-box__valor--visitante').forEach(el => {
                    arrPlacarVisitante.push(el.innerText)
                })

                 document.querySelectorAll('.jogo__transmissao--link').forEach(el => {
                    arrVejaComoFoi.push(el.href)
                })
                
                
                const obj = []
                for (i = 0; i < info.length; i++) {
                    obj.push({
                        mandante: arrMandante[i],
                        golMandante: arrPlacarMandante[i],
                        visitante: arrVisitante[i],
                        golVisitante: arrPlacarVisitante[i],
                        //escudoMandante: arrEscudoMandante[i],
                        //escudoVisitante: arrEscudoVisitante[i],
                        data: info[i][0],
                        local: info[i][1],
                        horario: info[i][2],
                        vejacomofoi: arrVejaComoFoi[i] || ""
                    })
                }
                return obj
            })
        } catch (error) {
            //console.log('error',error)
            return null
        }
        return placar
    }

    async function montar() {
        const callback = async (resolve, reject) => {
            const obj = {}
            const rodada = await capturarRodada()
            const jogos = await capturarJogos()
            await browser.close()


            if(!rodada || !jogos){
                reject(null)
                return
            }

            obj[rodada] = jogos
            resolve(obj)
        }
        return new Promise(callback)
    }

    return montar()

}


module.exports = main

//main('brasileiro').then(console.log).catch((e)=>{console.log('erro: ',e)})

