async function pegarDados() {
    const resposta = await apiConfig.get('/character')
    console.log(resposta) 
    return resposta
}
pegarDados()
document.addEventListener('DOMContentLoaded', async () => {
    pegarDados()

    const respostaApi = await buscarPersonagens(1)

    if (!respostaApi) {
        return
    }

    const listPersonagens = respostaApi.results
    console.log(listPersonagens)
    
    montarCards(listPersonagens)

    //montarBotoes(respostaApi)
   
    infoGerais()
    
})


async function buscarPersonagens(page) {
   const personagem = await apiConfig.get(`https://rickandmortyapi.com/api/character?page=${page?page:1}`)
   const data = personagem.data

   return data
}

function montarCards (personagens) {

    const main = document.getElementById('espaco-cards')
    main.innerHTML = ""

    personagens.forEach((personagem) => {
        const div = document.createElement('div')
        div.classList.add('container-card')

        const div2 = document.createElement('div')
        div2.classList.add('container-card-info')

        const image = document.createElement('img')
        image.classList.add('img-personagens')
        image.setAttribute("src", personagem.image)

        const h2 = document.createElement('h2')
        h2.classList.add('titulo-card')
        h2.innerHTML = personagem.name

        const p1 = document.createElement('p')
        p1.classList.add('dados-personagem')
        p1.innerText = `Status: ${personagem.status}`

        const p2 = document.createElement('p')
        p2.classList.add('dados-personagem')
        p2.innerText = `Espécie: ${personagem.species}`

        div.appendChild(image)
        
        div2.appendChild(h2)
        div2.appendChild(p1)
        div2.appendChild(p2)
        div.appendChild(div2)
        main.appendChild(div)
       

    });


    
}

/* async function montarBotoes() {
    const divEspaco = document.getElementById('espaco-botoes')
    const paginas = await pegarDados()


    for (let contador = 1; contador <= paginas.data.info.pages; contador++) {
        const button = document.createElement('button') // <button></button>
        button.setAttribute('id', `${contador}`)
        button.innerText = `Página ${contador}` // <button>Página 1</button>
        button.addEventListener('click', async () => {
            const respostaApi = await buscarPersonagens(contador)
            console.log(respostaApi)
            montarCards(respostaApi)
        })

        divEspaco.appendChild(button)
    }

} */

async function infoGerais () {
    const personagens = await apiConfig.get('/character')
    const episodios = await apiConfig.get('/episode')
    const localizacoes = await apiConfig.get('/location')
    console.log(personagens)

    const div = document.getElementById('container-infos')
    div.innerHTML = ""

    const p = document.createElement('p')
    p.innerText = `PERSONAGENS: ${personagens.data.info.count}`
    const p2 = document.createElement('p')
    p2.innerText = `EPISÓDIOS: ${episodios.data.info.count}`
    const p3 = document.createElement('p')
    p3.innerText = `LOCALIZAÇÕES: ${localizacoes.data.info.count}`

    div.appendChild(p)
    div.appendChild(p2)
    div.appendChild(p3)


}
function groupThePages(pages, group){
    const groupPages = []
    let qtd = group -1

    for(let i = 1; i <= pages; i+=5){
        let array = []
        for(let j = i; j <= i + qtd; j++){
            if(j === pages + 1){
                break
            }
            array.push(j)
        }
        
        groupPages.push(array)
    }
    return groupPages
}

let groupCounter = 0
let pageCounter = 1

const arrayBtns = groupThePages(42, 5)
const btnBack = document.createElement("button")
const btnForward = document.createElement("button")
const btns = document.createElement("div")
const paginationContainter = document.getElementById("espaco-botoes")

btnBack.classList.add("botoes-paginas")
btnForward.classList.add("botoes-paginas")
btns.classList.add("fundo-botoes")

btnBack.innerText = "Anterior"
btnForward.innerText = "Próximo"

paginationContainter.appendChild(btnBack)
paginationContainter.appendChild(btns)
paginationContainter.appendChild(btnForward)


function arrumarBotoes(counter) {
    let array = []
    for(let i = 0; i < arrayBtns[counter].length ; i++){
        const btn = document.createElement("button")

        btn.setAttribute("id", `${arrayBtns[counter][i]}`)
        btn.innerText = (`${arrayBtns[counter][i]}`)
        btn.classList.add("botoes-paginas")
        btns.appendChild(btn)
        array.push(btn)

        btn.addEventListener("click", async (e)=>{

            for(let i = 0; i < array.length; i++){
                array[i].removeAttribute("disabled")

            }

            let btnCurrent = document.getElementById(`${e.target.id}`)

            btnCurrent.setAttribute("disabled", true)

            console.log(btnCurrent)

            const persons = await buscarPersonagens(e.target.id)
            montarCards(persons.results)
            pageCounter = e.target.id
        })
    }

    return array
}

arrumarBotoes(groupCounter)


btnForward.addEventListener("click", async ()=>{
    if(pageCounter % 5 === 0 && pageCounter !== 0){
        btns.innerHTML = ""
        groupCounter++
        
        arrumarBotoes(groupCounter)    
    }
    
    if(pageCounter < 42){
        pageCounter++
        console.log("forward após counter",pageCounter)
        const persons = await buscarPersonagens(pageCounter)
        montarCards(persons.results)
        
        let btnCurrent = document.getElementById(`${pageCounter}`)
       
        let btnPrev = document.getElementById(`${pageCounter - 1}`)
    
        btnCurrent.setAttribute("disabled", true)
        if(btnPrev){
            btnPrev.removeAttribute("disabled")
        }  
    }
})

btnBack.addEventListener("click", async ()=>{
    let group = groupThePages(42,5)

    if(pageCounter == group[groupCounter][0]){
        btns.innerHTML = ""
        if(groupCounter > 0){
            groupCounter--
        }
        
        arrumarBotoes(groupCounter)    
    }
    if(pageCounter > 1){
        pageCounter--
        console.log("back depois do counter", pageCounter)
        const persons = await buscarPersonagens(pageCounter)
        montarCards(persons.results)
         
        let btn1 = document.getElementById("1")
        if(btn1){
            btn1.removeAttribute("disabled")
        }
  
        let btnCurrent = document.getElementById(`${pageCounter}`)
        console.log(btnCurrent)
        if(btnCurrent){
            btnCurrent.setAttribute("disabled", true)
        }
        
        let btnPrev = document.getElementById(`${pageCounter + 1}`)
        if(btnPrev){
            btnPrev.removeAttribute("disabled")
        }
    }
})