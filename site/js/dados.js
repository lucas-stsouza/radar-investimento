/* ==========================================================================
   RADAR DE INVESTIMENTOS — EDIÇÃO ATUAL
   --------------------------------------------------------------------------
   Este arquivo guarda a edição que está no ar.

   VOCÊ NÃO PRECISA DIGITAR NÚMERO AQUI. A rotina semanal é o comando
   /atualizar-radar, que faz tudo em ordem:

     1. node ferramentas/arquivar.mjs    congela a edição que está no ar em
                                         historico/AAAA-MM-DD.html
     2. node ferramentas/coletar.mjs --escrever
                                         busca os 55 ativos nas fontes e
                                         reescreve "valor", "variacao12m",
                                         "dy" e "atualizadoEm" aqui
     3. o texto (resumo, destaques, agenda) é reescrito à mão, com base em
        notícia apurada — é a única parte que não dá para automatizar

   Se quiser rodar só a coleta, sem arquivar:
     node ferramentas/coletar.mjs              (mostra sem gravar)
     node ferramentas/coletar.mjs --escrever   (grava)

   REGRA: nenhum número entra aqui sem estar confirmado na fonte. O que a
   coleta não conseguir confirmar mantém o valor anterior e é listado no
   relatório. Se algum dia um valor for provisório, marque o ativo com
   "exemplo: true" — a tarja amarela do topo lista os pendentes e some
   sozinha quando não sobrar nenhum.

   NÃO existe campo "historico" aqui: os mini-gráficos são montados a partir
   das edições guardadas em js/historico.js e das APIs ao vivo.

   Câmbio, criptos, Selic, CDI, IPCA e IGP-M também se atualizam sozinhos no
   navegador, a cada visita. Os valores abaixo são a foto da última coleta e
   servem de reserva se a API estiver fora do ar.
   ========================================================================== */

const RADAR = {

  meta: {
    // Data/hora desta edição. Formato: AAAA-MM-DDTHH:MM
    atualizadoEm: "2026-08-30T23:29",
    // Quem fechou a edição (aparece no rodapé e no histórico)
    responsavel: "Lucas Santos"
  },

  /* Parágrafo de abertura: o "se você só ler uma coisa, leia isso". */
  resumo:
    "Fim de semana sem pregão: o retrato da bolsa segue o do fechamento de " +
    "sexta, com o Ibovespa em 175.664,62 pontos e alta de 24,54% em doze meses. " +
    "No pano de fundo, a Selic está em 14,00% ao ano, um ponto percentual abaixo " +
    "de doze meses atrás, e o IPCA acumulado em 4,44%, também em queda no " +
    "período. As três commodities acompanhadas fecham o ano em alta, com o " +
    "minério de ferro subindo 57,91%. O contraste fica com as criptomoedas, que " +
    "recuaram de novo neste fim de semana e seguem todas no vermelho em doze " +
    "meses, do Bitcoin (-32,34%) ao Dogecoin (-63,69%).",

  /* 3 a 5 pontos curtos. Cada um vira um cartão em "Radar da semana". */
  destaques: [
    {
      titulo: "Bolsa no topo do período",
      texto: "Ibovespa em 175.664,62 pontos, alta de 24,54% em doze meses — o maior avanço entre os índices de bolsa acompanhados aqui.",
      tom: "positivo"        // positivo | neutro | negativo
    },
    {
      titulo: "Juros e inflação cedem juntos",
      texto: "Selic a 14,00% ao ano, um ponto percentual abaixo de doze meses atrás, com o IPCA acumulado em 4,44% — recuo de 0,79 ponto no mesmo intervalo.",
      tom: "positivo"
    },
    {
      titulo: "Criptomoedas no vermelho",
      texto: "As sete criptomoedas acompanhadas caem em doze meses, de -32,34% no Bitcoin a -63,69% no Dogecoin, e todas recuaram de novo neste fim de semana.",
      tom: "negativo"
    },
    {
      titulo: "Commodities sustentadas",
      texto: "As três commodities do Radar fecham doze meses em alta: minério de ferro +57,91%, petróleo Brent +30,66% e ouro +25,91%.",
      tom: "positivo"
    },
    {
      titulo: "Câmbio mais fraco",
      texto: "Dólar a R$ 5,1850, recuo de 4,16% em doze meses. O euro, a R$ 6,0201, cede 5,06% no mesmo período.",
      tom: "neutro"
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
      data: "2026-09-01", pais: "BR", relevancia: "alta",
      evento: "PIB do 2º trimestre", fonte: "IBGE",
      link: "https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais/9300-contas-nacionais-trimestrais.html"
    },
    {
      data: "2026-09-02", pais: "BR", relevancia: "media",
      evento: "Produção industrial de julho", fonte: "IBGE",
      link: "https://www.ibge.gov.br/estatisticas/economicas/industria/9294-pesquisa-industrial-mensal-producao-fisica-brasil.html"
    },
    {
      data: "2026-09-10", pais: "BR", relevancia: "media",
      evento: "Pesquisa Mensal de Serviços", fonte: "IBGE",
      link: "https://www.ibge.gov.br/estatisticas/economicas/servicos/9229-pesquisa-mensal-de-servicos.html"
    },
    {
      data: "2026-09-11", pais: "BR", relevancia: "alta",
      evento: "IPCA de agosto", fonte: "IBGE",
      link: "https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-indice-nacional-de-precos-ao-consumidor-amplo.html"
    },
    {
      data: "2026-09-16", pais: "EUA", relevancia: "alta",
      evento: "Decisão de juros do FOMC", fonte: "Federal Reserve",
      link: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"
    },
    {
      data: "2026-09-25", pais: "BR", relevancia: "alta",
      evento: "IPCA-15 de setembro", fonte: "IBGE",
      link: "https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9260-indice-nacional-de-precos-ao-consumidor-amplo-15.html"
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

    /* ===== BRASIL — ÍNDICES ============================================== */
    {
      id: "ibovespa", grupo: "br-indices", destaque: true,
      nome: "Ibovespa", ticker: "IBOV", formato: "pontos",
      descricao: "As ~85 ações mais negociadas da B3. É o termômetro da bolsa brasileira.",
      valor: 175664.62, variacao12m: 24.54,
      fonte: "B3"
    },
    {
      id: "ifix", grupo: "br-indices",
      nome: "IFIX", ticker: "IFIX", formato: "pontos",
      descricao: "Índice dos fundos imobiliários listados na B3.",
      valor: 3740.72, variacao12m: null,
      fonte: "B3"
    },
    {
      id: "smll", grupo: "br-indices",
      nome: "Small Caps", ticker: "SMLL", formato: "pontos",
      descricao: "Empresas de menor valor de mercado. Costuma oscilar mais que o Ibovespa.",
      valor: 2123.4, variacao12m: null,
      fonte: "B3"
    },
    {
      id: "idiv", grupo: "br-indices",
      nome: "Dividendos", ticker: "IDIV", formato: "pontos",
      descricao: "Ações que mais pagaram proventos nos últimos anos.",
      valor: 12292.07, variacao12m: null,
      fonte: "B3"
    },

    /* ===== BRASIL — MACRO (ao vivo no Banco Central) ===================== */
    {
      id: "selic", grupo: "br-macro", destaque: true,
      nome: "Selic (meta)", ticker: "SELIC", formato: "percentual", sufixo: "a.a.",
      descricao: "Taxa básica de juros definida pelo Copom. Referência de toda a renda fixa.",
      valor: 14, variacao12m: -1,
      fonte: "Banco Central (SGS 432)", aoVivo: "sgs-432"
    },
    {
      id: "cdi", grupo: "br-macro",
      nome: "CDI", ticker: "CDI", formato: "percentual", sufixo: "a.a.",
      descricao: "Referência da renda fixa privada. Anda praticamente colado na Selic.",
      valor: 13.9, variacao12m: -1,
      fonte: "Banco Central (SGS 4389)", aoVivo: "sgs-4389"
    },
    {
      id: "ipca12", grupo: "br-macro", destaque: true, inverso: true,
      nome: "IPCA (12 meses)", ticker: "IPCA", formato: "percentual",
      descricao: "Inflação oficial acumulada em 12 meses. É o que corrói o poder de compra.",
      valor: 4.44, variacao12m: -0.79,
      fonte: "IBGE / BCB (SGS 13522)", aoVivo: "sgs-13522"
    },
    {
      id: "ipcaMes", grupo: "br-macro", inverso: true,
      nome: "IPCA (mês)", ticker: "IPCA-M", formato: "percentual",
      descricao: "Variação da inflação no último mês fechado.",
      valor: 0.07, variacao12m: -0.19,
      fonte: "IBGE / BCB (SGS 433)", aoVivo: "sgs-433"
    },
    {
      id: "igpm", grupo: "br-macro", inverso: true,
      nome: "IGP-M (12 meses)", ticker: "IGP-M", formato: "percentual",
      descricao: "Índice de inflação usado no reajuste de aluguéis e contratos.",
      valor: 2.18, variacao12m: -0.85,
      fonte: "FGV / BCB (SGS 189)", aoVivo: "sgs-189"
    },

    /* ===== CÂMBIO (ao vivo na AwesomeAPI) ================================ */
    {
      id: "usdbrl", grupo: "cambio", destaque: true,
      nome: "Dólar comercial", ticker: "USD/BRL", formato: "brl", casas: 4,
      descricao: "Quanto custa 1 dólar em reais. Afeta inflação, viagens e importados.",
      valor: 5.185, variacao12m: -4.16,
      fonte: "AwesomeAPI", aoVivo: "moeda-USD"
    },
    {
      id: "eurbrl", grupo: "cambio",
      nome: "Euro", ticker: "EUR/BRL", formato: "brl", casas: 4,
      descricao: "Cotação do euro em reais.",
      valor: 6.0201, variacao12m: -5.06,
      fonte: "AwesomeAPI", aoVivo: "moeda-EUR"
    },

    /* ===== CRIPTOMOEDAS (todas ao vivo na AwesomeAPI) ====================
       Para adicionar outra, confira antes se o par existe em
       https://economia.awesomeapi.com.br/json/available  e use o mesmo
       formato de "aoVivo": "moeda-XXX".                                    */
    {
      id: "btcbrl", grupo: "cripto", destaque: false,
      nome: "Bitcoin", ticker: "BTC/BRL", formato: "brl", casas: 0,
      descricao: "A maior e mais líquida das criptomoedas. Serve de termômetro do apetite a risco.",
      valor: 406483, variacao12m: -32.34,
      fonte: "AwesomeAPI", aoVivo: "moeda-BTC"
    },
    {
      id: "ethbrl", grupo: "cripto",
      nome: "Ethereum", ticker: "ETH/BRL", formato: "brl",
      descricao: "Segunda maior cripto. É a rede onde roda a maior parte dos contratos inteligentes.",
      valor: 12623.8, variacao12m: -45.81,
      fonte: "AwesomeAPI", aoVivo: "moeda-ETH"
    },
    {
      id: "bnbbrl", grupo: "cripto",
      nome: "BNB", ticker: "BNB/BRL", formato: "brl",
      descricao: "Moeda do ecossistema da Binance, a maior corretora de cripto do mundo.",
      valor: 3571, variacao12m: -23.92,
      fonte: "AwesomeAPI", aoVivo: "moeda-BNB"
    },
    {
      id: "solbrl", grupo: "cripto",
      nome: "Solana", ticker: "SOL/BRL", formato: "brl",
      descricao: "Rede concorrente do Ethereum, conhecida por transações rápidas e baratas.",
      valor: 533.1, variacao12m: -51.16,
      fonte: "AwesomeAPI", aoVivo: "moeda-SOL"
    },
    {
      id: "xrpbrl", grupo: "cripto",
      nome: "XRP", ticker: "XRP/BRL", formato: "brl",
      descricao: "Criada para transferências internacionais entre instituições financeiras.",
      valor: 7.02, variacao12m: -54.15,
      fonte: "AwesomeAPI", aoVivo: "moeda-XRP"
    },
    {
      id: "dogebrl", grupo: "cripto",
      nome: "Dogecoin", ticker: "DOGE/BRL", formato: "brl", casas: 4,
      descricao: "Nasceu como piada e virou a principal “meme coin”. Muito sensível a notícias.",
      valor: 0.4273, variacao12m: -63.69,
      fonte: "AwesomeAPI", aoVivo: "moeda-DOGE"
    },
    {
      id: "ltcbrl", grupo: "cripto",
      nome: "Litecoin", ticker: "LTC/BRL", formato: "brl",
      descricao: "Uma das criptos mais antigas, criada como versão mais leve do Bitcoin.",
      valor: 251.3, variacao12m: -58.89,
      fonte: "AwesomeAPI", aoVivo: "moeda-LTC"
    },

    /* ===== FUNDOS IMOBILIÁRIOS =========================================== */
    {
      id: "plag11", grupo: "br-fiis",
      nome: "PLAG11", ticker: "PLAG11", formato: "brl",
      descricao: "FII de tijolo: carteira de imóveis físicos, vive da renda dos aluguéis.",
      valor: 62, variacao12m: 25.25, dy: 10.16,
      fonte: "B3"
    },
    {
      id: "mcci11", grupo: "br-fiis",
      nome: "MCCI11", ticker: "MCCI11", formato: "brl",
      descricao: "FII de papel: investe em CRIs (títulos de dívida imobiliária).",
      valor: 94.99, variacao12m: 11.49, dy: 12.63,
      fonte: "B3"
    },
    {
      id: "kncr11", grupo: "br-fiis",
      nome: "KNCR11", ticker: "KNCR11", formato: "brl",
      descricao: "FII de papel com CRIs atrelados ao CDI. Rende mais quando a Selic está alta.",
      valor: 107.59, variacao12m: 2.56, dy: 13.32,
      fonte: "B3"
    },
    {
      id: "cpts11", grupo: "br-fiis",
      nome: "CPTS11", ticker: "CPTS11", formato: "brl",
      descricao: "FII de papel, com CRIs e cotas de outros fundos imobiliários.",
      valor: 7.46, variacao12m: 1.22, dy: 14.41,
      fonte: "B3"
    },
    {
      id: "brco11", grupo: "br-fiis",
      nome: "BRCO11", ticker: "BRCO11", formato: "brl",
      descricao: "FII de tijolo: galpões logísticos alugados para grandes operadores.",
      valor: 113.1, variacao12m: 2.79, dy: 9.66,
      fonte: "B3"
    },
    {
      id: "xpml11", grupo: "br-fiis",
      nome: "XPML11", ticker: "XPML11", formato: "brl",
      descricao: "FII de tijolo: participação em shopping centers pelo país.",
      valor: 99.9, variacao12m: -0.24, dy: 11.05,
      fonte: "B3"
    },
    {
      id: "mxrf11", grupo: "br-fiis",
      nome: "MXRF11", ticker: "MXRF11", formato: "brl",
      descricao: "FII híbrido e o mais popular do país, com cota de valor baixo.",
      valor: 9.3, variacao12m: -2.72, dy: 12.84,
      fonte: "B3"
    },
    {
      id: "visc11", grupo: "br-fiis",
      nome: "VISC11", ticker: "VISC11", formato: "brl",
      descricao: "FII de tijolo: carteira de shopping centers.",
      valor: 102.08, variacao12m: -1.01, dy: 9.73,
      fonte: "B3"
    },
    {
      id: "gare11", grupo: "br-fiis",
      nome: "GARE11", ticker: "GARE11", formato: "brl",
      descricao: "FII de tijolo: renda urbana, com imóveis alugados no varejo e na logística.",
      valor: 8.43, variacao12m: -6.33, dy: 10.83,
      fonte: "B3"
    },
    {
      id: "xplg11", grupo: "br-fiis",
      nome: "XPLG11", ticker: "XPLG11", formato: "brl",
      descricao: "FII de tijolo: galpões logísticos e industriais.",
      valor: 91.28, variacao12m: -7.01, dy: 10.78,
      fonte: "B3"
    },
    {
      id: "rbrr11", grupo: "br-fiis",
      nome: "RBRR11", ticker: "RBRR11", formato: "brl",
      descricao: "FII de papel focado em CRIs de baixo risco de crédito (high grade).",
      valor: 73.63, variacao12m: -15.37, dy: 13.42,
      fonte: "B3"
    },

    /* ===== AÇÕES BRASILEIRAS ============================================= */
    {
      id: "vale3", grupo: "br-acoes",
      nome: "Vale", ticker: "VALE3", formato: "brl",
      descricao: "Maior mineradora do país. O resultado acompanha o minério de ferro e a China.",
      valor: 78.58, variacao12m: 41.84, dy: 7.14,
      fonte: "B3"
    },
    {
      id: "itsa4", grupo: "br-acoes",
      nome: "Itaúsa", ticker: "ITSA4", formato: "brl",
      descricao: "Holding que controla o Itaú Unibanco e tem participação em empresas industriais.",
      valor: 12.95, variacao12m: 18.15, dy: 8.7,
      fonte: "B3"
    },
    {
      id: "bbse3", grupo: "br-acoes",
      nome: "BB Seguridade", ticker: "BBSE3", formato: "brl",
      descricao: "Braço de seguros e previdência do Banco do Brasil. Conhecida por dividendos altos.",
      valor: 40.02, variacao12m: 22.99, dy: 11.47,
      fonte: "B3"
    },
    {
      id: "cmin3", grupo: "br-acoes",
      nome: "CSN Mineração", ticker: "CMIN3", formato: "brl",
      descricao: "Braço de mineração da CSN. Também depende do preço do minério de ferro.",
      valor: 6, variacao12m: 15.83, dy: 6.43,
      fonte: "B3"
    },
    {
      id: "cmig3", grupo: "br-acoes",
      nome: "Cemig", ticker: "CMIG3", formato: "brl",
      descricao: "Elétrica de Minas Gerais. Setor regulado, receita previsível.",
      valor: 15.76, variacao12m: 5.07, dy: 8.86,
      fonte: "B3"
    },
    {
      id: "amzo34", grupo: "br-acoes",
      nome: "Amazon (BDR)", ticker: "AMZO34", formato: "brl",
      descricao: "BDR da Amazon: um recibo negociado na B3 que dá exposição à ação americana.",
      nota: "Mesma exposição de AMZN — se você acompanha as duas, conte a posição uma vez só.",
      valor: 69.35, variacao12m: 10.68, dy: 0,
      fonte: "B3"
    },
    {
      id: "bbas3", grupo: "br-acoes",
      nome: "Banco do Brasil", ticker: "BBAS3", formato: "brl",
      descricao: "Banco público com forte presença no crédito rural.",
      valor: 20.17, variacao12m: -4.18, dy: 2.73,
      fonte: "B3"
    },
    {
      id: "viva3", grupo: "br-acoes",
      nome: "Vivara", ticker: "VIVA3", formato: "brl",
      descricao: "Maior rede de joalherias do país. Varejo sensível a juros e renda.",
      valor: 21.97, variacao12m: -23.98, dy: 3.18,
      fonte: "B3"
    },

    /* ===== INTERNACIONAL — ÍNDICES ======================================= */
    {
      id: "sp500", grupo: "int-indices", destaque: true,
      nome: "S&P 500", ticker: "SPX", formato: "pontos",
      descricao: "As 500 maiores empresas dos EUA. A principal referência de bolsa no mundo.",
      valor: 7711.76, variacao12m: 19.37,
      fonte: "S&P Dow Jones"
    },
    {
      id: "nasdaq", grupo: "int-indices", destaque: true,
      nome: "Nasdaq Composite", ticker: "IXIC", formato: "pontos",
      descricao: "Concentra as empresas de tecnologia. Mais volátil que o S&P 500.",
      valor: 26402.42, variacao12m: 23.06,
      fonte: "Nasdaq"
    },
    {
      id: "dowjones", grupo: "int-indices",
      nome: "Dow Jones", ticker: "DJI", formato: "pontos",
      descricao: "30 grandes empresas tradicionais dos EUA. Menos exposto a tecnologia.",
      valor: 53559.99, variacao12m: 17.6,
      fonte: "S&P Dow Jones"
    },
    {
      id: "vix", grupo: "int-indices", inverso: true,
      nome: "VIX — índice do medo", ticker: "VIX", formato: "pontos",
      descricao: "Mede o nervosismo do mercado. Acima de 20 = tensão; abaixo de 15 = calmaria.",
      valor: 14.43, variacao12m: 0,
      fonte: "CBOE"
    },

    /* ===== INTERNACIONAL — ETFs ========================================== */
    {
      id: "voo", grupo: "int-etfs",
      nome: "Vanguard S&P 500", ticker: "VOO", formato: "usd",
      descricao: "ETF que replica o S&P 500. Uma cota = pedacinho das 500 maiores empresas dos EUA.",
      valor: 707.24, variacao12m: 19.25,
      fonte: "NYSE Arca"
    },
    {
      id: "pph", grupo: "int-etfs",
      nome: "VanEck Pharmaceutical", ticker: "PPH", formato: "usd",
      descricao: "ETF setorial: cesta das maiores farmacêuticas do mundo.",
      nota: "Preço com um dia de defasagem em relação aos demais ativos internacionais.",
      valor: 113.62, variacao12m: 27.84,
      fonte: "Nasdaq"
    },

    /* ===== INTERNACIONAL — AÇÕES ========================================= */
    {
      id: "nvda", grupo: "int-acoes",
      nome: "Nvidia", ticker: "NVDA", formato: "usd",
      descricao: "Líder em chips para inteligência artificial.",
      valor: 217.55, variacao12m: 24.9,
      fonte: "Nasdaq"
    },
    {
      id: "googl", grupo: "int-acoes",
      nome: "Alphabet (Google)", ticker: "GOOGL", formato: "usd",
      descricao: "Dona do Google, do YouTube e do Android.",
      valor: 346.59, variacao12m: 62.79,
      fonte: "Nasdaq"
    },
    {
      id: "tsla", grupo: "int-acoes",
      nome: "Tesla", ticker: "TSLA", formato: "usd",
      descricao: "Carros elétricos, energia e robótica.",
      valor: 348.75, variacao12m: 4.46,
      fonte: "Nasdaq"
    },
    {
      id: "aapl", grupo: "int-acoes",
      nome: "Apple", ticker: "AAPL", formato: "usd",
      descricao: "iPhone e serviços; disputa o posto de maior empresa do mundo.",
      valor: 319.7, variacao12m: 37.72,
      fonte: "Nasdaq"
    },
    {
      id: "amzn", grupo: "int-acoes",
      nome: "Amazon", ticker: "AMZN", formato: "usd",
      descricao: "E-commerce e AWS, a maior provedora de nuvem do mundo.",
      nota: "Mesma exposição do BDR AMZO34, listado na seção de ações brasileiras.",
      valor: 266.43, variacao12m: 16.34,
      fonte: "Nasdaq"
    },
    {
      id: "ko", grupo: "int-acoes",
      nome: "Coca-Cola", ticker: "KO", formato: "usd",
      descricao: "Consumo defensivo: vende bem em qualquer ciclo econômico.",
      valor: 89.66, variacao12m: 29.96,
      fonte: "NYSE"
    },
    {
      id: "crwd", grupo: "int-acoes",
      nome: "CrowdStrike", ticker: "CRWD", formato: "usd",
      descricao: "Cibersegurança em nuvem. Crescimento alto e múltiplo caro.",
      valor: 218.4, variacao12m: 106.18,
      fonte: "Nasdaq"
    },
    {
      id: "nke", grupo: "int-acoes",
      nome: "Nike", ticker: "NKE", formato: "usd",
      descricao: "Maior marca de artigos esportivos do mundo.",
      valor: 39.6, variacao12m: -48.82,
      fonte: "NYSE"
    },
    {
      id: "msft", grupo: "int-acoes",
      nome: "Microsoft", ticker: "MSFT", formato: "usd",
      descricao: "Windows, nuvem Azure e participação relevante em IA.",
      valor: 513.53, variacao12m: 1.35,
      fonte: "Nasdaq"
    },

    /* ===== COMMODITIES =================================================== */
    {
      id: "brent", grupo: "commodities",
      nome: "Petróleo Brent", ticker: "BRENT", formato: "usd", sufixo: "/barril",
      descricao: "Referência mundial do petróleo. Pesa na Petrobras e no preço da gasolina.",
      valor: 90.34, variacao12m: 30.66,
      fonte: "ICE"
    },
    {
      id: "ouro", grupo: "commodities",
      nome: "Ouro", ticker: "XAU", formato: "usd", sufixo: "/onça", casas: 0,
      descricao: "Reserva de valor clássica. Sobe quando o mercado busca proteção.",
      valor: 4469, variacao12m: 25.91,
      fonte: "LBMA"
    },
    {
      id: "minerio", grupo: "commodities",
      nome: "Minério de ferro", ticker: "IRON", formato: "usd", sufixo: "/ton",
      descricao: "Principal commodity da Vale. Depende muito da demanda chinesa.",
      valor: 161.91, variacao12m: 57.91,
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
