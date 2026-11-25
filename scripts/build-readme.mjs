import fs from "node:fs";
import path from "node:path";

const THEME = {
  bg: "#141517",
  accent: "#0084B8",
  secondary: "#9B5B5E",
  text: "#EDE7DC",
  muted: "#A8A29E",
};

const PROFILE = {
  name: "João Marchi",
  role: "Full-Stack Software Developer",
  educationTag: "Computer Science Undergraduate at UFABC",
  linkedinUrl: "https://www.linkedin.com/in/SEU-USUARIO-LINKEDIN",
  email: "SEU-EMAIL@exemplo.com",
};

const MOCK_STATS = {
  title: "CRM & Engineering Activity (Mock)",
  contributionsYear: 240,
  commitsShare: "84%",
  pullRequestsShare: "16%",
  novemberCommits: 39,
  samplePrDelta: "+192 / -22",
};

const MOCK_LANGUAGES = [
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

const MOCK_CRM_SCENARIOS = [
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

function buildStatsSvg(stats, theme) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="190" viewBox="0 0 460 190">
  <rect x="1" y="1" width="458" height="188" rx="8" fill="${theme.bg}" stroke="${theme.secondary}" stroke-width="1.5" />
  <text x="24" y="34" fill="${theme.accent}" font-family="sans-serif" font-size="16" font-weight="700">${stats.title}</text>
  <text x="24" y="68" fill="${theme.text}" font-family="sans-serif" font-size="13">Contribuicoes (12m): ${stats.contributionsYear} (mock)</text>
  <text x="24" y="94" fill="${theme.text}" font-family="sans-serif" font-size="13">Mix: ${stats.commitsShare} Commits | ${stats.pullRequestsShare} Pull Requests</text>
  <text x="24" y="120" fill="${theme.text}" font-family="sans-serif" font-size="13">Commits (Nov / CRM): ${stats.novemberCommits} (mock)</text>
  <text x="24" y="146" fill="${theme.text}" font-family="sans-serif" font-size="13">Exemplo de PR (Pedidos): ${stats.samplePrDelta} linhas (mock)</text>
  <text x="24" y="172" fill="${theme.muted}" font-family="sans-serif" font-size="11">Dados ilustrativos sem exposicao de codigo privado</text>
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
  <text x="24" y="34" fill="${theme.accent}" font-family="sans-serif" font-size="16" font-weight="700">Distribuicao de Stack (Mock)</text>
  <rect x="24" y="54" width="${barWidth}" height="10" rx="5" fill="#26292E" />
  ${barSegments}
  ${legendItems}
  <text x="24" y="172" fill="${theme.muted}" font-family="sans-serif" font-size="11">Valores simulados para demonstracao</text>
</svg>`;
}

function toDataUri(svgString) {
  return `data:image/svg+xml;base64,${Buffer.from(svgString, "utf8").toString("base64")}`;
}

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
    "| Módulo / Fluxo | Situação Mockada | Regra Aplicada (Simulada) | Impacto Operacional (Simulado) |\n" +
    "| :--- | :--- | :--- | :--- |";
  const body = rows
    .map((r) => `| **${r.module}** | ${r.situation} | ${r.rule} | ${r.impact} |`)
    .join("\n");
  return `${header}\n${body}`;
}

const statsUri = toDataUri(buildStatsSvg(MOCK_STATS, THEME));
const langsUri = toDataUri(buildLangsSvg(MOCK_LANGUAGES, THEME));

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

### Cenário Ilustrativo de Atuação (Dados Mockados)

Exemplo sanitizado e fictício baseado em fluxos operacionais de CRM e gestão de pedidos para ilustrar a dinâmica de regras de negócio:

${renderCrmTable(MOCK_CRM_SCENARIOS)}

---

### Métricas no GitHub (Mock)

<div align="center">
  <img height="190em" src="${statsUri}" alt="Métricas mockadas de atividade" />
  <img height="190em" src="${langsUri}" alt="Distribuição mockada de stack" />
</div>
`;

fs.writeFileSync(path.resolve("README.md"), readmeContent, "utf8");
console.log("README.md gerado com SVGs embutidos.");