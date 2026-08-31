/* ==========================================================================
   RADAR DE INVESTIMENTOS — APLICAÇÃO
   Um único motor para três modos, escolhidos por body[data-pagina]:
     "radar"      index.html                  → a edição da semana, com dado ao vivo
     "historico"  historico.html              → a linha do tempo das edições
     "arquivo"    historico/AAAA-MM-DD.html   → um snapshot congelado, sem rede
   Você normalmente NÃO precisa mexer neste arquivo.
   ========================================================================== */
(function () {
  "use strict";

  var PAGINA = document.body.dataset.pagina || "radar";

  var HIST = (typeof RADAR_HISTORICO !== "undefined" && Array.isArray(RADAR_HISTORICO))
    ? RADAR_HISTORICO.slice() : [];
  HIST.sort(function (a, b) {                       // mais recente primeiro
    return new Date(b.atualizadoEm) - new Date(a.atualizadoEm);
  });

  var edicaoAtiva = -1;   // -1 = edição atual; 0+ = índice em HIST
  var cards = [];         // { el, ativo }

  function $(id) { return document.getElementById(id); }

  /* ====================================================================
     1. FORMATAÇÃO
     ==================================================================== */

  function num(valor, casas) {
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: casas, maximumFractionDigits: casas
    });
  }

  function casasDe(ativo) {
    if (typeof ativo.casas === "number") return ativo.casas;
    return 2;      // sempre 2 casas: esconder decimal de um índice é falsear
                   // o número. Quem precisa de mais declara `casas` no
                   // dados.js — o câmbio usa 4.
  }

  function formatarValor(ativo) {
    var corpo = num(ativo.valor, casasDe(ativo));
    return {
      prefixo: ativo.formato === "brl" ? "R$" : (ativo.formato === "usd" ? "US$" : ""),
      corpo: ativo.formato === "percentual" ? corpo + "%" : corpo,
      sufixo: ativo.sufixo || ""
    };
  }

  /** Variação de taxas é medida em pontos percentuais, não em %. */
  function unidade(ativo) {
    return ativo.formato === "percentual" ? " p.p." : "%";
  }

  function calcularVariacao(atual, anterior, formato) {
    if (anterior === null || anterior === undefined || !isFinite(anterior)) return null;
    if (formato === "percentual") return atual - anterior;
    if (anterior === 0) return null;
    return (atual / anterior - 1) * 100;
  }

  function dataBonita(iso, comHora) {
    var d = new Date(iso);
    if (isNaN(d)) return "—";
    var base = String(d.getDate()).padStart(2, "0") + "/" +
               String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
    if (!comHora) return base;
    return base + " · " + String(d.getHours()).padStart(2, "0") + "h" +
           String(d.getMinutes()).padStart(2, "0");
  }

  function dataCurta(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "—";
    return String(d.getDate()).padStart(2, "0") + "/" +
           String(d.getMonth() + 1).padStart(2, "0");
  }

  function dataRelativa(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "";
    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var alvo = new Date(d); alvo.setHours(0, 0, 0, 0);
    var dias = Math.round((hoje - alvo) / 86400000);
    if (dias <= 0) return "hoje";
    if (dias === 1) return "ontem";
    if (dias < 7) return "há " + dias + " dias";
    if (dias < 14) return "há 1 semana";
    if (dias < 60) return "há " + Math.floor(dias / 7) + " semanas";
    return "há " + Math.floor(dias / 30) + " meses";
  }

  function escapar(txt) {
    return String(txt).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /** Só deixa passar link http(s) — evita javascript: vindo dos dados. */
  function linkSeguro(url) {
    return /^https?:\/\//i.test(url || "") ? escapar(url) : null;
  }

  /* ====================================================================
     2. EDIÇÕES
     Cada edição arquivada guarda só id + valores. Nome, formato e
     descrição vêm sempre da definição atual em dados.js.
     ==================================================================== */

  function definicao(id) {
    for (var i = 0; i < RADAR.ativos.length; i++) {
      if (RADAR.ativos[i].id === id) return RADAR.ativos[i];
    }
    return null;
  }

  function edicao(indice) {
    if (indice < 0) return RADAR;

    var arq = HIST[indice];
    var ativos = (arq.ativos || []).map(function (registro) {
      var base = definicao(registro.id);
      if (!base) return null;
      var copia = Object.assign({}, base, registro);
      delete copia.aoVivo; delete copia.aoVivoOk; delete copia._serieAoVivo;
      return copia;
    }).filter(Boolean);

    return {
      meta: { atualizadoEm: arq.atualizadoEm, responsavel: arq.responsavel },
      resumo: arq.resumo || "",
      destaques: arq.destaques || [],
      agenda: arq.agenda || [],
      calendarios: RADAR.calendarios,
      ativos: ativos
    };
  }

  /** Valor do mesmo ativo na edição imediatamente anterior à ativa. */
  function valorAnterior(id) {
    var alvo = edicaoAtiva + 1;
    if (alvo >= HIST.length) return null;
    var lista = HIST[alvo].ativos || [];
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === id && isFinite(lista[i].valor)) return lista[i].valor;
    }
    return null;
  }

  /** Série do mini-gráfico: edições arquivadas + o valor da edição ativa. */
  function serieDoAtivo(ativo) {
    if (ativo._serieAoVivo && ativo._serieAoVivo.length > 1) return ativo._serieAoVivo;

    var serie = [];
    for (var i = HIST.length - 1; i > edicaoAtiva; i--) {   // do mais antigo
      var lista = HIST[i].ativos || [];
      for (var j = 0; j < lista.length; j++) {
        if (lista[j].id === ativo.id && isFinite(lista[j].valor)) {
          serie.push(lista[j].valor); break;
        }
      }
    }
    serie.push(ativo.valor);
    return serie;
  }

  /* ====================================================================
     3. MINI-GRÁFICO (sparkline em SVG puro)
     ==================================================================== */

  function sparkline(serie, subiu, largura, altura) {
    largura = largura || 92; altura = altura || 30;
    if (!serie || serie.length < 2) return "";

    var min = Math.min.apply(null, serie);
    var max = Math.max.apply(null, serie);
    var amplitude = (max - min) || 1;
    var passo = largura / (serie.length - 1);
    var pad = 3;

    var pontos = serie.map(function (v, i) {
      var y = altura - pad - ((v - min) / amplitude) * (altura - pad * 2);
      return (i * passo).toFixed(1) + "," + y.toFixed(1);
    });

    var cor = subiu ? "var(--alta)" : "var(--baixa)";
    var area = "M0," + altura + " L" + pontos.join(" L") + " L" + largura + "," + altura + " Z";

    // preserveAspectRatio="none" deixa o gráfico esticar quando o CSS o manda
    // ocupar a largura toda no mobile; o traço é mantido fino pelo CSS.
    return '<svg class="grafico" width="' + largura + '" height="' + altura +
           '" viewBox="0 0 ' + largura + " " + altura +
           '" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
             '<path class="grafico__area" d="' + area + '" fill="' + cor + '"/>' +
             '<polyline class="grafico__linha" points="' + pontos.join(" ") +
             '" stroke="' + cor + '"/>' +
           "</svg>";
  }

  /* ====================================================================
     4. CARDS
     ==================================================================== */

  function tom(valor, inverso) {
    if (valor === null || valor === undefined || Math.abs(valor) < 0.005) return "neutro";
    var positivo = valor > 0;
    if (inverso) positivo = !positivo;
    return positivo ? "alta" : "baixa";
  }

  function chip(rotulo, valor, ativo, titulo) {
    var seta = valor > 0.005 ? "▲" : (valor < -0.005 ? "▼" : "■");
    var sinal = valor > 0 ? "+" : "";
    return '<span class="metrica metrica--' + tom(valor, ativo.inverso) +
             '" title="' + escapar(titulo) + '">' +
             '<span class="metrica__rot">' + rotulo + "</span>" +
             '<span class="metrica__seta">' + seta + "</span>" +
             sinal + num(valor, 2) + unidade(ativo) +
           "</span>";
  }

  function metricasHtml(ativo) {
    var partes = [];

    var ant = valorAnterior(ativo.id);
    if (ant !== null) {
      var v = calcularVariacao(ativo.valor, ant, ativo.formato);
      var quando = HIST[edicaoAtiva + 1] ? dataCurta(HIST[edicaoAtiva + 1].atualizadoEm) : "";
      if (v !== null) partes.push(chip("vs. " + quando, v, ativo, "Variação desde a edição de " + quando));
    }

    if (isFinite(ativo.variacao12m) && ativo.variacao12m !== null) {
      partes.push(chip("12m", ativo.variacao12m, ativo, "Variação em 12 meses"));
    }

    if (isFinite(ativo.dy) && ativo.dy !== null && ativo.dy !== undefined) {
      partes.push('<span class="metrica metrica--dy" title="Dividend yield dos últimos 12 meses">' +
                    '<span class="metrica__rot">DY</span>' + num(ativo.dy, 2) + "%</span>");
    }

    if (!partes.length) {
      partes.push('<span class="metrica metrica--vazia" ' +
                  'title="A variação aparece assim que houver uma edição anterior arquivada.">' +
                  "sem variação registrada</span>");
    }
    return partes.join("");
  }

  function seloHtml(ativo) {
    if (ativo.aoVivoOk) {
      return '<span class="card__selo" data-selo title="Buscado agora na fonte pública">ao vivo</span>';
    }
    if (ativo.exemplo) {
      return '<span class="card__selo card__selo--exemplo" data-selo ' +
             'title="Número de exemplo: ainda não conferido">exemplo</span>';
    }
    return '<span class="card__selo card__selo--estatico" data-selo ' +
           'title="Valor informado nesta edição">edição</span>';
  }

  function montarCard(ativo, grande) {
    var el = document.createElement("article");
    el.className = "card" + (grande ? " card--grande" : "");
    el.dataset.id = ativo.id;

    var f = formatarValor(ativo);
    var serie = serieDoAtivo(ativo);
    var subiu = serie.length > 1 ? serie[serie.length - 1] >= serie[0] : true;
    if (ativo.inverso) subiu = !subiu;

    el.innerHTML =
      '<div class="card__topo">' +
        "<div>" +
          '<h4 class="card__nome">' + escapar(ativo.nome) + "</h4>" +
          '<div class="card__ticker">' + escapar(ativo.ticker) + "</div>" +
        "</div>" + seloHtml(ativo) +
      "</div>" +

      '<div class="card__meio">' +
        '<div class="card__valor">' +
          (f.prefixo ? '<span class="card__prefixo">' + f.prefixo + "</span> " : "") +
          "<span data-corpo>" + f.corpo + "</span>" +
          (f.sufixo ? '<span class="card__sufixo">' + escapar(f.sufixo) + "</span>" : "") +
        "</div>" +
        sparkline(serie, subiu, grande ? 108 : 88, grande ? 36 : 30) +
      "</div>" +

      '<div class="card__base">' +
        '<div class="metricas">' + metricasHtml(ativo) + "</div>" +
        '<button class="card__ajuda" type="button" aria-expanded="false" ' +
                'aria-label="O que é ' + escapar(ativo.nome) + '?">?</button>' +
      "</div>" +

      '<div class="card__explicacao" hidden>' + escapar(ativo.descricao) +
        (ativo.nota ? '<span class="card__nota">' + escapar(ativo.nota) + "</span>" : "") +
        '<span class="card__fonte">Fonte: ' + escapar(ativo.fonte || "—") + "</span>" +
      "</div>";

    var botao = el.querySelector(".card__ajuda");
    var caixa = el.querySelector(".card__explicacao");
    botao.addEventListener("click", function () {
      var aberto = !caixa.hidden;
      caixa.hidden = aberto;
      botao.setAttribute("aria-expanded", String(!aberto));
      botao.textContent = aberto ? "?" : "×";
    });

    cards.push({ el: el, ativo: ativo });
    return el;
  }

  /** Repinta um card depois que chega dado ao vivo. */
  function repintarPorId(id) {
    cards.filter(function (c) { return c.ativo.id === id; }).forEach(function (reg) {
      var el = reg.el, ativo = reg.ativo, grande = el.classList.contains("card--grande");

      el.querySelector("[data-corpo]").textContent = formatarValor(ativo).corpo;
      el.querySelector(".metricas").innerHTML = metricasHtml(ativo);

      var selo = el.querySelector("[data-selo]");
      selo.outerHTML = seloHtml(ativo);

      var serie = serieDoAtivo(ativo);
      var subiu = serie.length > 1 ? serie[serie.length - 1] >= serie[0] : true;
      if (ativo.inverso) subiu = !subiu;
      var novo = sparkline(serie, subiu, grande ? 108 : 88, grande ? 36 : 30);
      var antigo = el.querySelector(".grafico");
      if (antigo) antigo.outerHTML = novo;
      else if (novo) el.querySelector(".card__meio").insertAdjacentHTML("beforeend", novo);
    });
  }

  /* ====================================================================
     5. MONTAGEM DA PÁGINA
     ==================================================================== */

  function limpar(seletor) {
    Array.prototype.forEach.call(document.querySelectorAll(seletor), function (n) {
      n.innerHTML = "";
    });
  }

  function texto(id, valor) { var el = $(id); if (el) el.textContent = valor; }

  function montarAvisoExemplo(ativos) {
    var aviso = $("avisoExemplo");
    if (!aviso) return;
    var pendentes = ativos.filter(function (a) { return a.exemplo; });
    aviso.hidden = edicaoAtiva >= 0 || !pendentes.length;
    if (aviso.hidden) return;
    texto("qtdExemplo", pendentes.length);
    texto("listaExemplo", pendentes.map(function (a) { return a.ticker; }).join(", "));
  }

  function montarAgenda(ed) {
    var alvo = $("listaAgenda");
    if (!alvo) return;

    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var dias = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

    alvo.innerHTML = (ed.agenda || []).map(function (item) {
      var p = String(item.data).split("-");
      var d = new Date(+p[0], +p[1] - 1, +p[2]);
      var passado = edicaoAtiva < 0 && d < hoje;
      var href = linkSeguro(item.link);

      var miolo =
        '<span class="agenda__data">' + p[2] + "/" + p[1] +
          "<span>" + dias[d.getDay()] +
          // hora é opcional: só entra quando o horário foi confirmado na fonte.
          // Sem isso a linha mostrava "ter · undefined".
          (item.hora ? " · " + escapar(item.hora) : "") + "</span></span>" +
        '<span class="agenda__pais">' + escapar(item.pais) + "</span>" +
        '<span class="agenda__evento">' + escapar(item.evento) +
          (item.fonte ? '<span class="agenda__fonte">' + escapar(item.fonte) +
                        (href ? " ↗" : "") + "</span>" : "") +
        "</span>" +
        '<span class="agenda__rel agenda__rel--' + escapar(item.relevancia) + '">' +
          (item.relevancia === "alta" ? "alta" : "média") + "</span>";

      var linha = href
        ? '<a class="agenda__linha" href="' + href + '" target="_blank" rel="noopener noreferrer" ' +
          'title="Abrir na fonte oficial: ' + escapar(item.fonte || href) + '">' + miolo + "</a>"
        : '<div class="agenda__linha agenda__linha--sem-link">' + miolo + "</div>";

      return '<li class="agenda__item' + (passado ? " agenda__item--passado" : "") + '">' +
             linha + "</li>";
    }).join("");

    var cal = $("listaCalendarios");
    if (cal) {
      var lista = (ed.calendarios || []).filter(function (c) { return linkSeguro(c.link); });
      cal.innerHTML = lista.length
        ? '<span class="calendarios__rot">Calendários completos</span>' +
          lista.map(function (c) {
            return '<a href="' + linkSeguro(c.link) + '" target="_blank" rel="noopener noreferrer">' +
                   escapar(c.nome) + " ↗</a>";
          }).join("")
        : "";
    }

    var secao = $("agenda");
    if (secao) secao.hidden = !(ed.agenda || []).length;
  }

  function renderizar(ed) {
    cards = [];
    limpar("#cardsDestaque, .grade[data-grupo], #listaDestaques");

    texto("dataAtualizacao", dataBonita(ed.meta.atualizadoEm, true));
    texto("dataRelativa", dataRelativa(ed.meta.atualizadoEm));
    texto("rodapeData", dataBonita(ed.meta.atualizadoEm, true));
    texto("rodapeResponsavel", ed.meta.responsavel || "—");

    montarAvisoExemplo(ed.ativos);
    texto("resumoSemana", ed.resumo);

    var destaqueAlvo = $("cardsDestaque");
    if (destaqueAlvo) {
      ed.ativos.filter(function (a) { return a.destaque; }).slice(0, 6)
        .forEach(function (a) { destaqueAlvo.appendChild(montarCard(a, true)); });
    }

    var radarAlvo = $("listaDestaques");
    if (radarAlvo) {
      (ed.destaques || []).forEach(function (d) {
        var el = document.createElement("article");
        el.className = "destaque-item";
        el.dataset.tom = d.tom || "neutro";
        el.innerHTML = "<h3>" + escapar(d.titulo) + "</h3><p>" + escapar(d.texto) + "</p>";
        radarAlvo.appendChild(el);
      });
      $("radar").hidden = !(ed.destaques || []).length;
    }

    Array.prototype.forEach.call(document.querySelectorAll(".grade[data-grupo]"), function (grade) {
      var doGrupo = ed.ativos.filter(function (a) { return a.grupo === grade.dataset.grupo; });
      doGrupo.forEach(function (a) { grade.appendChild(montarCard(a, false)); });
      var titulo = grade.previousElementSibling;
      grade.hidden = !doGrupo.length;
      if (titulo && titulo.classList.contains("grupo__titulo")) titulo.hidden = !doGrupo.length;
    });

    montarAgenda(ed);
  }

  function montarGlossario() {
    var alvo = $("listaGlossario");
    if (!alvo) return;
    (RADAR.glossario || []).forEach(function (g) {
      var d = document.createElement("details");
      d.innerHTML = "<summary>" + escapar(g.termo) + "</summary><p>" + escapar(g.texto) + "</p>";
      alvo.appendChild(d);
    });
  }

  /* ====================================================================
     6. PÁGINA DE HISTÓRICO
     ==================================================================== */

  function trocarEdicao(indice) {
    edicaoAtiva = indice;
    renderizar(edicao(indice));

    $("conteudoEdicao").hidden = false;
    texto("faixaEdicaoData", dataBonita(HIST[indice].atualizadoEm, true));

    var seletor = $("seletorEdicao");
    if (seletor) seletor.value = String(indice);

    Array.prototype.forEach.call(document.querySelectorAll(".edicao-item"), function (li) {
      li.classList.toggle("edicao-item--ativa", +li.dataset.indice === indice);
    });

    try {
      history.replaceState(null, "", "?e=" + indice);
    } catch (e) { /* navegador antigo: segue sem atualizar a URL */ }
  }

  function iniciarHistorico() {
    var lista = $("listaHistorico");

    if (!HIST.length) {
      lista.outerHTML =
        '<div class="vazio">' +
          "<p><strong>Nenhuma edição arquivada ainda.</strong></p>" +
          "<p>A primeira edição vai para o arquivo quando a próxima for fechada. " +
          "Isso acontece sozinho no comando <code>/atualizar-radar</code>, que roda " +
          "<code>ferramentas/arquivar.mjs</code> antes de trocar os números.</p>" +
          "<p>A partir daí esta página vira a linha do tempo do site: dá para reabrir " +
          "qualquer semana passada, cada edição ganha também um arquivo congelado em " +
          "<code>historico/AAAA-MM-DD.html</code>, os mini-gráficos dos cards começam " +
          "a ser desenhados e cada card ganha a variação desde a edição anterior.</p>" +
          '<p><a class="rodape__link" href="index.html">← Voltar ao radar da semana</a></p>' +
        "</div>";
      texto("dataAtualizacao", "—");
      return;
    }

    // Linha do tempo
    lista.innerHTML = HIST.map(function (e, i) {
      return '<li class="edicao-item" data-indice="' + i + '">' +
               '<div class="edicao-item__marca"></div>' +
               '<div class="edicao-item__corpo">' +
                 '<div class="edicao-item__topo">' +
                   '<strong class="edicao-item__data">' + dataBonita(e.atualizadoEm, true) + "</strong>" +
                   '<span class="edicao-item__meta">' + (e.ativos || []).length + " ativos · " +
                     escapar(e.responsavel || "—") + "</span>" +
                 "</div>" +
                 (e.resumo ? "<p>" + escapar(e.resumo) + "</p>" : "") +
                 '<div class="edicao-item__acoes">' +
                   '<button type="button" class="edicao-item__btn">Ver esta edição</button>' +
                   (e.arquivo && /^[\w./-]+\.html$/.test(e.arquivo)
                     ? '<a class="edicao-item__btn edicao-item__btn--pagina" href="' +
                       escapar(e.arquivo) + '" title="Abre o arquivo congelado daquele dia, ' +
                       'exatamente como a página estava">Abrir a página daquele dia &rarr;</a>'
                     : "") +
                 "</div>" +
               "</div>" +
             "</li>";
    }).join("");

    Array.prototype.forEach.call(lista.querySelectorAll(".edicao-item__btn"), function (b) {
      b.addEventListener("click", function () {
        trocarEdicao(parseInt(b.closest(".edicao-item").dataset.indice, 10));
        $("conteudoEdicao").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // Seletor no topo
    var caixa = $("caixaEdicao"), seletor = $("seletorEdicao");
    caixa.hidden = false;
    seletor.innerHTML = HIST.map(function (e, i) {
      return '<option value="' + i + '">' + dataBonita(e.atualizadoEm) + "</option>";
    }).join("");
    seletor.addEventListener("change", function () {
      trocarEdicao(parseInt(seletor.value, 10));
    });

    // Edição inicial: a do ?e= da URL, ou a mais recente
    var pedida = parseInt((location.search.match(/[?&]e=(\d+)/) || [])[1], 10);
    trocarEdicao(isFinite(pedida) && pedida >= 0 && pedida < HIST.length ? pedida : 0);
  }

  /* ====================================================================
     7. CONTROLES (tema, navegação)
     ==================================================================== */

  function ligarTema() {
    var raiz = document.documentElement;
    var salvo = localStorage.getItem("radar:tema");
    if (salvo) raiz.dataset.tema = salvo;
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches)
      raiz.dataset.tema = "claro";

    $("btnTema").addEventListener("click", function () {
      var novo = raiz.dataset.tema === "claro" ? "escuro" : "claro";
      raiz.dataset.tema = novo;
      localStorage.setItem("radar:tema", novo);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", novo === "claro" ? "#f5f7fb" : "#0b0f17");
    });
  }

  function ajustarAlturaTopo() {
    document.documentElement.style.setProperty(
      "--topo-alt", document.querySelector(".topo").offsetHeight + "px");
  }

  function ligarNavegacao() {
    var links = document.querySelectorAll("#navLinks a");
    var mapa = {};
    Array.prototype.forEach.call(links, function (a) {
      var href = a.getAttribute("href");
      if (href && href.charAt(0) === "#") mapa[href.slice(1)] = a;   // ignora links de página
    });

    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          var a = mapa[e.target.id];
          if (!a || !e.isIntersecting) return;
          Array.prototype.forEach.call(links, function (o) { o.classList.remove("ativo"); });
          a.classList.add("ativo");
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(mapa).forEach(function (id) {
        var s = $(id);
        if (s) obs.observe(s);
      });
    }

    var btn = $("btnTopo");
    window.addEventListener("scroll", function () {
      btn.classList.toggle("visivel", window.scrollY > 700);
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ====================================================================
     8. DADOS AO VIVO (APIs públicas, sem cadastro)
     • AwesomeAPI          → dólar, euro e criptomoedas
     • Banco Central (SGS) → Selic, CDI, IPCA e IGP-M
     Se qualquer chamada falhar, fica valendo o valor de dados.js.
     ==================================================================== */

  function chipDados(texto, ok) {
    var alvo = $("statusDados");
    if (!alvo) return;
    var el = document.createElement("span");
    el.className = "mercado" + (ok ? " mercado--aberto" : "");
    el.innerHTML = '<span class="mercado__bolinha"></span>' + texto;
    alvo.appendChild(el);
  }

  function jsonComTimeout(url, ms) {
    var ctrl = ("AbortController" in window) ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms || 9000);
    return fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .finally(function () { clearTimeout(t); });
  }

  function amostrar(serie, quantos) {
    if (serie.length <= quantos) return serie.slice();
    var passo = (serie.length - 1) / (quantos - 1), fora = [];
    for (var i = 0; i < quantos; i++) fora.push(serie[Math.round(i * passo)]);
    return fora;
  }

  /* Pontos = [{ data: Date, valor: Number }]. Cada série pública tem uma
     frequência e uma ordem próprias, então comparamos por DATA, nunca por
     posição no array. */
  function aplicarSerie(ativo, pontos) {
    var hoje = new Date(); hoje.setHours(23, 59, 59, 999);
    pontos = pontos
      .filter(function (p) {
        return p.data instanceof Date && !isNaN(p.data) && isFinite(p.valor) && p.data <= hoje;
      })
      .sort(function (a, b) { return a.data - b.data; });
    if (!pontos.length) return false;

    var ult = pontos[pontos.length - 1];
    var limite = new Date(ult.data.getTime() - 365 * 86400000);
    var haUmAno = null;
    for (var i = pontos.length - 1; i >= 0; i--) {
      if (pontos[i].data <= limite) { haUmAno = pontos[i].valor; break; }
    }
    // Se a série não chega a 365 dias, usa o ponto mais antigo — desde que
    // cubra pelo menos 300 dias, senão não daria para chamar de "12 meses".
    if (haUmAno === null) {
      if ((ult.data - pontos[0].data) / 86400000 >= 300) haUmAno = pontos[0].valor;
    }

    ativo.valor = ult.valor;
    ativo.variacao12m = calcularVariacao(ult.valor, haUmAno, ativo.formato);
    ativo._serieAoVivo = amostrar(pontos.map(function (p) { return p.valor; }), 12);
    ativo.aoVivoOk = true;
    delete ativo.exemplo;
    return true;
  }

  /* --- AwesomeAPI: moedas e criptomoedas --- */
  function buscarMoedas() {
    var pares = RADAR.ativos
      .filter(function (a) { return /^moeda-/.test(a.aoVivo || ""); })
      .map(function (a) { return { id: a.id, par: a.aoVivo.slice(6) + "-BRL" }; });

    return Promise.all(pares.map(function (p) {
      return jsonComTimeout("https://economia.awesomeapi.com.br/json/daily/" + p.par + "/400")
        .then(function (lista) {
          var ativo = definicao(p.id);
          if (!ativo || !Array.isArray(lista) || !lista.length) return false;
          var ok = aplicarSerie(ativo, lista.map(function (d) {
            return { data: new Date(parseInt(d.timestamp, 10) * 1000), valor: parseFloat(d.bid) };
          }));
          if (ok) repintarPorId(p.id);
          return ok;
        })
        .catch(function () { return false; });
    })).then(function (r) { return r.some(Boolean); });
  }

  /* --- Banco Central (SGS) ---
     O endpoint "ultimos/N" tem um teto baixo e devolve os registros em ordens
     diferentes conforme a série — por isso usamos o intervalo de datas. */
  function ddmmaaaa(d) {
    return String(d.getDate()).padStart(2, "0") + "/" +
           String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
  }

  function sgs(codigo, diasAtras) {
    var fim = new Date(), inicio = new Date(fim.getTime() - diasAtras * 86400000);
    return jsonComTimeout(
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs." + codigo + "/dados?formato=json" +
      "&dataInicial=" + ddmmaaaa(inicio) + "&dataFinal=" + ddmmaaaa(fim)
    ).then(function (lista) {
      return lista.map(function (d) {
        var p = String(d.data).split("/");
        return {
          data: new Date(+p[2], +p[1] - 1, +p[0]),
          valor: parseFloat(String(d.valor).replace(",", "."))
        };
      });
    });
  }

  function buscarMacro() {
    var tarefas = [];

    [["selic", 432, 400], ["cdi", 4389, 400],
     ["ipca12", 13522, 800], ["ipcaMes", 433, 800]].forEach(function (t) {
      tarefas.push(sgs(t[1], t[2]).then(function (pontos) {
        var ativo = definicao(t[0]);
        if (!ativo) return false;
        var ok = aplicarSerie(ativo, pontos);
        if (ok) repintarPorId(t[0]);
        return ok;
      }).catch(function () { return false; }));
    });

    // IGP-M: a série 189 é mensal. Compomos os 12 meses de cada ponto para
    // chegar ao acumulado em 12 meses, que é o número que o mercado cita.
    tarefas.push(sgs(189, 1200).then(function (mensal) {
      var ativo = definicao("igpm");
      if (!ativo || mensal.length < 13) return false;
      mensal.sort(function (a, b) { return a.data - b.data; });
      var acumulada = [];
      for (var fim = 11; fim < mensal.length; fim++) {
        var fator = 1;
        for (var i = fim - 11; i <= fim; i++) fator *= (1 + mensal[i].valor / 100);
        acumulada.push({ data: mensal[fim].data, valor: (fator - 1) * 100 });
      }
      var ok = aplicarSerie(ativo, acumulada);
      if (ok) repintarPorId("igpm");
      return ok;
    }).catch(function () { return false; }));

    return Promise.all(tarefas).then(function (r) { return r.some(Boolean); });
  }

  function atualizarAoVivo() {
    if (location.protocol === "file:") {
      chipDados("Dados ao vivo: abra o site por um servidor", false);
      return;
    }
    Promise.all([buscarMoedas(), buscarMacro()]).then(function (r) {
      if (r[0] && r[1]) chipDados("Câmbio, cripto e juros <strong>ao vivo</strong>", true);
      else if (r[0] || r[1]) chipDados("Parte dos dados <strong>ao vivo</strong>", true);
      else chipDados("Dados ao vivo indisponíveis agora", false);
      montarAvisoExemplo(RADAR.ativos);
    });
  }

  /* ====================================================================
     10. INÍCIO
     ==================================================================== */

  function iniciar() {
    if (typeof RADAR === "undefined") {
      $("conteudo").innerHTML = '<div class="container"><p class="vazio">' +
        "Não foi possível carregar <code>js/dados.js</code>.</p></div>";
      return;
    }
    ligarTema();

    if (PAGINA === "historico") {
      iniciarHistorico();
    } else {
      renderizar(RADAR);
      montarGlossario();
      if (PAGINA === "arquivo") {
        // Edição congelada (historico/AAAA-MM-DD.html): os números são do dia
        // em que ela esteve no ar. Buscar dado novo aqui estragaria o arquivo.
        chipDados("Valores congelados nesta edição", false);
      } else {
        var badge = $("qtdEdicoes");
        if (badge && HIST.length) { badge.textContent = HIST.length; badge.hidden = false; }
        atualizarAoVivo();
      }
    }

    ligarNavegacao();
    ajustarAlturaTopo();
    window.addEventListener("resize", ajustarAlturaTopo);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
