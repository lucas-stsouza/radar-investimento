/* ==========================================================================
   COLETOR DE DADOS REAIS — Radar de Investimentos
   --------------------------------------------------------------------------
   Busca o valor de mercado de TODOS os ativos do site/js/dados.js em fontes públicas
   e, opcionalmente, grava os números direto no arquivo.

     node ferramentas/coletar.mjs              → só mostra o relatório
     node ferramentas/coletar.mjs --escrever   → grava em site/js/dados.js

   FONTES
     Yahoo Finance   índices, ações, BDRs, FIIs, ETFs e commodities
                     (chart API; o dividend yield sai da soma dos proventos
                      dos últimos 12 meses dividida pelo preço de hoje)
     Banco Central   Selic, CDI, IPCA e IGP-M (séries SGS)
     AwesomeAPI      dólar, euro e criptomoedas

   REGRA DE OURO
     O que não for confirmado NÃO é escrito. O ativo mantém o valor anterior
     e aparece na lista de falhas no fim do relatório, para você decidir o
     que fazer. Nenhum número é estimado, arredondado por conta própria ou
     inventado.
   ========================================================================== */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "site");
const ARQUIVO_DADOS = join(RAIZ, "js", "dados.js");
const ESCREVER = process.argv.includes("--escrever");

const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
};

/* --------------------------------------------------------------------------
   MAPA: id do ativo no dados.js  →  onde buscar
   Para acrescentar um ativo novo, basta uma linha aqui.
     y   Yahoo Finance (ações .SA para B3, ^ para índices, =F para futuros)
     sgs código da série do Banco Central
     m   código da moeda/cripto na AwesomeAPI (o par vira XXX-BRL)
     pp  true = é uma taxa; a variação sai em pontos percentuais, não em %
   -------------------------------------------------------------------------- */
const MAPA = {
  // Brasil — índices
  ibovespa: { y: "^BVSP" },
  ifix:     { y: "IFIX.SA" },
  smll:     { y: "SMLL.SA" },
  idiv:     { y: "IDIV.SA" },

  // Brasil — macro (Banco Central)
  selic:    { sgs: 432,   dias: 400,  pp: true },
  cdi:      { sgs: 4389,  dias: 400,  pp: true },
  ipca12:   { sgs: 13522, dias: 800,  pp: true },
  ipcaMes:  { sgs: 433,   dias: 800,  pp: true },
  igpm:     { sgs: 189,   dias: 1200, pp: true, acumular12: true },

  // Câmbio
  usdbrl:   { m: "USD" },
  eurbrl:   { m: "EUR" },

  // Criptomoedas
  btcbrl:   { m: "BTC" },
  ethbrl:   { m: "ETH" },
  bnbbrl:   { m: "BNB" },
  solbrl:   { m: "SOL" },
  xrpbrl:   { m: "XRP" },
  dogebrl:  { m: "DOGE" },
  ltcbrl:   { m: "LTC" },

  // Fundos imobiliários
  plag11:   { y: "PLAG11.SA" },
  mcci11:   { y: "MCCI11.SA" },
  kncr11:   { y: "KNCR11.SA" },
  cpts11:   { y: "CPTS11.SA" },
  brco11:   { y: "BRCO11.SA" },
  xpml11:   { y: "XPML11.SA" },
  mxrf11:   { y: "MXRF11.SA" },
  visc11:   { y: "VISC11.SA" },
  gare11:   { y: "GARE11.SA" },
  xplg11:   { y: "XPLG11.SA" },
  rbrr11:   { y: "RBRR11.SA" },

  // Ações brasileiras
  vale3:    { y: "VALE3.SA" },
  itsa4:    { y: "ITSA4.SA" },
  bbse3:    { y: "BBSE3.SA" },
  cmin3:    { y: "CMIN3.SA" },
  cmig3:    { y: "CMIG3.SA" },
  amzo34:   { y: "AMZO34.SA" },
  bbas3:    { y: "BBAS3.SA" },
  viva3:    { y: "VIVA3.SA" },

  // Internacional — índices
  sp500:    { y: "^GSPC" },
  nasdaq:   { y: "^IXIC" },
  dowjones: { y: "^DJI" },
  vix:      { y: "^VIX" },

  // Internacional — ETFs
  voo:      { y: "VOO" },
  pph:      { y: "PPH" },

  // Internacional — ações
  nvda:     { y: "NVDA" },
  googl:    { y: "GOOGL" },
  tsla:     { y: "TSLA" },
  aapl:     { y: "AAPL" },
  amzn:     { y: "AMZN" },
  ko:       { y: "KO" },
  crwd:     { y: "CRWD" },
  nke:      { y: "NKE" },
  msft:     { y: "MSFT" },

  // Commodities
  brent:    { y: "BZ=F" },
  ouro:     { y: "GC=F" },
  minerio:  { y: "TIO=F" }
};

/* ====================== utilidades ====================== */

async function pegarJson(url, tentativas = 3) {
  let ultimoErro;
  for (let i = 0; i < tentativas; i++) {
    try {
      const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.json();
    } catch (e) {
      ultimoErro = e;
      await new Promise((r) => setTimeout(r, 700 * (i + 1)));
    }
  }
  throw ultimoErro;
}

const arred = (v, c) => Number(v.toFixed(c));

/** Variação percentual — ou em pontos percentuais, se for taxa. */
function variacao(atual, anterior, pp) {
  if (anterior == null || !isFinite(anterior)) return null;
  if (pp) return arred(atual - anterior, 2);
  if (anterior === 0) return null;
  return arred((atual / anterior - 1) * 100, 2);
}

/** Valor de ~365 dias atrás; aceita a ponta mais antiga se a série for curta. */
function valorHaUmAno(pontos) {
  const ult = pontos[pontos.length - 1];
  const limite = ult.t - 365 * 86400;
  for (let i = pontos.length - 1; i >= 0; i--) {
    if (pontos[i].t <= limite) return pontos[i].v;
  }
  const span = (ult.t - pontos[0].t) / 86400;
  return span >= 300 ? pontos[0].v : null;   // menos que isso não é "12 meses"
}

/* ====================== fontes ====================== */

async function doYahoo(ticker, querDy) {
  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/" +
    encodeURIComponent(ticker) + "?range=1y&interval=1d&events=div";
  const j = await pegarJson(url);
  const res = j?.chart?.result?.[0];
  if (!res?.meta?.regularMarketPrice) throw new Error("resposta sem preço");

  const preco = res.meta.regularMarketPrice;
  const ts = res.timestamp || [];
  const fech = res.indicators?.quote?.[0]?.close || [];
  const pontos = ts
    .map((t, i) => ({ t, v: fech[i] }))
    .filter((p) => p.v != null && isFinite(p.v));

  // Alguns índices da B3 (IFIX, SMLL, IDIV) têm cotação no Yahoo mas não têm
  // série histórica. Nesse caso gravamos o valor real e deixamos a variação
  // de 12 meses vazia — ela nunca é estimada.
  const saida = {
    valor: preco,
    variacao12m: pontos.length >= 2 ? variacao(preco, valorHaUmAno(pontos), false) : null,
    parcial: pontos.length < 2 ? "sem serie historica: variacao de 12m nao calculada" : null,
    fonte: "Yahoo Finance · " + ticker,
    nome: res.meta.longName || res.meta.shortName || ticker
  };

  if (querDy) {
    const divs = Object.values(res.events?.dividends || {});
    const corte = Math.floor(Date.now() / 1000) - 365 * 86400;
    const soma = divs
      .filter((d) => d.date >= corte)
      .reduce((a, d) => a + d.amount, 0);
    saida.dy = arred((soma / preco) * 100, 2);
  }
  return saida;
}

async function doBcb(codigo, dias, pp, acumular12) {
  const fim = new Date();
  const ini = new Date(fim.getTime() - dias * 86400000);
  const br = (d) =>
    String(d.getDate()).padStart(2, "0") + "/" +
    String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();

  const lista = await pegarJson(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigo}/dados?formato=json` +
    `&dataInicial=${br(ini)}&dataFinal=${br(fim)}`
  );

  let pontos = lista
    .map((d) => {
      const [dd, mm, aa] = String(d.data).split("/");
      return {
        t: Date.UTC(+aa, +mm - 1, +dd) / 1000,
        v: parseFloat(String(d.valor).replace(",", "."))
      };
    })
    .filter((p) => isFinite(p.v))
    .sort((a, b) => a.t - b.t);

  if (!pontos.length) throw new Error("série vazia");

  // IGP-M: a série é mensal; compomos 12 meses para achar o acumulado
  if (acumular12) {
    if (pontos.length < 13) throw new Error("meses insuficientes para acumular 12m");
    const acc = [];
    for (let f = 11; f < pontos.length; f++) {
      let fator = 1;
      for (let i = f - 11; i <= f; i++) fator *= 1 + pontos[i].v / 100;
      acc.push({ t: pontos[f].t, v: (fator - 1) * 100 });
    }
    pontos = acc;
  }

  const ult = pontos[pontos.length - 1];
  return {
    valor: arred(ult.v, 2),
    variacao12m: variacao(ult.v, valorHaUmAno(pontos), pp),
    fonte: "Banco Central · SGS " + codigo
  };
}

async function doAwesome(codigo) {
  const lista = await pegarJson(
    `https://economia.awesomeapi.com.br/json/daily/${codigo}-BRL/400`
  );
  const pontos = lista
    .map((d) => ({ t: parseInt(d.timestamp, 10), v: parseFloat(d.bid) }))
    .filter((p) => isFinite(p.v))
    .sort((a, b) => a.t - b.t);
  if (pontos.length < 2) throw new Error("série muito curta");

  const ult = pontos[pontos.length - 1];
  return {
    valor: ult.v,
    variacao12m: variacao(ult.v, valorHaUmAno(pontos), false),
    fonte: "AwesomeAPI · " + codigo + "-BRL"
  };
}

/* ====================== leitura do dados.js ====================== */

/** Recorta o trecho do arquivo que descreve um ativo. */
function blocoDoAtivo(texto, id) {
  const inicio = texto.indexOf(`id: "${id}"`);
  if (inicio === -1) return null;
  const proximo = texto.indexOf('id: "', inicio + 5);
  const fim = proximo === -1 ? texto.length : proximo;
  return { inicio, fim };
}

/** Quantas casas decimais aquele ativo usa, para não estragar a formatação. */
function casasDe(bloco, valor) {
  const m = bloco.match(/casas:\s*(\d+)/);
  if (m) return +m[1];                    // o próprio ativo declara quantas quer
  return Math.abs(valor) < 1 ? 4 : 2;     // valores minúsculos precisam de mais
}

/* ====================== execução ====================== */

const original = readFileSync(ARQUIVO_DADOS, "utf8");
const ids = Object.keys(MAPA);

console.log(`Coletando ${ids.length} ativos…\n`);

const resultados = [];
const falhas = [];

// em lotes, para não abrir 55 conexões de uma vez
const LOTE = 8;
for (let i = 0; i < ids.length; i += LOTE) {
  await Promise.all(
    ids.slice(i, i + LOTE).map(async (id) => {
      const cfg = MAPA[id];
      const bloco = blocoDoAtivo(original, id);
      if (!bloco) {
        falhas.push({ id, erro: "id não encontrado no dados.js" });
        return;
      }
      const trecho = original.slice(bloco.inicio, bloco.fim);
      const temDy = /\bdy:\s*[\d.]/.test(trecho);

      try {
        let r;
        if (cfg.y) r = await doYahoo(cfg.y, temDy);
        else if (cfg.sgs) r = await doBcb(cfg.sgs, cfg.dias, cfg.pp, cfg.acumular12);
        else if (cfg.m) r = await doAwesome(cfg.m);
        else throw new Error("sem fonte configurada");

        if (!isFinite(r.valor)) throw new Error("valor inválido");
        resultados.push({ id, temDy, ...r });
      } catch (e) {
        falhas.push({ id, erro: e.message });
      }
    })
  );
}

resultados.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

console.log(
  "ATIVO".padEnd(11) + "VALOR".padStart(14) + "  12M".padStart(11) +
  "     DY".padStart(9) + "   FONTE"
);
console.log("─".repeat(86));
for (const r of resultados) {
  console.log(
    r.id.padEnd(11) +
    r.valor.toLocaleString("pt-BR", { maximumFractionDigits: 4 }).padStart(14) +
    (r.variacao12m == null ? "—" : (r.variacao12m > 0 ? "+" : "") + r.variacao12m + "%").padStart(11) +
    (r.dy == null ? "" : r.dy + "%").padStart(9) +
    "   " + r.fonte
  );
}

const parciais = resultados.filter((r) => r.parcial);
if (parciais.length) {
  console.log("\n·  PARCIAIS — valor real gravado, faltou só a variação:");
  for (const r of parciais) console.log("   " + r.id.padEnd(12) + r.parcial);
}
if (falhas.length) {
  console.log("\n!  NÃO CONFIRMADOS — mantêm o valor anterior, confira à mão:");
  for (const f of falhas) console.log("   " + f.id.padEnd(12) + f.erro);
} else {
  console.log("\nOK — os " + resultados.length + " ativos foram confirmados na fonte.");
}

if (!ESCREVER) {
  console.log("\n(nada foi gravado — rode com --escrever para atualizar js/dados.js)");
  process.exit(falhas.length ? 1 : 0);
}

/* ---------- gravação cirúrgica: só as linhas de valor ---------- */
let texto = original;
let gravados = 0;

for (const r of resultados) {
  const bloco = blocoDoAtivo(texto, r.id);
  if (!bloco) continue;
  const trecho = texto.slice(bloco.inicio, bloco.fim);

  const linha = trecho.match(/^([ \t]*)valor:.*$/m);
  if (!linha) { falhas.push({ id: r.id, erro: "linha 'valor:' não encontrada" }); continue; }

  const partes = [`valor: ${arred(r.valor, casasDe(trecho, r.valor))}`];
  if (r.variacao12m != null) partes.push(`variacao12m: ${r.variacao12m}`);
  else partes.push("variacao12m: null");
  if (r.temDy && r.dy != null) partes.push(`dy: ${r.dy}`);

  let novo = trecho.replace(/^[ \t]*valor:.*$/m, `${linha[1]}${partes.join(", ")},`);
  // o número agora é real: o selo de exemplo não se aplica mais
  novo = novo.replace(/\s*exemplo:\s*true,?/g, "");

  texto = texto.slice(0, bloco.inicio) + novo + texto.slice(bloco.fim);
  gravados++;
}

// carimba a data/hora da coleta
const agora = new Date();
const iso =
  agora.getFullYear() + "-" +
  String(agora.getMonth() + 1).padStart(2, "0") + "-" +
  String(agora.getDate()).padStart(2, "0") + "T" +
  String(agora.getHours()).padStart(2, "0") + ":" +
  String(agora.getMinutes()).padStart(2, "0");
texto = texto.replace(/atualizadoEm:\s*"[^"]*"/, `atualizadoEm: "${iso}"`);

writeFileSync(ARQUIVO_DADOS, texto, "utf8");
console.log(`\n✓ js/dados.js atualizado: ${gravados} ativos, carimbado em ${iso}`);
if (falhas.length) console.log(`⚠  ${falhas.length} ativo(s) ficaram com o valor anterior.`);
