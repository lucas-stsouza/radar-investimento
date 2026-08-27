# Radar de Investimentos

Site estático com o panorama semanal do mercado financeiro nacional e
internacional. Feito para quem entra toda semana e quer bater o olho: a
estrutura nunca muda de lugar, só os números.

```
radar-investimentos/
├── index.html          o radar da semana
├── historico.html      as edições anteriores (página separada)
├── css/style.css       visual das duas páginas (tema claro/escuro)
└── js/
    ├── dados.js        ← a edição da semana. É o que você edita.
    ├── historico.js    ← as edições anteriores, uma embaixo da outra
    └── app.js          motor das duas páginas
```

São **duas páginas**. O radar mostra só a semana atual e nada mais — quem abre
uma vez por semana vê o que mudou e vai embora. O arquivo das semanas passadas
fica em `historico.html`, a um clique no botão **Histórico** do topo.

Sem build, sem dependências, sem npm. É só abrir.

---

## Como rodar

**Não abra o `index.html` com dois cliques.** Pelo protocolo `file://` o
navegador bloqueia as chamadas às APIs e você perde os dados ao vivo (o site
ainda funciona, mas só com os valores do `dados.js`).

Suba um servidor local na pasta:

```bash
python -m http.server 5599 --directory radar-investimentos
```

E abra <http://localhost:5599>.

Para publicar, qualquer hospedagem de site estático serve — GitHub Pages,
Netlify, Vercel, Cloudflare Pages. É só jogar a pasta lá.

---

## A estrutura da página

Sempre nesta ordem, para o leitor criar memória muscular:

| Seção | O que tem |
|---|---|
| **Panorama** | Resumo da semana em um parágrafo e os 6 números mais importantes em cards grandes |
| **Radar da semana** | 3 a 5 cartões curtos: o que moveu o mercado, com tarja verde/amarela/vermelha |
| **Brasil** | Índices da B3 · juros e inflação · câmbio · fundos imobiliários · ações brasileiras |
| **Criptomoedas** | Bitcoin, Ethereum, BNB, Solana, XRP, Dogecoin e Litecoin, em reais |
| **Internacional** | Índices americanos · ETFs · ações |
| **Commodities** | Petróleo Brent, ouro e minério de ferro |
| **Agenda econômica** | O que é divulgado nos próximos dias. Cada linha é um link para a fonte oficial |
| **Entenda os termos** | Glossário em linguagem simples, para quem está começando |

E em `historico.html`: a linha do tempo das edições anteriores. Clicar em uma
delas remonta a página inteira daquela semana — panorama, cards, agenda.

### O que dá para fazer na página

- **Botão "Histórico"**, no topo à direita, leva para `historico.html`. O
  contador ao lado mostra quantas edições já estão arquivadas.
- Dentro do histórico, o **seletor "Edição"** troca de semana sem recarregar, e
  a URL guarda a escolha (`historico.html?e=1`) — dá para mandar o link de uma
  semana específica para alguém.
- **Botão `?`** em cada card abre uma explicação de uma linha, observações e a
  fonte do dado.
- **Cada linha da agenda** é um link para quem divulga o dado (IBGE, Banco
  Central, FGV, Fed, BEA…). Abaixo dela ficam os calendários completos.
- **Tema claro/escuro** no canto superior direito, salvo no navegador.
- **Selo de cada card** diz de onde veio o número: `ao vivo` (API, agora),
  `edição` (o que você digitou) ou `exemplo` (ainda não conferido).

### Os três números de cada card

| Chip | O que é | De onde vem |
|---|---|---|
| **12m** | Variação em 12 meses | `variacao12m` no `dados.js`, ou calculado pela API |
| **vs. dd/mm** | Variação desde a edição anterior | **calculado sozinho** a partir do `historico.js` |
| **DY** | Dividend yield de 12 meses | `dy` no `dados.js` (opcional) |

O mini-gráfico também é automático: ele é desenhado com os valores das edições
guardadas no `historico.js` (ou com a série da API, nos indicadores ao vivo).
Quanto mais semanas você arquivar, mais completo ele fica. Não existe campo de
histórico para preencher à mão.

---

## Dados ao vivo (automáticos, sem cadastro)

Estes se atualizam sozinhos a cada visita, direto da fonte pública:

| Indicador | Fonte |
|---|---|
| Dólar e euro | [AwesomeAPI](https://docs.awesomeapi.com.br/) |
| Bitcoin, Ethereum, BNB, Solana, XRP, Dogecoin, Litecoin | AwesomeAPI |
| Selic (meta) | Banco Central, série SGS 432 |
| CDI | Banco Central, série SGS 4389 |
| IPCA — 12 meses e mês | Banco Central, séries SGS 13522 e 433 |
| IGP-M — 12 meses | Banco Central, série SGS 189 (o acumulado é composto pelo site) |

Se qualquer chamada falhar, o site cai silenciosamente no valor do `dados.js`.
Nada quebra.

Índices de bolsa, ações, FIIs e commodities **não** têm API pública gratuita e
sem cadastro que funcione direto do navegador — por isso vêm do `dados.js`.
Veja *Ligar mais dados ao vivo* no fim.

---

## A rotina semanal

São dois passos: **arquivar a semana que passou** e **escrever a nova**.

### 1. Arquivar a edição atual

Antes de mexer em qualquer coisa:

1. Abra `index.html` e aperte **F12** para abrir o console do navegador.
2. Digite `radarArquivar()` e dê Enter.
3. O bloco pronto vai para a área de transferência (e também aparece no console).
4. Cole logo abaixo do `[` em `js/historico.js`. **A edição mais recente fica
   sempre no topo da lista.**

Pronto — aquela semana passa a aparecer em `historico.html` e vira mais um
ponto nos mini-gráficos dos cards.

### 2. Escrever a edição nova

Abra `js/dados.js`:

```js
meta: {
  atualizadoEm: "2026-09-02T18:30",   // aparece no header
  responsavel: "Seu nome"
}
```

Reescreva `resumo`, `destaques` e `agenda`, e atualize cada ativo:

```js
{
  id: "vale3", grupo: "br-acoes",
  nome: "Vale", ticker: "VALE3", formato: "brl",
  descricao: "Maior mineradora do país…",
  valor: 77.13,          // ← preço desta semana
  variacao12m: 46.00,    // ← variação em 12 meses, em %
  dy: 7.28,              // ← dividend yield 12 meses, em % (opcional)
  fonte: "B3"
}
```

São três números por ativo. Só isso.

### Campos que valem conhecer

| Campo | Para que serve |
|---|---|
| `formato` | `"pontos"`, `"brl"` (R$), `"usd"` (US$) ou `"percentual"` (%) |
| `casas` | Casas decimais. Padrão: 2 (ou 0 acima de 10 mil). O câmbio usa 4 |
| `sufixo` | Texto miúdo depois do valor: `"a.a."`, `"/barril"`, `"/onça"` |
| `nota` | Observação extra que aparece dentro do botão `?` |
| `destaque: true` | Promove o ativo para os cards grandes do Panorama (máximo 6) |
| `inverso: true` | Inverte as cores: subir vira vermelho. Ligado no VIX e nos índices de inflação |
| `exemplo: true` | Marca o número como ainda não conferido — ver abaixo |
| `grupo` | Em qual grade o card cai (tabela a seguir) |

Grupos disponíveis: `br-indices`, `br-macro`, `cambio`, `br-fiis`, `br-acoes`,
`cripto`, `int-indices`, `int-etfs`, `int-acoes`, `commodities`.

### Adicionar outra criptomoeda

Confira primeiro se o par existe em
<https://economia.awesomeapi.com.br/json/available>. Se aparecer, por exemplo,
`ADA-BRL`, basta copiar um bloco do grupo `cripto` e usar
`aoVivo: "moeda-ADA"` — a cotação passa a vir sozinha. Hoje o site usa BTC, ETH,
BNB, SOL, XRP, DOGE e LTC, que são os que a API cobre entre as mais conhecidas.

### Adicionar um ativo novo

Copie um bloco existente, troque `id` (precisa ser único), `nome`, `ticker` e
escolha o `grupo`. Pronto — o card aparece sozinho, na grade certa, nas duas
páginas. Não precisa mexer no HTML.

### A tarja amarela do topo

Alguns ativos vieram com `exemplo: true`: são números que eu inventei para o
site não nascer vazio (Ibovespa, IFIX, Small Caps, IDIV, S&P 500, Nasdaq, Dow
Jones, VIX, Microsoft, Brent, ouro e minério). O topo do site lista quais são,
e cada um desses cards mostra o selo `exemplo`.

Conforme você substituir cada número pelo real, **apague a linha
`exemplo: true`** daquele ativo. Quando não sobrar nenhum, a tarja some sozinha
— não tem interruptor global para lembrar de desligar.

Os FIIs, as ações brasileiras e os ativos internacionais já entraram com os
valores que você forneceu. Dois deles têm uma `nota` pedindo revisão: PLAG11 e
GARE11, onde não tenho certeza do segmento do fundo para escrever a descrição.

---

## Os links da agenda

Cada linha da agenda aponta para a página **oficial** de quem divulga o dado —
nada de agregador ou blog. Os links já conferidos e prontos para reaproveitar
estão listados em comentário no topo do bloco `agenda` do `dados.js`:

| Fonte | Para quê |
|---|---|
| IBGE | IPCA, IPCA-15, PIB e o calendário completo de divulgações |
| Banco Central | Copom e o calendário de estatísticas |
| FGV IBRE | IGP-M e os demais índices gerais de preços |
| Federal Reserve | Calendário de reuniões e comunicados do Fed |
| BEA | PCE, a medida de inflação preferida do Fed |
| BLS | Calendário dos indicadores americanos (CPI, payroll) |
| US Dept. of Labor | Pedidos semanais de auxílio-desemprego |
| S&P Global | PMI industrial e de serviços |

Para adicionar um evento, use o campo `link` (só `http://` ou `https://` — o
site ignora qualquer outra coisa) e o campo `fonte`, que vira a legenda cinza
embaixo do nome do evento.

---

## Ligar mais dados ao vivo (opcional)

Para automatizar Ibovespa, FIIs e ações, o caminho mais curto é a
[brapi.dev](https://brapi.dev) — cobre B3 e ações americanas, tem plano gratuito,
mas exige um token de cadastro. Em `js/app.js`, na seção *9. Dados ao vivo*, já
existe o encaixe pronto: escreva uma função nos moldes de `buscarCambio()` que
monte a lista de pontos `{ data, valor }`, chame `aplicarSerie(ativo, pontos)` e
depois `repintarPorId(id)`. O resto — formatação, cores, gráfico e o selo
`ao vivo` — acontece sozinho.

Atenção: um token em site estático fica visível para quem abrir o código-fonte.
Se isso for um problema, coloque um proxy simples na frente (uma função
serverless que guarda o token e devolve o JSON).

---

## Aviso

Conteúdo informativo e educacional. Não é recomendação de compra ou venda de
qualquer ativo. Rentabilidade passada não garante rentabilidade futura.
