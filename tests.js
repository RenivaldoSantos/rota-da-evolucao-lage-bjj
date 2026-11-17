const test = require("node:test");
const assert = require("node:assert/strict");

// --- Funções extraídas do MVP Rota da Evolução (Lage BJJ) ---
function escaparHTML(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function verificarElegibilidade(aluno) {
  return aluno.treinosConcluidos >= aluno.metaTreinos;
}

function filtrarAlunosPorNome(lista, termoBusca) {
  const termo = termoBusca.toLowerCase().trim();
  return lista.filter((a) => a.nome.toLowerCase().includes(termo));
}

function alternarPresenca(aluno) {
  aluno.presenteHoje = !aluno.presenteHoje;
  aluno.treinosConcluidos = Math.max(
    0,
    aluno.treinosConcluidos + (aluno.presenteHoje ? 1 : -1)
  );
  return aluno;
}

// Simulação do adaptador IndexedDB para teste de integração offline-first
class IndexedDBMock {
  constructor() {
    this.store = new Map();
  }
  async salvarAluno(aluno) {
    this.store.set(aluno.id, { ...aluno });
    return true;
  }
  async listarAlunos() {
    return Array.from(this.store.values());
  }
}

// ==================== SUÍTE DE TESTES UNITÁRIOS ====================
test("Unitário 1: Deve identificar aluno elegível quando atingir a meta de treinos", () => {
  const aluno = { nome: "Gabriel Oliveira", treinosConcluidos: 40, metaTreinos: 40 };
  assert.equal(verificarElegibilidade(aluno), true);
});

test("Unitário 2: Deve manter aluno como não elegível antes de completar a meta", () => {
  const aluno = { nome: "Lucas Mendes", treinosConcluidos: 39, metaTreinos: 40 };
  assert.equal(verificarElegibilidade(aluno), false);
});

test("Unitário 3: Deve sanitizar caracteres maliciosos contra XSS", () => {
  const entradaMaliciosa = '<script>alert("xss")</script>';
  const saidaSegura = escaparHTML(entradaMaliciosa);
  assert.equal(saidaSegura, "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
});

test("Unitário 4: Deve filtrar alunos ignorando maiúsculas e espaços extras", () => {
  const turma = [
    { nome: "Lucas Mendes (Fictício)" },
    { nome: "Rafael Costa (Fictício)" }
  ];
  const resultado = filtrarAlunosPorNome(turma, "  LUCAS ");
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].nome, "Lucas Mendes (Fictício)");
});

test("Unitário 5: Deve impedir contador negativo ao desmarcar presença", () => {
  const aluno = { treinosConcluidos: 0, presenteHoje: true };
  alternarPresenca(aluno);
  assert.equal(aluno.presenteHoje, false);
  assert.equal(aluno.treinosConcluidos, 0);
});

// ==================== SUÍTE DE TESTES DE INTEGRAÇÃO ====================
test("Integração 1: Deve persistir presença offline no IndexedDB e refletir na listagem", async () => {
  const db = new IndexedDBMock();
  const bolsista = {
    id: 1,
    nome: "Lucas Mendes (Fictício)",
    treinosConcluidos: 39,
    metaTreinos: 40,
    presenteHoje: false
  };

  alternarPresenca(bolsista);
  await db.salvarAluno(bolsista);

  const registrosSalvos = await db.listarAlunos();
  assert.equal(registrosSalvos.length, 1);
  assert.equal(registrosSalvos[0].presenteHoje, true);
  assert.equal(registrosSalvos[0].treinosConcluidos, 40);
  assert.equal(verificarElegibilidade(registrosSalvos[0]), true);
});
