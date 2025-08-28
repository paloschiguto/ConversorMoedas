import { listarMoedas, converterMoeda } from './api.js'

const btn = document.getElementById('btn')
const moedaOrig = document.getElementById('moedaOrig')
const moedaDest = document.getElementById('moedaDest')
const valorInput = document.querySelector('.valor input')

let moedasCache = null;
let carregouMoedas = false;

async function carregarMoedas() {
    if (carregouMoedas) return;
    try {
        moedasCache = await listarMoedas()

        for (const [code, name] of Object.entries(moedasCache)) {
            const option1 = document.createElement('option')
            option1.value = code;
            option1.textContent = `${code} - ${name}`
            moedaOrig.appendChild(option1)

            const option2 = document.createElement('option')
            option2.value = code
            option2.textContent = `${code} - ${name}`
            moedaDest.appendChild(option2)
        }

        carregouMoedas = true
    } catch (err) {
        console.error('Erro ao carregar moedas', err)
    }
}

window.addEventListener('DOMContentLoaded', carregarMoedas)

moedaOrig.addEventListener('change', () => {
    if (!moedasCache) return

    const selecionada = moedaOrig.value

    moedaDest.innerHTML = '<option value="default" selected>Selecione uma moeda</option>';

    for (const [code, name] of Object.entries(moedasCache)) {
        if (code === selecionada) continue; // pula a moeda da origem

        const option = document.createElement('option')
        option.value = code;
        option.textContent = `${code} - ${name}`
        moedaDest.appendChild(option)
    }
});


btn.addEventListener('click', async () => {
    document.querySelectorAll('.error-msg').forEach(msg => msg.remove());
    [moedaOrig, moedaDest, valorInput].forEach(field => field.style.border = '')

    let hasError = false

    if (moedaOrig.value === 'default') {
        showError(moedaOrig, 'Campo obrigatório')
        hasError = true
    }

    if (moedaDest.value === 'default') {
        showError(moedaDest, 'Campo obrigatório')
        hasError = true
    }

    if (!valorInput.value) {
        showError(valorInput, 'Campo obrigatório')
        hasError = true
    }


    const resultadoDiv = document.querySelector('.valorResult')

    if (!hasError) {
        try {
            const resultado = await converterMoeda(moedaOrig.value, moedaDest.value, valorInput.value)
            const valorConvertido = Object.values(resultado.rates)[0]

            resultadoDiv.textContent = `${valorConvertido.toFixed(2)} ${moedaDest.value}`
            resultadoDiv.style.color = 'green'
            resultadoDiv.style.marginTop = '5px'

        } catch (err) {
            console.error(err)
            resultadoDiv.textContent = 'Erro na conversão'
            resultadoDiv.style.color = 'red'
        }
    }
})

function showError(element, message) {
    element.style.border = '1px solid red'
    const error = document.createElement('small')
    error.classList.add('error-msg')
    error.style.fontSize = '10px'
    error.style.color = 'red'
    error.style.marginBottom = '2px'
    error.textContent = message
    element.parentElement.insertBefore(error, element)
}
