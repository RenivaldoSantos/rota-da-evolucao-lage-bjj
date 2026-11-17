let alunosCache = [];
let modoOffline = false;

const telaLogin = document.getElementById("tela-login");
const telaChamada = document.getElementById("tela-chamada");
const telaPerfil = document.getElementById("tela-perfil");
const listaAlunosEl = document.getElementById("lista-alunos");
const buscaInput = document.getElementById("busca-aluno");
const statusRedeEl = document.getElementById("status-rede");

document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  telaLogin.hidden = true;
  telaChamada.hidden = false;
  alunosCache = await listarAlunos();
  renderizarLista(alunosCache);
});

document.getElementById("btn-simular-offline").addEventListener("click", () => {
  modoOffline = !modoOffline;
  if (modoOffline) {
    statusRedeEl.className = "badge-rede offline";
    statusRedeEl.textContent = "▲ Offline (Salvo no Aparelho)";
  } else {
    statusRedeEl.className = "badge-rede online";
    statusRedeEl.textContent = "● Online (Sincronizado)";
  }
});

buscaInput.addEventListener("input", () => {
  const termo = buscaInput.value.toLowerCase().trim();
  const filtrados = alunosCache.filter((a) =>
    a.nome.toLowerCase().includes(termo)
  );
  renderizarLista(filtrados);
});

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
      <strong>${aluno.nome}</strong><br />
      <small>${aluno.faixa} • ${aluno.treinosConcluidos}/${aluno.metaTreinos} treinos</small><br />
      <span class="tag-vinculo">${aluno.vinculo}</span>
    `;
    info.addEventListener("click", () => abrirPerfil(aluno));

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn-presenca ${aluno.presenteHoje ? "confirmado" : ""}`;
    btn.setAttribute("aria-pressed", String(aluno.presenteHoje));
    btn.textContent = aluno.presenteHoje
      ? "✓ PRESENÇA CONFIRMADA"
      : "+ Confirmar Presença";

    btn.addEventListener("click", async () => {
      aluno.presenteHoje = !aluno.presenteHoje;
      aluno.treinosConcluidos += aluno.presenteHoje ? 1 : -1;
      await salvarAluno(aluno);
      renderizarLista(
        alunosCache.filter((a) =>
          a.nome.toLowerCase().includes(buscaInput.value.toLowerCase().trim())
        )
      );
    });

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
    <h2>${aluno.nome}</h2>
    <p><strong>Graduação Atual:</strong> ${aluno.faixa}</p>
    <p><strong>Vínculo:</strong> ${aluno.vinculo}</p>
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
