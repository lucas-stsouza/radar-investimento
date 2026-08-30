/* ==========================================================================
   ARQUIVADOR DE EDIÇÕES — Radar de Investimentos
   --------------------------------------------------------------------------
   Congela a edição que está no ar antes de você escrever a próxima.

     node ferramentas/arquivar.mjs             → arquiva a edição atual
     node ferramentas/arquivar.mjs --forcar    → regrava, se o dia já existir

   O QUE ELE FAZ
     1. Lê site/js/dados.js e descobre a data da edição (meta.atualizadoEm).
     2. Gera site/historico/AAAA-MM-DD.html — uma cópia da página de hoje,
        AUTOCONTIDA: o CSS, os dados e o script vão embutidos no arquivo.
        Ela não depende de mais nada, então continua abrindo igualzinha
        daqui a anos, mesmo que o site/css/ e o site/js/ mudem.
     3. Acrescenta a edição no topo de site/js/historico.js, com os valores de
        cada ativo. É daí que saem os mini-gráficos dos cards e a variação
        "vs. a edição anterior".

   O nome do arquivo é o dia em que aquela edição esteve no ar.
   ========================================================================== */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "site");
const FORCAR = process.argv.includes("--forcar");

const ler = (...p) => readFileSync(join(RAIZ, ...p), "utf8");

/* ---------- 1. carrega a edição atual ---------- */

const fonteDados = ler("js", "dados.js");
const RADAR = new Function(fonteDados + "; return RADAR;")();

if (!RADAR?.meta?.atualizadoEm) {
  console.error("Erro: js/dados.js sem meta.atualizadoEm. Nada foi arquivado.");
  process.exit(1);
}

const dia = String(RADAR.meta.atualizadoEm).slice(0, 10);      // AAAA-MM-DD
if (!/^\d{4}-\d{2}-\d{2}$/.test(dia)) {
  console.error(`Erro: data "${RADAR.meta.atualizadoEm}" fora do formato AAAA-MM-DDTHH:MM.`);
  process.exit(1);
}

const destino = join(RAIZ, "historico", `${dia}.html`);
if (existsSync(destino) && !FORCAR) {
  console.error(
    `Erro: historico/${dia}.html já existe.\n` +
    "Ou a edição já foi arquivada, ou a data em dados.js não foi atualizada.\n" +
    "Use --forcar se realmente quiser regravar."
  );
  process.exit(1);
}

/* ---------- 2. monta o snapshot autocontido ---------- */

const fonteHist = ler("js", "historico.js");
const HIST = new Function(fonteHist + "; return RADAR_HISTORICO;")();

let html = ler("index.html");
const css = ler("css", "style.css");
const app = ler("js", "app.js");

const dataBonita = (() => {
  const [a, m, d] = dia.split("-");
  return `${d}/${m}/${a}`;
})();

// modo "arquivo": o app.js renderiza normalmente, mas não busca nada ao vivo
html = html.replace('<body data-pagina="radar">', '<body data-pagina="arquivo">');

html = html.replace(
  "<title>Radar de Investimentos</title>",
  `<title>Radar de Investimentos · edição de ${dataBonita}</title>`
);

// nesta pasta os links de navegação sobem um nível
html = html
  .replace(/href="historico\.html"/g, 'href="../historico.html"')
  .replace(/href="index\.html"/g, 'href="../index.html"');

// o buscador não deve indexar a edição velha no lugar da atual
html = html.replace(
  "</title>",
  "</title>\n<meta name=\"robots\" content=\"noindex\">\n" +
  `<link rel="canonical" href="../index.html">`
);

// CSS embutido
html = html.replace(
  '<link rel="stylesheet" href="css/style.css">',
  "<style>\n" + css + "\n</style>"
);

// faixa avisando que é arquivo
html = html.replace(
  '<main id="conteudo">',
  '<main id="conteudo">\n\n' +
  '  <div class="faixa-edicao">\n' +
  '    <div class="container faixa-edicao__linha">\n' +
  `      <span>Esta é a edição arquivada de <strong>${dataBonita}</strong>. ` +
  "Os números são daquele dia e não se atualizam.</span>\n" +
  '      <a href="../index.html">Ir para a edição atual &rarr;</a>\n' +
  "    </div>\n" +
  "  </div>\n"
);

/* Conferência ANTES de embutir os scripts: depois disso o arquivo passa a
   conter o texto do app.js, cheio de href="…" dentro de strings de JS, e a
   varredura de atributos daria falso positivo. */
const pendentesHtml = [...html.matchAll(/(?:src|href)="(?!\.\.\/|#|data:|https?:)([^"]+)"/g)]
  .map((m) => m[1])
  .filter((u) => !u.startsWith("js/"));          // essas somem no passo seguinte
const pendentesCss = [...css.matchAll(/url\(\s*['"]?(?!data:|https?:)([^)'"]+)/g)]
  .map((m) => m[1]);

if (pendentesHtml.length || pendentesCss.length) {
  console.error(
    "Erro: o snapshot dependeria de arquivos externos:",
    [...pendentesHtml, ...pendentesCss]
  );
  process.exit(1);
}

// Dados congelados + script embutido, no lugar das três tags <script src>.
// Levamos junto a edição imediatamente anterior (só ela) para que o snapshot
// preserve o chip "vs. <data>" que a página mostrava quando estava no ar.
const anterior = HIST.length ? [HIST[0]] : [];
const dadosCongelados =
  "const RADAR = " + JSON.stringify(RADAR, null, 1) + ";\n" +
  "const RADAR_HISTORICO = " + JSON.stringify(anterior, null, 1) + ";";

const antesDeEmbutir = html;
html = html.replace(
  /<script src="js\/dados\.js"><\/script>\s*<script src="js\/historico\.js"><\/script>\s*<script src="js\/app\.js"><\/script>/,
  "<script>\n" + dadosCongelados + "\n</script>\n<script>\n" + app + "\n</script>"
);
if (html === antesDeEmbutir) {
  console.error(
    "Erro: não achei as três tags <script src> no index.html.\n" +
    "Se a ordem dos scripts mudou, ajuste a expressão em ferramentas/arquivar.mjs."
  );
  process.exit(1);
}

mkdirSync(join(RAIZ, "historico"), { recursive: true });
writeFileSync(destino, html, "utf8");

/* ---------- 3. registra a edição em js/historico.js ---------- */

if (HIST.some((e) => String(e.atualizadoEm).slice(0, 10) === dia) && !FORCAR) {
  console.log(`historico/${dia}.html gravado. A entrada de ${dia} em js/historico.js já existia.`);
  process.exit(0);
}

const n = (v, casas) => Number(v.toFixed(casas));
const linhas = RADAR.ativos.map((a) => {
  const partes = [`id: "${a.id}"`, `valor: ${a.valor}`];
  if (a.variacao12m != null && isFinite(a.variacao12m)) {
    partes.push(`variacao12m: ${n(a.variacao12m, 2)}`);
  }
  if (a.dy != null && isFinite(a.dy)) partes.push(`dy: ${a.dy}`);
  return "      { " + partes.join(", ") + " }";
});

const bloco =
  "  {\n" +
  `    atualizadoEm: ${JSON.stringify(RADAR.meta.atualizadoEm)},\n` +
  `    responsavel:  ${JSON.stringify(RADAR.meta.responsavel || "")},\n` +
  `    arquivo:      ${JSON.stringify(`historico/${dia}.html`)},\n` +
  `    resumo:       ${JSON.stringify(RADAR.resumo || "")},\n` +
  `    destaques:    ${JSON.stringify(RADAR.destaques || [])},\n` +
  `    agenda:       ${JSON.stringify(RADAR.agenda || [])},\n` +
  "    ativos: [\n" + linhas.join(",\n") + "\n    ]\n" +
  "  },";

const marca = "const RADAR_HISTORICO = [";
const pos = fonteHist.indexOf(marca);
if (pos === -1) {
  console.error("Erro: não achei 'const RADAR_HISTORICO = [' em js/historico.js.");
  console.error(`O snapshot historico/${dia}.html foi gravado; adicione a entrada à mão.`);
  process.exit(1);
}
const corte = pos + marca.length;
const novoHist = fonteHist.slice(0, corte) + "\n\n" + bloco + fonteHist.slice(corte);

// valida antes de gravar: o arquivo tem que continuar sendo JS válido
try {
  const teste = new Function(novoHist + "; return RADAR_HISTORICO;")();
  if (teste.length !== HIST.length + 1) throw new Error("contagem de edições inesperada");
} catch (e) {
  console.error("Erro: o js/historico.js resultante não seria válido:", e.message);
  process.exit(1);
}

writeFileSync(join(RAIZ, "js", "historico.js"), novoHist, "utf8");

const kb = Math.round(Buffer.byteLength(html, "utf8") / 1024);
console.log(`Edicao de ${dataBonita} arquivada.`);
console.log(`  historico/${dia}.html   ${kb} KB, autocontido`);
console.log(`  js/historico.js         ${HIST.length + 1} edicoes registradas`);
console.log(`  ${RADAR.ativos.length} ativos congelados`);
console.log("\nAgora atualize js/dados.js com os numeros da nova semana.");
