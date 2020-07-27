const puppeteer = require('puppeteer')

const main = async (nomeCampeonato) => {
    const url = nomeCampeonato === 'brasileiro' ?
        'https://globoesporte.globo.com/futebol/brasileirao-serie-a/' :
        `https://globoesporte.globo.com/futebol/futebol-internacional/futebol-${nomeCampeonato}/`

    /* const filePath = nomeCampeonato === 'brasileiro' ?
        '../tables/brasileiro.json' :
        `../tables/futebol-${nomeCampeonato}.json` */

    const campeonato = {}
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: "load" })

    async function capturar(seletor) {
        let times
        try {
            await page.evaluate((seletor) => {
                let arr = []
                document.querySelectorAll(seletor)
                    .forEach(e => {
                        arr.push(e.innerHTML)
                    })
                return arr

            }, seletor)
        } catch (error) {
            console.log('erro')
            return null
        }

        return times
    }

    async function capturarPontos() {
        let arrayPontos = []
        try {
            for (let i = 1; i <= 20; i++) {
                let a = await page.evaluate((i) => {
                    let temp = []
                    document.querySelectorAll(`#classificacao__wrapper > article > section.tabela.tabela__pontos-corridos > div > table.tabela__pontos > tbody > tr:nth-child(${i}) > td`)
                        .forEach(el => {
                            temp.push(el.innerHTML)
                        })
                    return temp
                }, i)

                arrayPontos.push(a)
            }
        } catch (error) {
            console.log('erro')
            return null
        }

        return arrayPontos
    }

    /* function verificar(filePath) {
        try {
            const fileBuffer = fs.readFileSync(filePath, 'utf-8')
            return fileBuffer
        } catch (error) {
            return null
        }
    }
 */
    /* function gravar(filePath, conteudo) {
        let dados = JSON.stringify(conteudo)
        console.log('gravando')
        fs.writeFileSync(filePath, dados)
    } */

    async function montar() {

        const callback = async (resolve, reject) => {
            let times = await capturar('#classificacao__wrapper > article > section.tabela.tabela__pontos-corridos > div > table.tabela__equipes.tabela__equipes--com-borda > tbody > tr > td.classificacao__equipes.classificacao__equipes--time > strong')

            let arrayPontos = await capturarPontos()

            await browser.close()

            if (!times || !arrayPontos) {
                reject(null)
                return
            }

            for (let i = 1; i <= 20; i++) {
                campeonato[i] = {
                    time: times[i - 1],
                    pontos: arrayPontos[i - 1][0],
                    jogos: arrayPontos[i - 1][1],
                    vitorias: arrayPontos[i - 1][2],
                    empates: arrayPontos[i - 1][3],
                    derrotas: arrayPontos[i - 1][4],
                    gp: arrayPontos[i - 1][5],
                    gc: arrayPontos[i - 1][6],
                    sg: arrayPontos[i - 1][7],
                    aproveitamento: arrayPontos[i - 1][8]
                }
            }
            resolve(campeonato)
        }

        return new Promise(callback)
    }

    return montar()

}


module.exports = main

//main('brasileiro', true).then(e=>{console.log(e)})