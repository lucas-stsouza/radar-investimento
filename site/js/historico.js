/* ==========================================================================
   RADAR DE INVESTIMENTOS — ARQUIVO DE EDIÇÕES

   Aqui ficam as edições ANTERIORES: a data de cada uma, o resumo daquela
   semana e o valor de cada ativo naquele dia.

   VOCÊ NÃO PRECISA EDITAR ESTE ARQUIVO À MÃO.
   Quem escreve aqui é o comando /atualizar-radar, através de
   ferramentas/arquivar.mjs. Se quiser rodar só o arquivamento:

       node ferramentas/arquivar.mjs

   Ele faz duas coisas de uma vez:
     • grava historico/AAAA-MM-DD.html — a página daquele dia congelada,
       autocontida (CSS, dados e script embutidos, zero dependência);
     • acrescenta a entrada correspondente no topo desta lista.

   A edição MAIS RECENTE fica sempre no TOPO.

   PARA QUE SERVE
     • Em historico.html, "Ver esta edição" remonta a semana ali mesmo, e
       "Abrir a página daquele dia" abre o HTML congelado.
     • Os mini-gráficos dos cards são desenhados com estes valores — quanto
       mais edições guardadas, mais completo o gráfico.
     • Cada card ganha sozinho a variação "vs. a edição anterior".

   FORMATO DE UMA EDIÇÃO
   {
     atualizadoEm: "2026-08-19T18:30",
     responsavel:  "Equipe Radar",
     arquivo:      "historico/2026-08-19.html",   // vira o botão da página
     resumo:       "Texto de abertura daquela semana…",
     destaques:    [ { titulo, texto, tom } ],
     agenda:       [ { data, hora, pais, evento, relevancia, fonte, link } ],
     ativos: [
       { id: "ibovespa", valor: 141200, variacao12m: 7.90 },
       { id: "mxrf11",   valor: 9.14,   variacao12m: 5.10, dy: 13.02 }
     ]
   }

   Só "id" e "valor" são obrigatórios em cada ativo. Nome, ticker e descrição
   vêm do js/dados.js — não se repetem aqui.
   ========================================================================== */

const RADAR_HISTORICO = [

  {
    atualizadoEm: "2026-08-29T15:14",
    responsavel:  "Equipe Radar",
    arquivo:      "historico/2026-08-29.html",
    resumo:       "Semana de realização no Brasil depois de três altas seguidas, com o mercado ajustando a expectativa para o início do corte de juros. Lá fora, as bolsas americanas seguem sustentadas pelo setor de tecnologia, enquanto o dólar perde força frente às moedas emergentes.",
    destaques:    [{"titulo":"Juros no Brasil","texto":"Copom mantém o tom de cautela e o mercado passa a projetar o primeiro corte só no próximo trimestre.","tom":"neutro"},{"titulo":"Tecnologia puxa Wall Street","texto":"Resultados acima do esperado em semicondutores sustentam Nasdaq e S&P 500 perto das máximas históricas.","tom":"positivo"},{"titulo":"Fundos imobiliários","texto":"IFIX perde fôlego com a curva de juros longa pressionada; o segmento de papel sofre mais que o de tijolo.","tom":"negativo"},{"titulo":"Câmbio","texto":"Dólar recua com fluxo estrangeiro positivo para a bolsa brasileira e commodities firmes.","tom":"positivo"}],
    agenda:       [{"data":"2026-08-27","hora":"09:00","pais":"BR","relevancia":"alta","evento":"IPCA-15 de agosto","fonte":"IBGE","link":"https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9260-indice-nacional-de-precos-ao-consumidor-amplo-15.html"},{"data":"2026-08-27","hora":"09:30","pais":"EUA","relevancia":"media","evento":"Pedidos de auxílio-desemprego","fonte":"US Dept. of Labor","link":"https://oui.doleta.gov/unemploy/claims.asp"},{"data":"2026-08-28","hora":"08:00","pais":"BR","relevancia":"media","evento":"IGP-M de agosto","fonte":"FGV IBRE","link":"https://portalibre.fgv.br/igp"},{"data":"2026-08-28","hora":"09:30","pais":"EUA","relevancia":"alta","evento":"PCE — inflação preferida do Fed","fonte":"BEA","link":"https://www.bea.gov/data/personal-consumption-expenditures-price-index"},{"data":"2026-09-01","hora":"09:00","pais":"BR","relevancia":"alta","evento":"PIB do 2º trimestre","fonte":"IBGE","link":"https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais/9300-contas-nacionais-trimestrais.html"},{"data":"2026-09-02","hora":"10:00","pais":"GLB","relevancia":"media","evento":"PMI industrial global","fonte":"S&P Global","link":"https://www.pmi.spglobal.com/"}],
    ativos: [
      { id: "ibovespa", valor: 175664.62, variacao12m: 24.54 },
      { id: "ifix", valor: 3740.72 },
      { id: "smll", valor: 2123.4 },
      { id: "idiv", valor: 12292.07 },
      { id: "selic", valor: 14, variacao12m: -1 },
      { id: "cdi", valor: 13.9, variacao12m: -1 },
      { id: "ipca12", valor: 4.44, variacao12m: -0.79 },
      { id: "ipcaMes", valor: 0.07, variacao12m: -0.19 },
      { id: "igpm", valor: 2.18, variacao12m: -0.85 },
      { id: "usdbrl", valor: 5.185, variacao12m: -4.16 },
      { id: "eurbrl", valor: 6.0056, variacao12m: -4.69 },
      { id: "btcbrl", valor: 406967, variacao12m: -32.72 },
      { id: "ethbrl", valor: 12761.3, variacao12m: -45.66 },
      { id: "bnbbrl", valor: 3601, variacao12m: -21.87 },
      { id: "solbrl", valor: 546.7, variacao12m: -50.54 },
      { id: "xrpbrl", valor: 7.25, variacao12m: -52.49 },
      { id: "dogebrl", valor: 0.4433, variacao12m: -61.8 },
      { id: "ltcbrl", valor: 253.9, variacao12m: -58.14 },
      { id: "plag11", valor: 62, variacao12m: 25.25, dy: 10.16 },
      { id: "mcci11", valor: 94.99, variacao12m: 11.49, dy: 12.63 },
      { id: "kncr11", valor: 107.59, variacao12m: 2.56, dy: 13.32 },
      { id: "cpts11", valor: 7.46, variacao12m: 1.22, dy: 14.41 },
      { id: "brco11", valor: 113.1, variacao12m: 2.79, dy: 9.66 },
      { id: "xpml11", valor: 99.9, variacao12m: -0.24, dy: 11.05 },
      { id: "mxrf11", valor: 9.3, variacao12m: -2.72, dy: 12.84 },
      { id: "visc11", valor: 102.08, variacao12m: -1.01, dy: 9.73 },
      { id: "gare11", valor: 8.43, variacao12m: -6.33, dy: 10.83 },
      { id: "xplg11", valor: 91.28, variacao12m: -7.01, dy: 10.78 },
      { id: "rbrr11", valor: 73.63, variacao12m: -15.37, dy: 13.42 },
      { id: "vale3", valor: 78.58, variacao12m: 41.84, dy: 7.14 },
      { id: "itsa4", valor: 12.95, variacao12m: 18.15, dy: 8.7 },
      { id: "bbse3", valor: 40.02, variacao12m: 22.99, dy: 11.47 },
      { id: "cmin3", valor: 6, variacao12m: 15.83, dy: 6.43 },
      { id: "cmig3", valor: 15.76, variacao12m: 5.07, dy: 8.86 },
      { id: "amzo34", valor: 69.35, variacao12m: 10.68, dy: 0 },
      { id: "bbas3", valor: 20.17, variacao12m: -4.18, dy: 2.73 },
      { id: "viva3", valor: 21.97, variacao12m: -23.98, dy: 3.18 },
      { id: "sp500", valor: 7711.76, variacao12m: 19.37 },
      { id: "nasdaq", valor: 26402.42, variacao12m: 23.06 },
      { id: "dowjones", valor: 53559.99, variacao12m: 17.6 },
      { id: "vix", valor: 14.43, variacao12m: 0 },
      { id: "voo", valor: 707.24, variacao12m: 19.25 },
      { id: "pph", valor: 113.62, variacao12m: 27.84 },
      { id: "nvda", valor: 217.55, variacao12m: 24.9 },
      { id: "googl", valor: 346.59, variacao12m: 62.79 },
      { id: "tsla", valor: 348.75, variacao12m: 4.46 },
      { id: "aapl", valor: 319.7, variacao12m: 37.72 },
      { id: "amzn", valor: 266.43, variacao12m: 16.34 },
      { id: "ko", valor: 89.66, variacao12m: 29.96 },
      { id: "crwd", valor: 218.4, variacao12m: 106.18 },
      { id: "nke", valor: 39.6, variacao12m: -48.82 },
      { id: "msft", valor: 513.53, variacao12m: 1.35 },
      { id: "brent", valor: 88.1, variacao12m: 29.33 },
      { id: "ouro", valor: 4529.9, variacao12m: 30.41 },
      { id: "minerio", valor: 161.91, variacao12m: 59.03 }
    ]
  },

  // o arquivar.mjs insere as edições aqui, a mais recente primeiro

];
