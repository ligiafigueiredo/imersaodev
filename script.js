let cardContainer = document.querySelector(".card-container"); // Seleciona o container correto
let campoBusca = document.querySelector("div input");
let botaoBusca = document.getElementById("botao-busca");
let dados = [];

async function carregarDados() {
    // Mostra a animação de carregamento
    cardContainer.innerHTML = `<div class="loader"></div>`;

    try {
        let resposta = await fetch("data.json");
        if (!resposta.ok) {
            throw new Error(`HTTP error! status: ${resposta.status}`);
        }
        dados = await resposta.json();
        // Ordena os dados em ordem alfabética pelo nome do artista
        dados.sort((a, b) => a.nome.localeCompare(b.nome));

        renderizarCards(dados);

        // A lógica de busca só é ativada depois que os dados são carregados
        // Adiciona o evento de 'input' para filtrar em tempo real
        campoBusca.addEventListener("input", () => {
            const termoBusca = campoBusca.value.toLowerCase();
            const artistasFiltrados = dados.filter(artista => 
                artista.nome.toLowerCase().includes(termoBusca) ||
                artista.descricao.toLowerCase().includes(termoBusca)
            );
            renderizarCards(artistasFiltrados);
        });

        // Adiciona evento de clique ao botão de busca (embora a busca seja em tempo real)
        botaoBusca.addEventListener('click', () => {
            campoBusca.dispatchEvent(new Event('input'));
        });

    } catch (error) {
        console.error("Erro ao carregar o arquivo data.json:", error);
        cardContainer.innerHTML = `<p style="text-align: center; color: #ff8a80;">Falha ao carregar os dados dos artistas. Verifique o console para mais detalhes.</p>`;
    }
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos
    if (dados.length === 0) {
        cardContainer.innerHTML = `<p style="text-align: center; font-size: 1.2rem;">Nenhum artista encontrado.</p>`;
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.innerHTML = `
            <div class="card-content" style="text-align: center;">
                <h2>${dado.nome}</h2>
                <p><strong>Ano de Nascimento:</strong> ${dado.ano_nascimento}</p>
                <p>${dado.descricao}</p>
                <a href="${dado.link}" target="_blank"> Saiba mais</a>
            </div>
        `;
        cardContainer.appendChild(article);
    }
  }

// --- Lógica para o botão de Tema (Dark/Light Mode) ---
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle'); // Garante que o DOM está carregado
    const body = document.body;
    themeToggle.textContent = '🌙'; // Ícone inicial para o tema padrão (azul), indica "ir para escuro"

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Altera o ícone do botão conforme o tema
        if (body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️'; // Se está escuro, mostra o sol para clarear
        } else {
            themeToggle.textContent = '🌙'; // Se está claro, mostra a lua para escurecer
        }
    });

    carregarDados(); // Chama a função para carregar os dados assim que a página estiver pronta
});
