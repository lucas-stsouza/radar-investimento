---
name: atualizar-radar
description: Fecha a edição da semana do Radar de Investimentos — arquiva a página que está no ar como historico/AAAA-MM-DD.html, coleta os números reais de mercado, reescreve o texto da semana e atualiza a página inicial. Use quando pedirem para atualizar o radar, fechar/publicar a edição da semana, ou ao invocar /atualizar-radar.
---

# Atualizar o Radar de Investimentos

Fecha a edição da semana. A edição que está no ar vira um arquivo congelado
com o nome do dia, o `index.html` passa a mostrar os números de agora, e a
página de histórico ganha mais uma entrada.

**Onde rodar:** todos os comandos partem da raiz do projeto,
`C:\Users\ssouz\OneDrive\Área de Trabalho\G.I - UFU\Investimentos`.
O site fica em `site/`.

---

## A regra que não se quebra

**Nenhum número entra no site sem estar confirmado na fonte, agora.**

- Números vêm **só** do `ferramentas/coletar.mjs`. Nunca digite uma cotação
  de memória, nunca estime, nunca "arredonde para um valor plausível".
- Se a coleta não confirmar um ativo, ele **mantém o valor da semana passada**
  e aparece no relatório. Não invente o que faltou: ou busque em fonte
  primária e confirme, ou marque o ativo com `exemplo: true` no `dados.js`
  (a tarja amarela do topo passa a listá-lo) e avise o usuário no fim.
- O texto da semana (resumo, destaques) descreve **o que os números coletados
  mostram** e fatos apurados. Não atribua causa que você não verificou.
- Você é um modelo de linguagem: seu conhecimento tem data de corte e o
  mercado muda todo dia. Trate qualquer número que venha da sua memória como
  errado até que a coleta prove o contrário.

O site carrega o selo "Feito com IA" no cabeçalho justamente porque essa regra
é o que sustenta a credibilidade dele. Não afrouxe.

---

## Passo 1 — Descubra a data de hoje

Não confie na sua noção de data. Rode:

```bash
node -e "const d=new Date();console.log(d.toLocaleString('pt-BR',{dateStyle:'full',timeStyle:'short'}))"
```

Anote o dia. Ele vai virar o nome do arquivo de histórico.

## Passo 2 — Veja o que está no ar

```bash
node -e "const s=require('fs').readFileSync('site/js/dados.js','utf8');const R=new Function(s+';return RADAR').call();console.log('edicao no ar:',R.meta.atualizadoEm,'|',R.ativos.length,'ativos')"
```

- Se a data já for **de hoje**, a edição de hoje já foi fechada. Pergunte ao
  usuário se ele quer refazer antes de continuar.
- Se `historico/` já tiver o arquivo do dia da edição no ar, ela já foi
  arquivada; pule o passo 3.

## Passo 3 — Arquive a edição que está no ar

```bash
node ferramentas/arquivar.mjs
```

O que acontece:

- gera `site/historico/AAAA-MM-DD.html` — cópia **autocontida**
  da página (CSS, dados e script embutidos, zero dependência externa), com o
  nome do dia em que aquela edição esteve no ar;
- acrescenta a edição no topo de `js/historico.js`, com o valor de cada ativo.
  É daí que saem os mini-gráficos dos cards e o chip "vs. <data>".

Se ele reclamar que o arquivo do dia já existe, **não use `--forcar` por
conta própria** — isso quase sempre significa que a data em `dados.js` não foi
atualizada na semana passada. Investigue e conte ao usuário.

## Passo 4 — Colete os números reais

Primeiro sem gravar, para ver o que vem:

```bash
node ferramentas/coletar.mjs
```

Leia o relatório inteiro. Ele fecha com três blocos possíveis:

| Bloco | Significado | O que fazer |
|---|---|---|
| `OK — os N ativos foram confirmados` | tudo certo | seguir |
| `PARCIAIS` | valor real veio, mas sem série para calcular os 12 meses | normal em IFIX, SMLL e IDIV; seguir |
| `NÃO CONFIRMADOS` | a fonte falhou | ver abaixo |

Se houver não confirmados, tente de novo (pode ser instabilidade). Persistindo,
busque o ativo em fonte primária, confirme o número e edite o `dados.js` à mão
— ou deixe o valor antigo e marque `exemplo: true`. Nunca chute.

Confirmado o relatório, grave:

```bash
node ferramentas/coletar.mjs --escrever
```

Isso reescreve `valor`, `variacao12m`, `dy` e carimba `meta.atualizadoEm` com
a data e hora de agora. **Não edite esses campos à mão depois.**

## Passo 5 — Escreva o texto da semana

Essa é a única parte que não dá para automatizar, e é o que dá valor à
edição. Edite `site/js/dados.js`:

### `meta.responsavel`
Quem está fechando a edição. Pergunte se não souber.

### `resumo` — um parágrafo, 3 a 5 linhas
A abertura da página. Escreva **a partir dos números que você acabou de
coletar**: quem subiu, quem caiu, o que destoou. Compare com a edição anterior
(está em `js/historico.js`) para falar de movimento, não só de nível.

Só cite causa (decisão do Copom, dado de inflação, balanço, notícia) se você
confirmou com busca. Sem confirmação, descreva o movimento e pare por aí.

### `destaques` — 3 a 5 cartões
Cada um com `titulo` (2 a 4 palavras), `texto` (uma frase) e `tom`
(`positivo` / `neutro` / `negativo`). Escolha os movimentos que mais
importam para quem abre o site uma vez por semana. Evite repetir o resumo.

### `agenda` — o que sai nos próximos dias
Confirme cada evento nos calendários oficiais antes de listar. Nunca liste
um evento "de memória" — datas de divulgação mudam.

| Fonte | Onde conferir |
|---|---|
| IBGE (IPCA, IPCA-15, PIB) | https://www.ibge.gov.br/calendario-divulgacoes-novoportal.html |
| Banco Central (estatísticas) | https://www.bcb.gov.br/estatisticas/calendarioestatisticas |
| Copom | https://www.bcb.gov.br/controleinflacao/copom |
| FGV IBRE (IGP-M) | https://portalibre.fgv.br/igp |
| Federal Reserve | https://www.federalreserve.gov/newsevents/calendar.htm |
| BLS (CPI, payroll) | https://www.bls.gov/schedule/news_release/ |
| US Dept. of Labor (jobless) | https://oui.doleta.gov/unemploy/claims.asp |
| BEA (PCE) | https://www.bea.gov/data/personal-consumption-expenditures-price-index |
| S&P Global (PMI) | https://www.pmi.spglobal.com/ |

Cada item precisa de `data`, `hora`, `pais` (`BR`/`EUA`/`GLB`), `evento`,
`relevancia` (`alta`/`media`), `fonte` e `link`. O `link` tem que ser a página
**oficial de quem divulga** — nada de agregador, portal de notícia ou blog.
Só `http://` ou `https://`; o site ignora qualquer outra coisa.

Melhor uma agenda curta e certa do que longa e chutada.

## Passo 6 — Verifique antes de dar por pronto

```bash
node --check site/js/dados.js
node --check site/js/historico.js
```

Suba o preview (entrada `radar` do `.claude/launch.json`) e confira **no
navegador**, sem confiar só no código:

- [ ] a data no cabeçalho é a de hoje;
- [ ] o resumo novo aparece no Panorama;
- [ ] os cards mostram os valores coletados, e os de câmbio, cripto e juros
      trocam para o selo `ao vivo` depois de 2 a 3 segundos;
- [ ] os cards ganharam o chip `vs. <data da edição anterior>`;
- [ ] a tarja amarela só aparece se sobrou algum `exemplo: true`, e lista
      exatamente esses;
- [ ] o botão **Histórico** mostra o contador certo de edições;
- [ ] em `historico.html`, a edição arquivada aparece na linha do tempo e o
      botão "Abrir a página daquele dia" carrega o snapshot;
- [ ] o snapshot abre com a faixa de arquivo e **não** faz nenhuma requisição
      de rede;
- [ ] o selo "Feito com IA" continua no cabeçalho das duas páginas;
- [ ] nada estoura a largura em 375px e em 1400px.

O navegador guarda cache dos `.js`. Se a página parecer velha, force com
`fetch('js/dados.js',{cache:'reload'})` no console e recarregue.

## Passo 7 — Feche

Mostre ao usuário um resumo curto:

- data da nova edição e qual arquivo de histórico foi criado;
- quantos ativos foram confirmados, e **quais não foram** (se houver);
- os três ou quatro movimentos mais relevantes da semana;
- qualquer coisa que ficou pendente de decisão dele.

Depois faça o commit:

```bash
git add -A
```

Mensagem no formato `Edição de DD/MM/AAAA`, com uma linha por destaque.

**Pare antes do push e pergunte.** O repositório é público
(https://github.com/lucas-stsouza/radar-investimento) e publicar é decisão do
usuário. Se ele já tiver dito na mesma conversa que é para publicar, pode
seguir direto.

---

## Mapa rápido do projeto

```
Investimentos/
├── .claude/
│   ├── launch.json                    preview local na porta 5599
│   └── skills/atualizar-radar/        este arquivo
├── ferramentas/
│   ├── coletar.mjs                    busca os 55 ativos nas fontes
│   └── arquivar.mjs                   congela a edição no ar
└── site/                              ← o que vai para o bucket
    ├── index.html                     a edição da semana
    ├── historico.html                 linha do tempo das edições
    ├── historico/AAAA-MM-DD.html      snapshots congelados e autocontidos
    ├── css/style.css                  visual das duas páginas
    ├── js/dados.js                    a edição atual  ← muda toda semana
    ├── js/historico.js                as edições anteriores
    └── js/app.js                      motor (3 modos: radar/historico/arquivo)
```

**De onde vem cada número** (tudo já mapeado em `coletar.mjs`):

| Grupo | Fonte |
|---|---|
| Ibovespa, IFIX, SMLL, IDIV, índices EUA, ações BR e EUA, BDRs, FIIs, ETFs, commodities | Yahoo Finance (chart API) |
| Selic, CDI, IPCA mês e 12m, IGP-M 12m | Banco Central, séries SGS |
| Dólar, euro e as 7 criptomoedas | AwesomeAPI |
| Dividend yield | soma dos proventos de 12 meses ÷ preço atual |

Para incluir um ativo novo: adicione o bloco em `site/js/dados.js` e uma linha no
`MAPA` do `coletar.mjs`. O card aparece sozinho nas duas páginas.

## Se algo der errado

| Sintoma | Causa provável |
|---|---|
| `arquivar.mjs` diz que o arquivo do dia já existe | a data em `dados.js` não foi atualizada na semana passada |
| muitos ativos em NÃO CONFIRMADOS | rede fora, ou o Yahoo bloqueando; espere e repita |
| um FII/ação some da coleta | o ticker mudou na B3; ajuste o `MAPA` do `coletar.mjs` |
| a página abre sem dado ao vivo | foi aberta por `file://`; use o preview |
| o snapshot ficou dependendo de arquivo externo | o `arquivar.mjs` aborta sozinho e explica qual |
