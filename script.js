/************************************
 🔒 BLOQUEIO DE LOGIN
*************************************/
if (!window.location.href.includes("login.html")) {
    const logado = localStorage.getItem("logado");
    if (logado !== "sim") {
        window.location.href = "login.html";
    }
}

/************************************
 🔓 FUNÇÃO DE SAIR DO SISTEMA
*************************************/
function logout() {
    localStorage.removeItem("logado");
    window.location.href = "login.html";
}

/************************************
 📦 SISTEMA DE ESTOQUE (SEU CÓDIGO)
*************************************/
let estoque = [];

const getElement = (id) => document.getElementById(id);
const getQuery = (selector) => document.querySelector(selector);

const formCadastro = getElement('cadastro-form');
const tabelaEstoqueBody = getQuery('#tabela-estoque tbody');
const listaAlertas = getElement('lista-alertas');


/***************************************************
 📌 Adicionar novo item ao estoque
****************************************************/
function adicionarItem(item) {
    item.id = Date.now();
    item.quantidade = parseInt(item.quantidade);
    item.limiteAlerta = parseInt(item.limiteAlerta);
    estoque.push(item);
    renderizarEstoque();
    verificarAlertas();
}


/***************************************************
 🔄 Atualizar quantidade (entrada ou saída)
****************************************************/
function atualizarQuantidade(id, delta) {
    const item = estoque.find(i => i.id === id);
    if (item) {
        item.quantidade = Math.max(0, item.quantidade + delta);
        renderizarEstoque();
        verificarAlertas();
    }
}


/***************************************************
 🧾 Renderizar tabela de estoque
****************************************************/
function renderizarEstoque() {
    tabelaEstoqueBody.innerHTML = '';

    if (estoque.length === 0) {
        tabelaEstoqueBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    Nenhum item registrado no estoque ainda.
                </td>
            </tr>
        `;
        return;
    }

    estoque.forEach(item => {
        const row = tabelaEstoqueBody.insertRow();
        const isLow = item.quantidade <= item.limiteAlerta;

        row.className = isLow ? 'low-stock' : '';

        row.insertCell().textContent = item.nome;
        row.insertCell().textContent = `${item.marca} / ${item.modelo}`;
        row.insertCell().textContent = item.caracteristicas;
        row.insertCell().textContent = item.quantidade;
        row.insertCell().textContent = item.limiteAlerta;

        const acoesCell = row.insertCell();
        acoesCell.innerHTML = `
            <button class="acao-btn entrada-btn" onclick="atualizarQuantidade(${item.id}, 1)">+ Entrada</button>
            <button class="acao-btn saida-btn" onclick="atualizarQuantidade(${item.id}, -1)">- Saída</button>
        `;
    });
}


/***************************************************
 🚨 Verificar alertas de estoque baixo
****************************************************/
function verificarAlertas() {
    listaAlertas.innerHTML = '';

    const itensComAlerta = estoque.filter(item => item.quantidade <= item.limiteAlerta);

    if (itensComAlerta.length === 0) {
        listaAlertas.innerHTML = '<li>Nenhum alerta de estoque baixo no momento.</li>';
        return;
    }

    itensComAlerta.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item-alerta';
        li.textContent = `🚨 ALERTA: ${item.nome} (${item.marca}) está em ${item.quantidade}. Limite: ${item.limiteAlerta}.`;
        listaAlertas.appendChild(li);
    });
}


/***************************************************
 📥 Cadastro de novos itens
****************************************************/
formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = getElement('nome').value;
    const marca = getElement('marca').value;
    const modelo = getElement('modelo').value;
    const caracteristicas = getElement('caracteristicas').value;
    const quantidade = getElement('quantidade').value;
    const limiteAlerta = getElement('limite-alerta').value;

    const novoItem = {
        nome,
        marca,
        modelo,
        caracteristicas,
        quantidade,
        limiteAlerta
    };

    adicionarItem(novoItem);
    formCadastro.reset();
});


/***************************************************
 🟦 Item pré-cadastrado (exemplo)
****************************************************/
document.addEventListener('DOMContentLoaded', () => {
    adicionarItem({
        nome: "Martelo de Unha 1kg MASTER",
        marca: "MASTER",
        modelo: "Perfil Reto",
        caracteristicas: "Cabo Tubular, Aço Carbono, 1kg",
        quantidade: 4,
        limiteAlerta: 5
    });
});
