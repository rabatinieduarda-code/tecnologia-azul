// Menu responsivo: abre e fecha a navegação em telas pequenas.
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const aberto = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(aberto));
  menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
});

// Perguntas do quiz organizadas em um array de objetos.
const perguntas = [
  {
    pergunta: "O que são data centers?",
    alternativas: [
      "Locais utilizados exclusivamente para armazenar água.",
      "Instalações que armazenam, processam e distribuem informações.",
      "Empresas responsáveis pela fabricação de celulares.",
      "Sistemas utilizados apenas para produzir energia."
    ],
    correta: 1,
    explicacao: "Isso mesmo! Data centers armazenam, processam e distribuem informações."
  },
  {
    pergunta: "Por que alguns data centers utilizam água?",
    alternativas: [
      "Para produzir os servidores.",
      "Para limpar os computadores diariamente.",
      "Para ajudar a resfriar os equipamentos.",
      "Para armazenar informações."
    ],
    correta: 2,
    explicacao: "Correto! Em determinados sistemas, a água ajuda a retirar o calor dos equipamentos."
  },
  {
    pergunta: "Qual é uma possível consequência do consumo excessivo de água?",
    alternativas: [
      "Aumento da disponibilidade de água.",
      "Redução da pressão sobre os recursos naturais.",
      "Diminuição da temperatura global.",
      "Maior pressão sobre rios e reservatórios."
    ],
    correta: 3,
    explicacao: "Exatamente. O consumo elevado pode aumentar a pressão sobre rios e reservatórios."
  },
  {
    pergunta: "Qual alternativa apresenta uma solução para diminuir o consumo de água?",
    alternativas: [
      "Utilizar sistemas de refrigeração mais eficientes.",
      "Aumentar o desperdício de água.",
      "Construir data centers sem planejamento.",
      "Evitar a reutilização da água."
    ],
    correta: 0,
    explicacao: "Boa! Sistemas eficientes podem reduzir a quantidade de água necessária."
  },
  {
    pergunta: "Os dados apresentados representam exclusivamente data centers de inteligência artificial?",
    alternativas: [
      "Sim, todos os números são exclusivos de IA.",
      "Não, os dados incluem data centers utilizados para diferentes serviços.",
      "Sim, mas somente nos Estados Unidos.",
      "Não, porque data centers não consomem água."
    ],
    correta: 1,
    explicacao: "Isso mesmo. Os dados citados abrangem data centers em geral, não apenas os usados para IA."
  }
];

let perguntaAtual = 0;
let pontuacao = 0;
let respostaEscolhida = null;
let respondido = false;

const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");
const quizProgress = document.getElementById("quizProgress");
const progressBar = document.getElementById("progressBar");
const feedback = document.getElementById("feedback");
const nextQuestion = document.getElementById("nextQuestion");

function mostrarPergunta() {
  const atual = perguntas[perguntaAtual];
  respostaEscolhida = null;
  respondido = false;
  questionText.textContent = atual.pergunta;
  quizProgress.textContent = `PERGUNTA ${perguntaAtual + 1} DE ${perguntas.length}`;
  progressBar.style.width = `${((perguntaAtual + 1) / perguntas.length) * 100}%`;
  feedback.textContent = "Selecione uma alternativa para continuar.";
  nextQuestion.disabled = true;
  nextQuestion.textContent = perguntaAtual === perguntas.length - 1 ? "Ver resultado →" : "Próxima pergunta →";
  answers.innerHTML = "";

  atual.alternativas.forEach((alternativa, indice) => {
    const botao = document.createElement("button");
    botao.className = "answer";
    botao.type = "button";
    botao.innerHTML = `<span class="letter">${String.fromCharCode(65 + indice)}</span><span></span>`;
    botao.querySelector("span:last-child").textContent = alternativa;
    botao.addEventListener("click", () => selecionarResposta(indice));
    answers.appendChild(botao);
  });
}

function selecionarResposta(indice) {
  if (respondido) return;
  respostaEscolhida = indice;
  const botoes = answers.querySelectorAll(".answer");
  botoes.forEach((botao, i) => {
    botao.classList.toggle("selected", i === indice);
  });
  nextQuestion.disabled = false;
  feedback.textContent = "Alternativa selecionada. Clique em próxima pergunta para confirmar.";
}

function confirmarResposta() {
  if (respostaEscolhida === null || respondido) return;
  respondido = true;
  const atual = perguntas[perguntaAtual];
  const botoes = answers.querySelectorAll(".answer");
  botoes.forEach((botao, i) => {
    botao.disabled = true;
    if (i === atual.correta) botao.classList.add("correct");
    if (i === respostaEscolhida && i !== atual.correta) botao.classList.add("wrong");
  });

  if (respostaEscolhida === atual.correta) {
    pontuacao++;
    feedback.textContent = `Resposta correta! ${atual.explicacao}`;
  } else {
    feedback.textContent = `Não foi dessa vez. ${atual.explicacao}`;
  }
  nextQuestion.textContent = perguntaAtual === perguntas.length - 1 ? "Conferir resultado →" : "Continuar →";
}

function mostrarResultado() {
  quizProgress.textContent = "QUIZ FINALIZADO";
  progressBar.style.width = "100%";
  questionText.textContent = `Você acertou ${pontuacao} de ${perguntas.length} perguntas!`;
  answers.innerHTML = "";
  const mensagem = pontuacao === 5
    ? "Excelente! Você entendeu os principais pontos da pesquisa."
    : pontuacao >= 3
      ? "Muito bem! Você já conhece boa parte do assunto."
      : "Vale revisar a pesquisa e tentar novamente. Aprender também faz parte do caminho.";
  feedback.textContent = mensagem;
  nextQuestion.textContent = "Refazer o quiz ↻";
  nextQuestion.disabled = false;
  nextQuestion.dataset.restart = "true";
}

nextQuestion.addEventListener("click", () => {
  if (nextQuestion.dataset.restart === "true") {
    perguntaAtual = 0;
    pontuacao = 0;
    delete nextQuestion.dataset.restart;
    mostrarPergunta();
    return;
  }
  if (!respondido) {
    confirmarResposta();
    return;
  }
  if (perguntaAtual < perguntas.length - 1) {
    perguntaAtual++;
    mostrarPergunta();
  } else {
    mostrarResultado();
  }
});

mostrarPergunta();
