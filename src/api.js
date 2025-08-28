const BASE_URL = 'https://api.frankfurter.app';

// Listar todas as moedas
export async function listarMoedas() {
    const response = await fetch(`${BASE_URL}/currencies`);
    if (!response.ok) throw new Error('Erro ao buscar moedas');
    return response.json(); 
}

// Converter de uma moeda para outra
export async function converterMoeda(from, to, amount) {
    const response = await fetch(`${BASE_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
    if (!response.ok) throw new Error('Erro ao converter moeda');
    return response.json(); 
}
