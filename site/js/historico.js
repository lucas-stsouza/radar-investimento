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

  // o arquivar.mjs insere as edições aqui, a mais recente primeiro

];
