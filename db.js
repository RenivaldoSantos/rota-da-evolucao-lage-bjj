const DB_NAME = "RotaEvolucaoLageBJJ";
const DB_VERSION = 1;
const STORE_ALUNOS = "alunos";

const DADOS_INICIAIS = [
  {
    id: 1,
    nome: "Lucas Mendes (Fictício)",
    faixa: "Faixa Branca — 3º Grau",
    vinculo: "Bolsista Social (ODS 10)",
    treinosConcluidos: 39,
    metaTreinos: 40,
    presenteHoje: false
  },
  {
    id: 2,
    nome: "Rafael Costa (Fictício)",
    faixa: "Faixa Azul — 1º Grau",
    vinculo: "Mensalista Regular",
    treinosConcluidos: 24,
    metaTreinos: 50,
    presenteHoje: false
  },
  {
    id: 3,
    nome: "Gabriel Oliveira (Fictício)",
    faixa: "Faixa Branca — 4º Grau",
    vinculo: "Bolsista Social (ODS 10)",
    treinosConcluidos: 40,
    metaTreinos: 40,
    presenteHoje: false
  }
];

function abrirBanco() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_ALUNOS)) {
        const store = db.createObjectStore(STORE_ALUNOS, { keyPath: "id" });
        DADOS_INICIAIS.forEach((aluno) => store.add(aluno));
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function listarAlunos() {
  const db = await abrirBanco();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ALUNOS, "readonly");
    const store = tx.objectStore(STORE_ALUNOS);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function salvarAluno(aluno) {
  const db = await abrirBanco();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ALUNOS, "readwrite");
    const store = tx.objectStore(STORE_ALUNOS);
    const req = store.put(aluno);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}
