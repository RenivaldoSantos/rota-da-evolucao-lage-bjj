let alunosCache = [];
let modoOffline = false;

const telaLogin = document.getElementById("tela-login");
const telaChamada = document.getElementById("tela-chamada");
const telaPerfil = document.getElementById("tela-perfil");
const listaAlunosEl = document.getElementById("lista-alunos");
const buscaInput = document.getElementById("busca-aluno");
const statusRedeEl = document.getElementById("status-rede");

/**
 * Sanitiza strings dinâmicas antes de inserir no DOM para prevenir injeção de HTML/XSS.
 */
function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = String(texto);
  return div.innerHTML;
}

document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value;

  if (!usuario || senha.length < 4) {
    alert("Informe um usuário válido e uma senha com pelo menos 4 caracteres.");
    return;
  }

  telaLogin.hidden = true;
  telaChamada.hidden = false;
  alunosCache = await listarAlunos();
  renderizarLista(alunosCache);
});

document.getElementById("btn-simular-offline").addEventListener("click", () => {
  modoOffline = !modoOffline;
  statusRedeEl.className = modoOffline ? "badge-rede offline" : "badge-rede online";
  statusRedeEl.textContent = modoOffline
    ? "▲ Offline (Salvo no Aparelho)"
    : "● Online (Sincronizado)";
});

buscaInput.addEventListener("input", () => {
  renderizarLista(filtrarAlunosPorNome(buscaInput.value));
});

function filtrarAlunosPorNome(termoBusca) {
  const termoNormalizado = termoBusca.toLowerCase().trim();
  return alunosCache.filter((aluno) =>
    aluno.nome.toLowerCase().includes(termoNormalizado)
  );
}

async function alternarPresencaAluno(aluno) {
  aluno.presenteHoje = !aluno.presenteHoje;
  aluno.treinosConcluidos = Math.max(
    0,
    aluno.treinosConcluidos + (aluno.presenteHoje ? 1 : -1)
  );
  await salvarAluno(aluno);
  renderizarLista(filtrarAlunosPorNome(buscaInput.value));
}

function renderizarLista(lista) {
  listaAlunosEl.innerHTML = "";

  lista.forEach((aluno) => {
    const li = document.createElement("li");
    li.className = "item-aluno";

    const info = document.createElement("div");
    info.className = "info-aluno";
    info.setAttribute("role", "button");
    info.setAttribute("tabindex", "0");
    info.innerHTML = `
      <strong>${escaparHTML(aluno.nome)}</strong><br />
      <small>${escaparHTML(aluno.faixa)} • ${aluno.treinosConcluidos}/${aluno.metaTreinos} treinos</small><br />
      <span class="tag-vinculo">${escaparHTML(aluno.vinculo)}</span>
    `;
    info.addEventListener("click", () => abrirPerfil(aluno));

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn-presenca ${aluno.presenteHoje ? "confirmado" : ""}`;
    btn.setAttribute("aria-pressed", String(aluno.presenteHoje));
    btn.textContent = aluno.presenteHoje
      ? "✓ PRESENÇA CONFIRMADA"
      : "+ Confirmar Presença";

    btn.addEventListener("click", () => alternarPresencaAluno(aluno));

    li.appendChild(info);
    li.appendChild(btn);
    listaAlunosEl.appendChild(li);
  });
}

function abrirPerfil(aluno) {
  telaChamada.hidden = true;
  telaPerfil.hidden = false;

  const percentual = Math.min(
    100,
    Math.round((aluno.treinosConcluidos / aluno.metaTreinos) * 100)
  );
  const elegivel = aluno.treinosConcluidos >= aluno.metaTreinos;

  document.getElementById("detalhe-aluno").innerHTML = `
    <h2>${escaparHTML(aluno.nome)}</h2>
    <p><strong>Graduação Atual:</strong> ${escaparHTML(aluno.faixa)}</p>
    <p><strong>Vínculo:</strong> ${escaparHTML(aluno.vinculo)}</p>
    <p><strong>Frequência Acumulada:</strong> ${aluno.treinosConcluidos} de ${aluno.metaTreinos} treinos (${percentual}%)</p>
    <div class="barra-progresso" role="progressbar" aria-valuenow="${percentual}" aria-valuemin="0" aria-valuemax="100">
      <div class="barra-preenchida" style="width: ${percentual}%"></div>
    </div>
    ${
      elegivel
        ? `<div class="alerta-elegivel" role="alert">
             🏅 ELEGÍVEL PARA GRADUAÇÃO — Meta de ${aluno.metaTreinos} treinos atingida!
           </div>`
        : `<p>Faltam <strong>${aluno.metaTreinos - aluno.treinosConcluidos} treino(s)</strong> para a próxima graduação.</p>`
    }
  `;
}

document.getElementById("btn-voltar").addEventListener("click", () => {
  telaPerfil.hidden = true;
  telaChamada.hidden = false;
  renderizarLista(alunosCache);
});
