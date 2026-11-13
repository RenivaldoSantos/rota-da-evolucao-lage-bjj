# rota-da-evolucao-lage-bjj
MVP de gestão de presença tátil no tatame e controle de elegibilidade de graduação para a academia Lage BJJ.
# 🥋 Rota da Evolução — Lage BJJ (MVP)

Aplicação web/mobile *offline-first* desenvolvida como Produto Mínimo Viável (MVP) para agilizar o registro tátil de frequência no tatame e automatizar o acompanhamento de elegibilidade de graduação e bolsas de estudo da academia **Lage BJJ** (Franco da Rocha/SP).

## 🎯 Objetivo e Alinhamento
- **Problema resolvido:** Eliminação de planilhas em papel, rasuras e lentidão na chamada ao final dos treinos.
- **Impacto Social (ODS 10 — Meta 10.2):** Garante transparência e auditoria objetiva na assiduidade dos alunos bolsistas em situação de vulnerabilidade socioeconômica.

## 📱 Telas do MVP
1. **Tela 1 — Entrada e Autenticação:** Login seguro (JWT) com indicador visual de conectividade (*Online / Offline*).
2. **Tela 2 — Chamada Tátil no Tatame:** Lista da turma com botões de alto contraste (50×50px) e persistência local via `IndexedDB`.
3. **Tela 3 — Perfil e Elegibilidade:** Barra de progresso de treinos e alerta multissensorial (cor + ícone + texto) para troca de faixa ou grau.

## 🛠️ Tecnologias Previstas
- **Frontend:** HTML5, CSS3 (Design Responsivo e Acessível WCAG), JavaScript (ES6+)
- **Persistência Local (Offline-First):** IndexedDB / LocalStorage
- **Backend / API:** Python (FastAPI) + PostgreSQL + Autenticação JWT
