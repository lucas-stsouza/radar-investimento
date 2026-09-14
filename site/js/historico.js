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
    atualizadoEm: "2026-09-06T12:29",
    responsavel:  "Lucas Santos",
    arquivo:      "historico/2026-09-06.html",
    resumo:       "Semana de alta forte no Brasil: o Ibovespa subiu 5,40% e fechou em 185.147,16 pontos, com as ações brasileiras acompanhadas aqui avançando 5,50% em média — Banco do Brasil (+11,65%), CSN Mineração (+9,83%) e Cemig (+8,12%) à frente. O dólar recuou 1,16%, a R$ 5,1249. Lá fora o movimento foi o oposto: as ações americanas caíram 0,86% em média, com S&P 500 e Nasdaq praticamente de lado. O petróleo Brent subiu 6,58%, a US$ 96,28, e as criptomoedas avançaram 5,26% em média.",
    destaques:    [{"titulo":"Bolsa brasileira dispara","texto":"Ibovespa sobe 5,40% na semana e fecha em 185.147,16 pontos, acumulando 31,32% em doze meses.","tom":"positivo"},{"titulo":"Bancos e mineração puxam","texto":"Banco do Brasil (+11,65%), CSN Mineração (+9,83%) e Itaúsa (+7,72%) lideram as altas da semana na B3.","tom":"positivo"},{"titulo":"Tecnologia americana cede","texto":"Amazon (-2,97%), Microsoft (-2,69%) e Alphabet (-2,35%) recuam, e as ações dos EUA caem 0,86% em média.","tom":"negativo"},{"titulo":"Dólar abaixo de R$ 5,13","texto":"A moeda americana recuou 1,16% na semana e acumula queda de 5,88% em doze meses.","tom":"neutro"},{"titulo":"Criptomoedas reagem","texto":"As sete acompanhadas subiram 5,26% em média, com Litecoin (+12,02%) à frente — mas todas seguem negativas em doze meses.","tom":"neutro"}],
    agenda:       [{"data":"2026-09-10","pais":"BR","relevancia":"media","evento":"Pesquisa Mensal de Serviços","fonte":"IBGE","link":"https://www.ibge.gov.br/estatisticas/economicas/servicos/9229-pesquisa-mensal-de-servicos.html"},{"data":"2026-09-11","pais":"BR","relevancia":"alta","evento":"IPCA de agosto","fonte":"IBGE","link":"https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-indice-nacional-de-precos-ao-consumidor-amplo.html"},{"data":"2026-09-15","pais":"BR","relevancia":"media","evento":"Pesquisa Mensal de Comércio","fonte":"IBGE","link":"https://www.ibge.gov.br/estatisticas/economicas/comercio/9227-pesquisa-mensal-de-comercio.html"},{"data":"2026-09-16","pais":"EUA","relevancia":"alta","evento":"Decisão de juros do FOMC","fonte":"Federal Reserve","link":"https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"},{"data":"2026-09-25","pais":"BR","relevancia":"alta","evento":"IPCA-15 de setembro","fonte":"IBGE","link":"https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9260-indice-nacional-de-precos-ao-consumidor-amplo-15.html"},{"data":"2026-10-02","pais":"BR","relevancia":"media","evento":"Produção industrial de agosto","fonte":"IBGE","link":"https://www.ibge.gov.br/estatisticas/economicas/industria/9294-pesquisa-industrial-mensal-producao-fisica-brasil.html"}],
    ativos: [
      { id: "ibovespa", valor: 185147.16, variacao12m: 31.32 },
      { id: "ifix", valor: 3769.71 },
      { id: "smll", valor: 2249.59 },
      { id: "idiv", valor: 12994.74 },
      { id: "selic", valor: 14, variacao12m: -1 },
      { id: "cdi", valor: 13.9, variacao12m: -1 },
      { id: "ipca12", valor: 4.44, variacao12m: -0.79 },
      { id: "ipcaMes", valor: 0.07, variacao12m: -0.19 },
      { id: "igpm", valor: 2.18, variacao12m: -0.85 },
      { id: "usdbrl", valor: 5.1249, variacao12m: -5.88 },
      { id: "eurbrl", valor: 5.9509, variacao12m: -6.27 },
      { id: "btcbrl", valor: 412182, variacao12m: -33.94 },
      { id: "ethbrl", valor: 12831.3, variacao12m: -49.37 },
      { id: "bnbbrl", valor: 3852, variacao12m: -22.53 },
      { id: "solbrl", valor: 547.5, variacao12m: -57.96 },
      { id: "xrpbrl", valor: 7.29, variacao12m: -56.37 },
      { id: "dogebrl", valor: 0.4586, variacao12m: -69.02 },
      { id: "ltcbrl", valor: 281.5, variacao12m: -55.59 },
      { id: "plag11", valor: 62.88, variacao12m: 27.68, dy: 10.34 },
      { id: "mcci11", valor: 95.25, variacao12m: 8.35, dy: 12.6 },
      { id: "kncr11", valor: 106.82, variacao12m: 1.74, dy: 13.24 },
      { id: "cpts11", valor: 7.5, variacao12m: 0.94, dy: 14.33 },
      { id: "brco11", valor: 111.42, variacao12m: 0.26, dy: 9.84 },
      { id: "xpml11", valor: 104.03, variacao12m: 0.03, dy: 10.61 },
      { id: "mxrf11", valor: 9.19, variacao12m: -3.47, dy: 13 },
      { id: "visc11", valor: 103.8, variacao12m: 0.04, dy: 9.6 },
      { id: "gare11", valor: 8.34, variacao12m: -7.33, dy: 10.95 },
      { id: "xplg11", valor: 90.7, variacao12m: -6.62, dy: 10.85 },
      { id: "rbrr11", valor: 73, variacao12m: -16.1, dy: 13.53 },
      { id: "vale3", valor: 78.62, variacao12m: 41.12, dy: 7.14 },
      { id: "itsa4", valor: 13.95, variacao12m: 29, dy: 8.08 },
      { id: "bbse3", valor: 42.16, variacao12m: 30.89, dy: 10.89 },
      { id: "cmin3", valor: 6.59, variacao12m: 28.21, dy: 5.85 },
      { id: "cmig3", valor: 17.04, variacao12m: 12.25, dy: 8.19 },
      { id: "amzo34", valor: 66.57, variacao12m: 4.11, dy: 0 },
      { id: "bbas3", valor: 22.52, variacao12m: 10.28, dy: 2.91 },
      { id: "viva3", valor: 23.13, variacao12m: -20.1, dy: 3.02 },
      { id: "sp500", valor: 7718.6, variacao12m: 19.09 },
      { id: "nasdaq", valor: 26506.99, variacao12m: 22.15 },
      { id: "dowjones", valor: 53414.25, variacao12m: 17.65 },
      { id: "vix", valor: 14.53, variacao12m: -5.03 },
      { id: "voo", valor: 708.01, variacao12m: 19 },
      { id: "pph", valor: 114.21, variacao12m: 28.28 },
      { id: "nvda", valor: 230.36, variacao12m: 37.92 },
      { id: "googl", valor: 338.46, variacao12m: 44.03 },
      { id: "tsla", valor: 354.08, variacao12m: 0.92 },
      { id: "aapl", valor: 319.97, variacao12m: 33.49 },
      { id: "amzn", valor: 258.51, variacao12m: 11.27 },
      { id: "ko", valor: 88.07, variacao12m: 29.59 },
      { id: "crwd", valor: 213.1, variacao12m: 104.1 },
      { id: "nke", valor: 38.4, variacao12m: -48.04 },
      { id: "msft", valor: 499.7, variacao12m: 0.95 },
      { id: "brent", valor: 96.28, variacao12m: 45.83 },
      { id: "ouro", valor: 4477, variacao12m: 23.05 },
      { id: "minerio", valor: 99.57, variacao12m: -5.11 }
    ]
  },

  {
    atualizadoEm: "2026-08-30T23:29",
    responsavel:  "Lucas Santos",
    arquivo:      "historico/2026-08-30.html",
    resumo:       "Fim de semana sem pregão: o retrato da bolsa segue o do fechamento de sexta, com o Ibovespa em 175.664,62 pontos e alta de 24,54% em doze meses. No pano de fundo, a Selic está em 14,00% ao ano, um ponto percentual abaixo de doze meses atrás, e o IPCA acumulado em 4,44%, também em queda no período. As três commodities acompanhadas fecham o ano em alta, com o minério de ferro subindo 57,91%. O contraste fica com as criptomoedas, que recuaram de novo neste fim de semana e seguem todas no vermelho em doze meses, do Bitcoin (-32,34%) ao Dogecoin (-63,69%).",
    destaques:    [{"titulo":"Bolsa no topo do período","texto":"Ibovespa em 175.664,62 pontos, alta de 24,54% em doze meses — o maior avanço entre os índices de bolsa acompanhados aqui.","tom":"positivo"},{"titulo":"Juros e inflação cedem juntos","texto":"Selic a 14,00% ao ano, um ponto percentual abaixo de doze meses atrás, com o IPCA acumulado em 4,44% — recuo de 0,79 ponto no mesmo intervalo.","tom":"positivo"},{"titulo":"Criptomoedas no vermelho","texto":"As sete criptomoedas acompanhadas caem em doze meses, de -32,34% no Bitcoin a -63,69% no Dogecoin, e todas recuaram de novo neste fim de semana.","tom":"negativo"},{"titulo":"Commodities sustentadas","texto":"As três commodities do Radar fecham doze meses em alta: minério de ferro +57,91%, petróleo Brent +30,66% e ouro +25,91%.","tom":"positivo"},{"titulo":"Câmbio mais fraco","texto":"Dólar a R$ 5,1850, recuo de 4,16% em doze meses. O euro, a R$ 6,0201, cede 5,06% no mesmo período.","tom":"neutro"}],
    agenda:       [{"data":"2026-09-01","pais":"BR","relevancia":"alta","evento":"PIB do 2º trimestre","fonte":"IBGE","link":"https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais/9300-contas-nacionais-trimestrais.html"},{"data":"2026-09-02","pais":"BR","relevancia":"media","evento":"Produção industrial de julho","fonte":"IBGE","link":"https://www.ibge.gov.br/estatisticas/economicas/industria/9294-pesquisa-industrial-mensal-producao-fisica-brasil.html"},{"data":"2026-09-10","pais":"BR","relevancia":"media","evento":"Pesquisa Mensal de Serviços","fonte":"IBGE","link":"https://www.ibge.gov.br/estatisticas/economicas/servicos/9229-pesquisa-mensal-de-servicos.html"},{"data":"2026-09-11","pais":"BR","relevancia":"alta","evento":"IPCA de agosto","fonte":"IBGE","link":"https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-indice-nacional-de-precos-ao-consumidor-amplo.html"},{"data":"2026-09-16","pais":"EUA","relevancia":"alta","evento":"Decisão de juros do FOMC","fonte":"Federal Reserve","link":"https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"},{"data":"2026-09-25","pais":"BR","relevancia":"alta","evento":"IPCA-15 de setembro","fonte":"IBGE","link":"https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9260-indice-nacional-de-precos-ao-consumidor-amplo-15.html"}],
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
      { id: "eurbrl", valor: 6.0201, variacao12m: -5.06 },
      { id: "btcbrl", valor: 406483, variacao12m: -32.34 },
      { id: "ethbrl", valor: 12623.8, variacao12m: -45.81 },
      { id: "bnbbrl", valor: 3571, variacao12m: -23.92 },
      { id: "solbrl", valor: 533.1, variacao12m: -51.16 },
      { id: "xrpbrl", valor: 7.02, variacao12m: -54.15 },
      { id: "dogebrl", valor: 0.4273, variacao12m: -63.69 },
      { id: "ltcbrl", valor: 251.3, variacao12m: -58.89 },
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
      { id: "brent", valor: 90.34, variacao12m: 30.66 },
      { id: "ouro", valor: 4469, variacao12m: 25.91 },
      { id: "minerio", valor: 95.84, variacao12m: 57.91 }
    ]
  },

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
      { id: "minerio", valor: 95.84, variacao12m: 59.03 }
    ]
  },

  // o arquivar.mjs insere as edições aqui, a mais recente primeiro

];
