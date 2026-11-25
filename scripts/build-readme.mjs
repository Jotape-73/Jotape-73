import fs from "node:fs";
import path from "node:path";

// ============================================================================
// CONSTANTES DE COR (extraídas da foto de perfil) — altere aqui para trocar tudo
// ============================================================================
const THEME = {
  bg: "#141517",        // Grafite escuro (borda/sombras do mural)
  accent: "#0084B8",    // Azul petróleo/ciano (detalhes do mural)
  secondary: "#9B5B5E", // Terracota/rosado (fundo do mural)
  text: "#EDE7DC",      // Creme/off-white (camisa)
  muted: "#A8A29E",     // Cinza suave para rótulos secundários
};

// ============================================================================
// DADOS DO PERFIL E MÉTRICAS DE ATIVIDADE
// ============================================================================
const PROFILE = {
  name: "João Marchi",
  role: "Full-Stack Software Developer",
  educationTag: "Computer Science Undergraduate at UFABC",
  linkedinUrl: "https://www.linkedin.com/in/SEU-USUARIO-LINKEDIN",
  email: "SEU-EMAIL@exemplo.com",
};

const ACTIVITY_STATS = {
  title: "CRM and Engineering Activity",
  contributionsYear: 240,
  commitsShare: "84%",
  pullRequestsShare: "16%",
  novemberCommits: 39,
  samplePrDelta: "+192 / -22",
};

const STACK_DISTRIBUTION = [
  { name: "PHP / Laravel", percent: 34, color: THEME.accent },
  { name: "TypeScript / React", percent: 28, color: THEME.secondary },
  { name: "SQL (MySQL / PG)", percent: 18, color: THEME.text },
  { name: "Python", percent: 12, color: "#5C9EAD" },
  { name: "C / C++ / Kotlin", percent: 8, color: "#C2847A" },
];

const STACK = {
  "Back-end & Bancos de Dados": [
    { label: "PHP", logo: "php" },
    { label: "Laravel", logo: "laravel" },
    { label: "Python", logo: "python" },
    { label: "Java", logo: "openjdk" },
    { label: "C", logo: "c" },
    { label: "MySQL", logo: "mysql" },
    { label: "PostgreSQL", logo: "postgresql" },
  ],
  "Front-end & Mobile": [
    { label: "React", logo: "react" },
    { label: "Next.js", logo: "nextdotjs" },
    { label: "TypeScript", logo: "typescript" },
    { label: "JavaScript", logo: "javascript" },
    { label: "HTML5", logo: "html5" },
    { label: "CSS3", logo: "css3" },
    { label: "Material-UI", logo: "mui" },
    { label: "Kotlin", logo: "kotlin" },
  ],
  "Infraestrutura, Ferramentas & Hardware": [
    { label: "Docker", logo: "docker" },
    { label: "Nginx", logo: "nginx" },
    { label: "Git", logo: "git" },
    { label: "GitHub", logo: "github" },
    { label: "C++", logo: "cplusplus" },
    { label: "Arduino", logo: "arduino" },
  ],
};

const CRM_SCENARIOS = [
  {
    module: "Aprovação de Pedidos",
    situation:
      "Itens de conectividade (Simcard, Simcard Isca, Flex e Substituição) permaneciam em Pendente após aprovação do cliente",
    rule: "Transição automática do status de itens elegíveis para Em Separação no evento de aprovação",
    impact: "Redução de etapas manuais e menor tempo até a separação logística",
  },
  {
    module: "Rastreabilidade de Status",
    situation: "Alterações manuais tardias dificultavam auditoria do ciclo do pedido",
    rule: "Registro padronizado de eventos e validação de estados permitidos por tipo de item",
    impact: "Maior previsibilidade do fluxo e redução de inconsistências operacionais",
  },
  {
    module: "Qualidade & Regressão",
    situation: "Necessidade de garantir que novos fluxos não quebrassem rotinas existentes",
    rule: "Cenários de teste cobrindo aprovação, exceções de itens e permissões multi-tenant",
    impact: "Entregas mais estáveis com menor incidência de retrabalho em produção",
  },
];

// ============================================================================
// GERADORES DE SVG
// ============================================================================
function buildStatsSvg(stats, theme) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="190" viewBox="0 0 460 190">
  <rect x="1" y="1" width="458" height="188" rx="8" fill="${theme.bg}" stroke="${theme.secondary}" stroke-width="1.5" />
  <text x="24" y="34" fill="${theme.accent}" font-family="sans-serif" font-size="16" font-weight="700">${stats.title}</text>
  <text x="24" y="68" fill="${theme.text}" font-family="sans-serif" font-size="13">Contribuicoes (12m): ${stats.contributionsYear}</text>
  <text x="24" y="94" fill="${theme.text}" font-family="sans-serif" font-size="13">Commits: ${stats.commitsShare} / Pull Requests: ${stats.pullRequestsShare}</text>
  <text x="24" y="120" fill="${theme.text}" font-family="sans-serif" font-size="13">Novembro (CRM): ${stats.novemberCommits} commits</text>
  <text x="24" y="146" fill="${theme.text}" font-family="sans-serif" font-size="13">PR exemplo (Pedidos): ${stats.samplePrDelta} linhas</text>
  <text x="24" y="172" fill="${theme.muted}" font-family="sans-serif" font-size="11">Resumo de fluxo e engenharia em CRM</text>
</svg>`;
}

function buildLangsSvg(langs, theme) {
  const barWidth = 372;
  let currentX = 24;
  const barSegments = langs
    .map((item) => {
      const segW = Math.round((item.percent / 100) * barWidth);
      const rect = `<rect x="${currentX}" y="54" width="${segW}" height="10" fill="${item.color}" />`;
      currentX += segW;
      return rect;
    })
    .join("\n  ");

  const legendItems = langs
    .map((item, idx) => {
      const col = idx % 2 === 0 ? 24 : 230;
      const row = Math.floor(idx / 2) * 22 + 88;
      return `<circle cx="${col + 5}" cy="${row - 4}" r="5" fill="${item.color}" />
  <text x="${col + 16}" y="${row}" fill="${theme.text}" font-family="sans-serif" font-size="12">${item.name} - ${item.percent}%</text>`;
    })
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="190" viewBox="0 0 420 190">
  <rect x="1" y="1" width="418" height="188" rx="8" fill="${theme.bg}" stroke="${theme.secondary}" stroke-width="1.5" />
  <text x="24" y="34" fill="${theme.accent}" font-family="sans-serif" font-size="16" font-weight="700">Distribuicao de Stack</text>
  <rect x="24" y="54" width="${barWidth}" height="10" rx="5" fill="#26292E" />
  ${barSegments}
  ${legendItems}
  <text x="24" y="172" fill="${theme.muted}" font-family="sans-serif" font-size="11">Foco tecnico em aplicacoes web e sistemas</text>
</svg>`;
}

// ============================================================================
// FUNÇÕES AUXILIARES DO MARKDOWN
// ============================================================================
function cleanHex(hex) {
  return hex.replace(/^#/, "");
}

function badge(label, logo, bgHex = THEME.bg, logoHex = THEME.accent) {
  const encodedLabel = encodeURIComponent(label);
  return `<img src="https://img.shields.io/badge/${encodedLabel}-${cleanHex(bgHex)}?style=for-the-badge&logo=${logo}&logoColor=${cleanHex(logoHex)}" alt="${label}" />`;
}

function renderStackSections(stackObj) {
  return Object.entries(stackObj)
    .map(([category, items]) => {
      const badges = items.map((item) => badge(item.label, item.logo)).join("\n  ");
      return `**${category}**\n<p>\n  ${badges}\n</p>`;
    })
    .join("\n\n");
}

function renderCrmTable(rows) {
  const header =
    "| Módulo / Fluxo | Contexto | Regra Aplicada | Impacto Operacional |\n" +
    "| :--- | :--- | :--- | :--- |";
  const body = rows
    .map((r) => `| **${r.module}** | ${r.situation} | ${r.rule} | ${r.impact} |`)
    .join("\n");
  return `${header}\n${body}`;
}

// ============================================================================
// EXECUÇÃO E GERAÇÃO DE ARQUIVOS
// ============================================================================
const assetsDir = path.resolve("assets");
fs.mkdirSync(assetsDir, { recursive: true });
fs.writeFileSync(path.join(assetsDir, "stats-mock.svg"), buildStatsSvg(ACTIVITY_STATS, THEME), "utf8");
fs.writeFileSync(path.join(assetsDir, "langs-mock.svg"), buildLangsSvg(STACK_DISTRIBUTION, THEME), "utf8");

const readmeContent = `<div align="center">
  <h1>${PROFILE.name}</h1>
  <p>
    <strong>${PROFILE.role}</strong> | ${PROFILE.educationTag.replace("UFABC", "<strong>UFABC</strong>")}
  </p>
  
  <p>
    <a href="${PROFILE.linkedinUrl}" target="_blank">
      ${badge("LinkedIn", "linkedin", THEME.bg, THEME.accent)}
    </a>
    <a href="mailto:${PROFILE.email}">
      ${badge("Email", "gmail", THEME.secondary, THEME.text)}
    </a>
  </p>
</div>

---

### Perfil Profissional

Desenvolvedor Full-Stack com atuação como **Assistente de Desenvolvimento** na **Allcom Telecom**, focado no desenvolvimento, teste e manutenção de plataformas CRM multi-tenant e aplicações web. Graduando em **Ciência da Computação** no bacharelado interdisciplinar de **Ciência e Tecnologia (BC&T)** pela **Universidade Federal do ABC (UFABC)** e técnico em **Desenvolvimento de Sistemas** pela **ETEC**.

* **Desenvolvimento Web & Sistemas Multi-Tenant:** Implementação de regras de negócio, fluxos de pedidos e conectividade, integração de APIs e manutenção contínua em produção.
* **Qualidade de Software (QA) & Engenharia:** Validação de transições de status, prevenção de gargalos operacionais, testes de regressão e revisão de código.
* **Arquitetura, Dados & Infraestrutura:** Modelagem relacional, consultas SQL, conteinerização de ambientes e configuração de servidores web.
* **Pesquisa, Mobile & Sistemas Embarcados:** Projetos acadêmicos e experimentais em Processamento de Linguagem Natural (NLP), aplicações Android nativas e integração de hardware com microcontroladores.

---

### Trajetória & Formação

* **Allcom Telecom** — *Assistente de Desenvolvimento* (transição a partir de estágio em QA e desenvolvimento full-stack): Desenvolvimento, testes e manutenção de aplicações web e soluções CRM multi-tenant.
* **Universidade Federal do ABC (UFABC)** — *Bacharelado em Ciência e Tecnologia (BC&T) / Ciência da Computação*: Formação acadêmica em fundamentos da computação, algoritmos, estruturas de dados, matemática e engenharia de software.
* **ETEC** — *Técnico em Desenvolvimento de Sistemas*: Formação técnica em lógica de programação, desenvolvimento web, bancos de dados e ciclo de vida de software.

---

### Stack Tecnológica

${renderStackSections(STACK)}

---

### Fluxos & Regras de Negócio (CRM)

Visão de regras operacionais e fluxos de gestão de pedidos e conectividade:

${renderCrmTable(CRM_SCENARIOS)}

---

### Métricas no GitHub

<div align="center">
  <img src="./assets/stats-mock.svg?v=5" height="190" alt="Metricas de atividade" />
  <img src="./assets/langs-mock.svg?v=5" height="190" alt="Distribuicao de stack" />
</div>
`;

fs.writeFileSync(path.resolve("README.md"), readmeContent, "utf8");
console.log("Arquivos gerados: README.md, assets/stats-mock.svg e assets/langs-mock.svg");