/* ==========================================================================
   RADAR DE INVESTIMENTOS — EDIÇÃO ATUAL
   --------------------------------------------------------------------------
   ESTE É O ARQUIVO QUE VOCÊ EDITA TODA SEMANA.

   Rotina (leva ~10 min):
     1. Rode radarArquivar() no console e cole o resultado no topo de
        js/historico.js — isso guarda a edição da semana passada.
     2. Troque "atualizadoEm" pela data/hora de agora.
     3. Atualize "valor", "variacao12m" e "dy" de cada ativo.
     4. Reescreva "resumo", "destaques" e "agenda".
     5. Apague a linha "exemplo: true" dos ativos que você já preencheu
        com número real — o aviso amarelo do topo some sozinho quando
        não sobrar nenhum.

   NÃO existe mais campo "historico" aqui: os mini-gráficos são montados a
   partir das edições guardadas em js/historico.js e das APIs ao vivo.

   Câmbio (USD, EUR, BTC), Selic, CDI, IPCA e IGP-M são buscados AO VIVO
   quando o site está online. Os valores abaixo servem de reserva.
   ========================================================================== */

const RADAR = {

  meta: {
    // Data/hora desta edição. Formato: AAAA-MM-DDTHH:MM
    atualizadoEm: "2026-08-26T18:30",
    // Quem fechou a edição (aparece no rodapé e no histórico)
    responsavel: "Equipe Radar"
  },

  /* Parágrafo de abertura: o "se você só ler uma coisa, leia isso". */
  resumo:
    "Semana de realização no Brasil depois de três altas seguidas, com o mercado " +
    "ajustando a expectativa para o início do corte de juros. Lá fora, as bolsas " +
    "americanas seguem sustentadas pelo setor de tecnologia, enquanto o dólar " +
    "perde força frente às moedas emergentes.",

  /* 3 a 5 pontos curtos. Cada um vira um cartão em "Radar da semana". */
  destaques: [
    {
      titulo: "Juros no Brasil",
      texto: "Copom mantém o tom de cautela e o mercado passa a projetar o primeiro corte só no próximo trimestre.",
      tom: "neutro"        // positivo | neutro | negativo
    },
    {
      titulo: "Tecnologia puxa Wall Street",
      texto: "Resultados acima do esperado em semicondutores sustentam Nasdaq e S&P 500 perto das máximas históricas.",
      tom: "positivo"
    },
    {
      titulo: "Fundos imobiliários",
      texto: "IFIX perde fôlego com a curva de juros longa pressionada; o segmento de papel sofre mais que o de tijolo.",
      tom: "negativo"
    },
    {
      titulo: "Câmbio",
      texto: "Dólar recua com fluxo estrangeiro positivo para a bolsa brasileira e commodities firmes.",
      tom: "positivo"
    }
  ],

  /* ------------------------------------------------------------------------
     Agenda econômica da semana.
       pais        "BR" | "EUA" | "GLB"
       relevancia  "alta" | "media"
       fonte       nome curto de quem divulga (aparece no link)
       link        página OFICIAL de quem divulga o dado — a linha inteira da
                   agenda vira um link para lá. Use só fontes primárias.

     Links oficiais para reaproveitar:
       IBGE — calendário  https://www.ibge.gov.br/calendario-divulgacoes-novoportal.html
       IBGE — IPCA        https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-indice-nacional-de-precos-ao-consumidor-amplo.html
       IBGE — IPCA-15     https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9260-indice-nacional-de-precos-ao-consumidor-amplo-15.html
       IBGE — PIB         https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais/9300-contas-nacionais-trimestrais.html
       BCB  — Copom       https://www.bcb.gov.br/controleinflacao/copom
       BCB  — calendário  https://www.bcb.gov.br/estatisticas/calendarioestatisticas
       FGV  — IGP         https://portalibre.fgv.br/igp
       Fed  — calendário  https://www.federalreserve.gov/newsevents/calendar.htm
       BEA  — PCE         https://www.bea.gov/data/personal-consumption-expenditures-price-index
       BLS  — calendário  https://www.bls.gov/schedule/news_release/
       DOL  — jobless     https://oui.doleta.gov/unemploy/claims.asp
       S&P Global — PMI   https://www.pmi.spglobal.com/
     ------------------------------------------------------------------------ */
  agenda: [
    {
      data: "2026-08-27", hora: "09:00", pais: "BR", relevancia: "alta",
      evento: "IPCA-15 de agosto", fonte: "IBGE",
      link: "https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9260-indice-nacional-de-precos-ao-consumidor-amplo-15.html"
    },
    {
      data: "2026-08-27", hora: "09:30", pais: "EUA", relevancia: "media",
      evento: "Pedidos de auxílio-desemprego", fonte: "US Dept. of Labor",
      link: "https://oui.doleta.gov/unemploy/claims.asp"
    },
    {
      data: "2026-08-28", hora: "08:00", pais: "BR", relevancia: "media",
      evento: "IGP-M de agosto", fonte: "FGV IBRE",
      link: "https://portalibre.fgv.br/igp"
    },
    {
      data: "2026-08-28", hora: "09:30", pais: "EUA", relevancia: "alta",
      evento: "PCE — inflação preferida do Fed", fonte: "BEA",
      link: "https://www.bea.gov/data/personal-consumption-expenditures-price-index"
    },
    {
      data: "2026-09-01", hora: "09:00", pais: "BR", relevancia: "alta",
      evento: "PIB do 2º trimestre", fonte: "IBGE",
      link: "https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais/9300-contas-nacionais-trimestrais.html"
    },
    {
      data: "2026-09-02", hora: "10:00", pais: "GLB", relevancia: "media",
      evento: "PMI industrial global", fonte: "S&P Global",
      link: "https://www.pmi.spglobal.com/"
    }
  ],

  /* Links fixos mostrados no rodapé da agenda, para quem quer o calendário
     completo em vez dos eventos da semana. */
  calendarios: [
    { nome: "Calendário de divulgações do IBGE", link: "https://www.ibge.gov.br/calendario-divulgacoes-novoportal.html" },
    { nome: "Calendário do Banco Central",       link: "https://www.bcb.gov.br/estatisticas/calendarioestatisticas" },
    { nome: "Reuniões do Copom",                 link: "https://www.bcb.gov.br/controleinflacao/copom" },
    { nome: "Calendário do Federal Reserve",     link: "https://www.federalreserve.gov/newsevents/calendar.htm" },
    { nome: "Calendário do BLS (dados dos EUA)", link: "https://www.bls.gov/schedule/news_release/" }
  ],

  /* ------------------------------------------------------------------------
     ATIVOS E INDICADORES

     Campos de cada item:
       id           identificador único (não repita)
       grupo        em qual grade o card aparece — ver lista no README
       nome         o que aparece em destaque no card
       ticker       o código, em letra pequena
       formato      "pontos" | "brl" (R$) | "usd" (US$) | "percentual" (%)
       casas        casas decimais (opcional; padrão 2, ou 0 acima de 10 mil)
       sufixo       texto miúdo depois do valor: "a.a.", "/barril"…
       valor        o número desta edição
       variacao12m  variação em 12 meses, em % (null se você não tem o dado)
       dy           dividend yield 12 meses, em % (opcional)
       descricao    uma linha explicando o ativo, mostrada no botão "?"
       nota         observação extra (opcional), aparece junto da descrição
       destaque     true = vira card grande no Panorama (máximo 6)
       inverso      true = subir é ruim, inverte as cores (VIX, inflação)
       exemplo      true = número inventado, ainda não conferido
       aoVivo       preenchido pelo app.js, não mexa
     ------------------------------------------------------------------------ */
  ativos: [

    /* ===== BRASIL — ÍNDICES ==============================================
       TODO: substituir pelos números reais e apagar "exemplo: true".        */
    {
      id: "ibovespa", grupo: "br-indices", destaque: true, exemplo: true,
      nome: "Ibovespa", ticker: "IBOV", formato: "pontos",
      descricao: "As ~85 ações mais negociadas da B3. É o termômetro da bolsa brasileira.",
      valor: 142380, variacao12m: 8.41,
      fonte: "B3"
    },
    {
      id: "ifix", grupo: "br-indices", exemplo: true,
      nome: "IFIX", ticker: "IFIX", formato: "pontos",
      descricao: "Índice dos fundos imobiliários listados na B3.",
      valor: 3486, variacao12m: 3.15,
      fonte: "B3"
    },
    {
      id: "smll", grupo: "br-indices", exemplo: true,
      nome: "Small Caps", ticker: "SMLL", formato: "pontos",
      descricao: "Empresas de menor valor de mercado. Costuma oscilar mais que o Ibovespa.",
      valor: 2418, variacao12m: 6.02,
      fonte: "B3"
    },
    {
      id: "idiv", grupo: "br-indices", exemplo: true,
      nome: "Dividendos", ticker: "IDIV", formato: "pontos",
      descricao: "Ações que mais pagaram proventos nos últimos anos.",
      valor: 9214, variacao12m: 11.07,
      fonte: "B3"
    },

    /* ===== BRASIL — MACRO (ao vivo no Banco Central) ===================== */
    {
      id: "selic", grupo: "br-macro", destaque: true,
      nome: "Selic (meta)", ticker: "SELIC", formato: "percentual", sufixo: "a.a.",
      descricao: "Taxa básica de juros definida pelo Copom. Referência de toda a renda fixa.",
      valor: 14.00, variacao12m: 0.75,
      fonte: "Banco Central (SGS 432)", aoVivo: "sgs-432"
    },
    {
      id: "cdi", grupo: "br-macro",
      nome: "CDI", ticker: "CDI", formato: "percentual", sufixo: "a.a.",
      descricao: "Referência da renda fixa privada. Anda praticamente colado na Selic.",
      valor: 13.90, variacao12m: 0.75,
      fonte: "Banco Central (SGS 4389)", aoVivo: "sgs-4389"
    },
    {
      id: "ipca12", grupo: "br-macro", destaque: true, inverso: true,
      nome: "IPCA (12 meses)", ticker: "IPCA", formato: "percentual",
      descricao: "Inflação oficial acumulada em 12 meses. É o que corrói o poder de compra.",
      valor: 4.44, variacao12m: -0.07,
      fonte: "IBGE / BCB (SGS 13522)", aoVivo: "sgs-13522"
    },
    {
      id: "ipcaMes", grupo: "br-macro", inverso: true,
      nome: "IPCA (mês)", ticker: "IPCA-M", formato: "percentual",
      descricao: "Variação da inflação no último mês fechado.",
      valor: 0.07, variacao12m: -0.35,
      fonte: "IBGE / BCB (SGS 433)", aoVivo: "sgs-433"
    },
    {
      id: "igpm", grupo: "br-macro", inverso: true,
      nome: "IGP-M (12 meses)", ticker: "IGP-M", formato: "percentual",
      descricao: "Índice de inflação usado no reajuste de aluguéis e contratos.",
      valor: 2.77, variacao12m: -1.17,
      fonte: "FGV / BCB (SGS 189)", aoVivo: "sgs-189"
    },

    /* ===== CÂMBIO (ao vivo na AwesomeAPI) ================================ */
    {
      id: "usdbrl", grupo: "cambio", destaque: true,
      nome: "Dólar comercial", ticker: "USD/BRL", formato: "brl", casas: 4,
      descricao: "Quanto custa 1 dólar em reais. Afeta inflação, viagens e importados.",
      valor: 5.1465, variacao12m: -4.35,
      fonte: "AwesomeAPI", aoVivo: "moeda-USD"
    },
    {
      id: "eurbrl", grupo: "cambio",
      nome: "Euro", ticker: "EUR/BRL", formato: "brl", casas: 4,
      descricao: "Cotação do euro em reais.",
      valor: 5.9952, variacao12m: -2.10,
      fonte: "AwesomeAPI", aoVivo: "moeda-EUR"
    },

    /* ===== CRIPTOMOEDAS (todas ao vivo na AwesomeAPI) ====================
       Para adicionar outra, confira antes se o par existe em
       https://economia.awesomeapi.com.br/json/available  e use o mesmo
       formato de "aoVivo": "moeda-XXX".                                    */
    {
      id: "btcbrl", grupo: "cripto", destaque: false,
      nome: "Bitcoin", ticker: "BTC/BRL", formato: "brl",
      descricao: "A maior e mais líquida das criptomoedas. Serve de termômetro do apetite a risco.",
      valor: 406970, variacao12m: -33.26,
      fonte: "AwesomeAPI", aoVivo: "moeda-BTC"
    },
    {
      id: "ethbrl", grupo: "cripto",
      nome: "Ethereum", ticker: "ETH/BRL", formato: "brl",
      descricao: "Segunda maior cripto. É a rede onde roda a maior parte dos contratos inteligentes.",
      valor: 12870, variacao12m: -45.72,
      fonte: "AwesomeAPI", aoVivo: "moeda-ETH"
    },
    {
      id: "bnbbrl", grupo: "cripto",
      nome: "BNB", ticker: "BNB/BRL", formato: "brl",
      descricao: "Moeda do ecossistema da Binance, a maior corretora de cripto do mundo.",
      valor: 3632.00, variacao12m: -22.21,
      fonte: "AwesomeAPI", aoVivo: "moeda-BNB"
    },
    {
      id: "solbrl", grupo: "cripto",
      nome: "Solana", ticker: "SOL/BRL", formato: "brl",
      descricao: "Rede concorrente do Ethereum, conhecida por transações rápidas e baratas.",
      valor: 519.90, variacao12m: -54.74,
      fonte: "AwesomeAPI", aoVivo: "moeda-SOL"
    },
    {
      id: "xrpbrl", grupo: "cripto",
      nome: "XRP", ticker: "XRP/BRL", formato: "brl",
      descricao: "Criada para transferências internacionais entre instituições financeiras.",
      valor: 7.25, variacao12m: -53.78,
      fonte: "AwesomeAPI", aoVivo: "moeda-XRP"
    },
    {
      id: "dogebrl", grupo: "cripto",
      nome: "Dogecoin", ticker: "DOGE/BRL", formato: "brl", casas: 4,
      descricao: "Nasceu como piada e virou a principal “meme coin”. Muito sensível a notícias.",
      valor: 0.45, variacao12m: -62.03,
      fonte: "AwesomeAPI", aoVivo: "moeda-DOGE"
    },
    {
      id: "ltcbrl", grupo: "cripto",
      nome: "Litecoin", ticker: "LTC/BRL", formato: "brl",
      descricao: "Uma das criptos mais antigas, criada como versão mais leve do Bitcoin.",
      valor: 257.70, variacao12m: -57.93,
      fonte: "AwesomeAPI", aoVivo: "moeda-LTC"
    },

    /* ===== FUNDOS IMOBILIÁRIOS =========================================== */
    {
      id: "plag11", grupo: "br-fiis",
      nome: "PLAG11", ticker: "PLAG11", formato: "brl",
      descricao: "Fundo listado na B3.",
      nota: "Confira o segmento do fundo e complete esta descrição.",
      valor: 61.84, variacao12m: 36.36, dy: 10.96,
      fonte: "B3"
    },
    {
      id: "mcci11", grupo: "br-fiis",
      nome: "MCCI11", ticker: "MCCI11", formato: "brl",
      descricao: "FII de papel: investe em CRIs (títulos de dívida imobiliária).",
      valor: 94.53, variacao12m: 22.86, dy: 12.69,
      fonte: "B3"
    },
    {
      id: "kncr11", grupo: "br-fiis",
      nome: "KNCR11", ticker: "KNCR11", formato: "brl",
      descricao: "FII de papel com CRIs atrelados ao CDI. Rende mais quando a Selic está alta.",
      valor: 106.98, variacao12m: 13.92, dy: 13.40,
      fonte: "B3"
    },
    {
      id: "cpts11", grupo: "br-fiis",
      nome: "CPTS11", ticker: "CPTS11", formato: "brl",
      descricao: "FII de papel, com CRIs e cotas de outros fundos imobiliários.",
      valor: 7.37, variacao12m: 12.01, dy: 14.59,
      fonte: "B3"
    },
    {
      id: "brco11", grupo: "br-fiis",
      nome: "BRCO11", ticker: "BRCO11", formato: "brl",
      descricao: "FII de tijolo: galpões logísticos alugados para grandes operadores.",
      valor: 112.45, variacao12m: 9.84, dy: 9.71,
      fonte: "B3"
    },
    {
      id: "xpml11", grupo: "br-fiis",
      nome: "XPML11", ticker: "XPML11", formato: "brl",
      descricao: "FII de tijolo: participação em shopping centers pelo país.",
      valor: 98.00, variacao12m: 5.77, dy: 11.27,
      fonte: "B3"
    },
    {
      id: "mxrf11", grupo: "br-fiis",
      nome: "MXRF11", ticker: "MXRF11", formato: "brl",
      descricao: "FII híbrido e o mais popular do país, com cota de valor baixo.",
      valor: 9.20, variacao12m: 5.50, dy: 12.99,
      fonte: "B3"
    },
    {
      id: "visc11", grupo: "br-fiis",
      nome: "VISC11", ticker: "VISC11", formato: "brl",
      descricao: "FII de tijolo: carteira de shopping centers.",
      valor: 101.04, variacao12m: 4.91, dy: 9.83,
      fonte: "B3"
    },
    {
      id: "gare11", grupo: "br-fiis",
      nome: "GARE11", ticker: "GARE11", formato: "brl",
      descricao: "FII de renda urbana: imóveis alugados no varejo e na logística.",
      nota: "Confira o segmento do fundo e complete esta descrição.",
      valor: 8.28, variacao12m: -0.84, dy: 12.03,
      fonte: "B3"
    },
    {
      id: "xplg11", grupo: "br-fiis",
      nome: "XPLG11", ticker: "XPLG11", formato: "brl",
      descricao: "FII de tijolo: galpões logísticos e industriais.",
      valor: 90.22, variacao12m: -1.33, dy: 10.95,
      fonte: "B3"
    },
    {
      id: "rbrr11", grupo: "br-fiis",
      nome: "RBRR11", ticker: "RBRR11", formato: "brl",
      descricao: "FII de papel focado em CRIs de baixo risco de crédito (high grade).",
      valor: 74.00, variacao12m: -7.30, dy: 13.35,
      fonte: "B3"
    },

    /* ===== AÇÕES BRASILEIRAS ============================================= */
    {
      id: "vale3", grupo: "br-acoes",
      nome: "Vale", ticker: "VALE3", formato: "brl",
      descricao: "Maior mineradora do país. O resultado acompanha o minério de ferro e a China.",
      valor: 77.13, variacao12m: 46.00, dy: 7.28,
      fonte: "B3"
    },
    {
      id: "itsa4", grupo: "br-acoes",
      nome: "Itaúsa", ticker: "ITSA4", formato: "brl",
      descricao: "Holding que controla o Itaú Unibanco e tem participação em empresas industriais.",
      valor: 12.65, variacao12m: 28.17, dy: 8.99,
      fonte: "B3"
    },
    {
      id: "bbse3", grupo: "br-acoes",
      nome: "BB Seguridade", ticker: "BBSE3", formato: "brl",
      descricao: "Braço de seguros e previdência do Banco do Brasil. Conhecida por dividendos altos.",
      valor: 38.10, variacao12m: 26.75, dy: 12.05,
      fonte: "B3"
    },
    {
      id: "cmin3", grupo: "br-acoes",
      nome: "CSN Mineração", ticker: "CMIN3", formato: "brl",
      descricao: "Braço de mineração da CSN. Também depende do preço do minério de ferro.",
      valor: 5.87, variacao12m: 24.63, dy: 6.57,
      fonte: "B3"
    },
    {
      id: "cmig3", grupo: "br-acoes",
      nome: "Cemig", ticker: "CMIG3", formato: "brl",
      descricao: "Elétrica de Minas Gerais. Setor regulado, receita previsível.",
      valor: 15.61, variacao12m: 12.63, dy: 5.28,
      fonte: "B3"
    },
    {
      id: "amzo34", grupo: "br-acoes",
      nome: "Amazon (BDR)", ticker: "AMZO34", formato: "brl",
      descricao: "BDR da Amazon: um recibo negociado na B3 que dá exposição à ação americana.",
      nota: "Mesma exposição de AMZN — se você acompanha as duas, conte a posição uma vez só.",
      valor: 67.18, variacao12m: 7.92, dy: 0,
      fonte: "B3"
    },
    {
      id: "bbas3", grupo: "br-acoes",
      nome: "Banco do Brasil", ticker: "BBAS3", formato: "brl",
      descricao: "Banco público com forte presença no crédito rural.",
      valor: 18.60, variacao12m: -7.51, dy: 2.96,
      fonte: "B3"
    },
    {
      id: "viva3", grupo: "br-acoes",
      nome: "Vivara", ticker: "VIVA3", formato: "brl",
      descricao: "Maior rede de joalherias do país. Varejo sensível a juros e renda.",
      valor: 21.99, variacao12m: -19.56, dy: 3.18,
      fonte: "B3"
    },

    /* ===== INTERNACIONAL — ÍNDICES ======================================= */
    {
      id: "sp500", grupo: "int-indices", destaque: true, exemplo: true,
      nome: "S&P 500", ticker: "SPX", formato: "pontos",
      descricao: "As 500 maiores empresas dos EUA. A principal referência de bolsa no mundo.",
      valor: 6142, variacao12m: 12.85,
      fonte: "S&P Dow Jones"
    },
    {
      id: "nasdaq", grupo: "int-indices", destaque: true, exemplo: true,
      nome: "Nasdaq Composite", ticker: "IXIC", formato: "pontos",
      descricao: "Concentra as empresas de tecnologia. Mais volátil que o S&P 500.",
      valor: 20415, variacao12m: 16.22,
      fonte: "Nasdaq"
    },
    {
      id: "dowjones", grupo: "int-indices", exemplo: true,
      nome: "Dow Jones", ticker: "DJI", formato: "pontos",
      descricao: "30 grandes empresas tradicionais dos EUA. Menos exposto a tecnologia.",
      valor: 44780, variacao12m: 7.05,
      fonte: "S&P Dow Jones"
    },
    {
      id: "vix", grupo: "int-indices", inverso: true, exemplo: true,
      nome: "VIX — índice do medo", ticker: "VIX", formato: "pontos",
      descricao: "Mede o nervosismo do mercado. Acima de 20 = tensão; abaixo de 15 = calmaria.",
      valor: 14.2, variacao12m: -12.4,
      fonte: "CBOE"
    },

    /* ===== INTERNACIONAL — ETFs ========================================== */
    {
      id: "voo", grupo: "int-etfs",
      nome: "Vanguard S&P 500", ticker: "VOO", formato: "usd",
      descricao: "ETF que replica o S&P 500. Uma cota = pedacinho das 500 maiores empresas dos EUA.",
      valor: 704.02, variacao12m: null,
      fonte: "NYSE Arca"
    },
    {
      id: "pph", grupo: "int-etfs",
      nome: "VanEck Pharmaceutical", ticker: "PPH", formato: "usd",
      descricao: "ETF setorial: cesta das maiores farmacêuticas do mundo.",
      nota: "Preço com um dia de defasagem em relação aos demais ativos internacionais.",
      valor: 116.48, variacao12m: null,
      fonte: "Nasdaq"
    },

    /* ===== INTERNACIONAL — AÇÕES ========================================= */
    {
      id: "nvda", grupo: "int-acoes",
      nome: "Nvidia", ticker: "NVDA", formato: "usd",
      descricao: "Líder em chips para inteligência artificial.",
      valor: 213.05, variacao12m: null,
      fonte: "Nasdaq"
    },
    {
      id: "googl", grupo: "int-acoes",
      nome: "Alphabet (Google)", ticker: "GOOGL", formato: "usd",
      descricao: "Dona do Google, do YouTube e do Android.",
      valor: 349.90, variacao12m: null,
      fonte: "Nasdaq"
    },
    {
      id: "tsla", grupo: "int-acoes",
      nome: "Tesla", ticker: "TSLA", formato: "usd",
      descricao: "Carros elétricos, energia e robótica.",
      valor: 350.25, variacao12m: null,
      fonte: "Nasdaq"
    },
    {
      id: "aapl", grupo: "int-acoes",
      nome: "Apple", ticker: "AAPL", formato: "usd",
      descricao: "iPhone e serviços; disputa o posto de maior empresa do mundo.",
      valor: 309.90, variacao12m: null,
      fonte: "Nasdaq"
    },
    {
      id: "amzn", grupo: "int-acoes",
      nome: "Amazon", ticker: "AMZN", formato: "usd",
      descricao: "E-commerce e AWS, a maior provedora de nuvem do mundo.",
      nota: "Mesma exposição do BDR AMZO34, listado na seção de ações brasileiras.",
      valor: 261.06, variacao12m: null,
      fonte: "Nasdaq"
    },
    {
      id: "ko", grupo: "int-acoes",
      nome: "Coca-Cola", ticker: "KO", formato: "usd",
      descricao: "Consumo defensivo: vende bem em qualquer ciclo econômico.",
      valor: 91.64, variacao12m: null,
      fonte: "NYSE"
    },
    {
      id: "crwd", grupo: "int-acoes",
      nome: "CrowdStrike", ticker: "CRWD", formato: "usd",
      descricao: "Cibersegurança em nuvem. Crescimento alto e múltiplo caro.",
      valor: 185.38, variacao12m: null,
      fonte: "Nasdaq"
    },
    {
      id: "nke", grupo: "int-acoes",
      nome: "Nike", ticker: "NKE", formato: "usd",
      descricao: "Maior marca de artigos esportivos do mundo.",
      valor: 39.48, variacao12m: null,
      fonte: "NYSE"
    },
    {
      id: "msft", grupo: "int-acoes", exemplo: true,
      nome: "Microsoft", ticker: "MSFT", formato: "usd",
      descricao: "Windows, nuvem Azure e participação relevante em IA.",
      valor: 468.90, variacao12m: 13.4,
      fonte: "Nasdaq"
    },

    /* ===== COMMODITIES =================================================== */
    {
      id: "brent", grupo: "commodities", exemplo: true,
      nome: "Petróleo Brent", ticker: "BRENT", formato: "usd", sufixo: "/barril",
      descricao: "Referência mundial do petróleo. Pesa na Petrobras e no preço da gasolina.",
      valor: 71.40, variacao12m: -6.20,
      fonte: "ICE"
    },
    {
      id: "ouro", grupo: "commodities", exemplo: true,
      nome: "Ouro", ticker: "XAU", formato: "usd", sufixo: "/onça",
      descricao: "Reserva de valor clássica. Sobe quando o mercado busca proteção.",
      valor: 2684.0, variacao12m: 19.4,
      fonte: "LBMA"
    },
    {
      id: "minerio", grupo: "commodities", exemplo: true,
      nome: "Minério de ferro", ticker: "IRON", formato: "usd", sufixo: "/ton",
      descricao: "Principal commodity da Vale. Depende muito da demanda chinesa.",
      valor: 102.30, variacao12m: -8.10,
      fonte: "SGX / Dalian"
    }
  ],

  /* Glossário da seção "Entenda os termos" */
  glossario: [
    { termo: "Ibovespa",     texto: "Carteira teórica com as ações mais negociadas da B3. Quando dizem “a bolsa subiu”, normalmente é dele que estão falando." },
    { termo: "IFIX",         texto: "Mesma ideia do Ibovespa, mas para fundos imobiliários (FIIs)." },
    { termo: "Selic",        texto: "Taxa básica de juros da economia. Sobe para segurar a inflação, cai para estimular o consumo." },
    { termo: "CDI",          texto: "Taxa dos empréstimos entre bancos. É a referência de rendimento da renda fixa (ex.: “CDB a 110% do CDI”)." },
    { termo: "IPCA",         texto: "Inflação oficial do Brasil, medida pelo IBGE. Se seu investimento rende menos que o IPCA, você perdeu poder de compra." },
    { termo: "IGP-M",        texto: "Outro índice de inflação, mais sensível a atacado e câmbio. Usado em reajuste de aluguel." },
    { termo: "Dividend yield (DY)", texto: "Quanto o ativo pagou em proventos nos últimos 12 meses, em % do preço. DY de 10% = pagou R$ 10 para cada R$ 100 investidos." },
    { termo: "FII de papel", texto: "Fundo imobiliário que investe em títulos de dívida (CRIs) em vez de imóveis. O rendimento acompanha juros e inflação." },
    { termo: "FII de tijolo", texto: "Fundo imobiliário dono de imóveis de verdade — shoppings, galpões, lajes — e que vive do aluguel deles." },
    { termo: "BDR",          texto: "Recibo negociado na B3 que representa uma ação estrangeira. Permite investir lá fora comprando em reais." },
    { termo: "ETF",          texto: "Fundo negociado em bolsa que replica um índice ou setor. Comprar uma cota é comprar a cesta inteira de uma vez." },
    { termo: "Criptomoeda",  texto: "Ativo digital sem banco central por trás. Não tem garantia nenhuma e oscila muito mais que ações — as quedas de 50% em um ano são comuns." },
    { termo: "S&P 500",      texto: "Índice das 500 maiores empresas listadas nos EUA. Referência global de renda variável." },
    { termo: "Nasdaq",       texto: "Índice com forte peso de tecnologia. Tende a oscilar mais que o S&P 500." },
    { termo: "Dow Jones",    texto: "Índice antigo com 30 grandes empresas americanas, ponderado por preço da ação." },
    { termo: "VIX",          texto: "Volatilidade esperada do S&P 500 para os próximos 30 dias. Apelidado de “índice do medo”." },
    { termo: "Commodity",    texto: "Matéria-prima negociada globalmente com preço padronizado: petróleo, ouro, minério, soja." },
    { termo: "Volatilidade", texto: "O tamanho das oscilações de um ativo. Mais volátil = mais risco e mais oportunidade." }
  ]
};
