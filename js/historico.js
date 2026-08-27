/* ==========================================================================
   RADAR DE INVESTIMENTOS — ARQUIVO DE EDIÇÕES

   Aqui ficam guardadas as edições ANTERIORES do site: a data de cada uma, o
   resumo daquela semana e os valores de cada ativo.

   COMO ARQUIVAR A SEMANA QUE PASSOU
   ---------------------------------
   Antes de editar js/dados.js:
     1. Abra o site e aperte F12 para abrir o console do navegador.
     2. Digite  radarArquivar()  e dê Enter.
     3. O bloco pronto é copiado para a área de transferência (e também
        impresso no console). Cole logo abaixo do "[" aqui embaixo.
     4. Só então atualize o js/dados.js com os números novos.

   A edição MAIS RECENTE fica sempre no TOPO da lista.

   PARA QUE SERVE
   --------------
   • O seletor "Edição" no topo do site permite reabrir qualquer semana
     passada e ver a página exatamente como ela estava.
   • Os mini-gráficos dos cards são desenhados a partir destes valores —
     quanto mais edições você guardar, mais completo fica o gráfico.
   • Cada card ganha automaticamente a variação "vs. a edição anterior".
     Você não precisa calcular nada.

   FORMATO DE UMA EDIÇÃO
   ---------------------
   {
     atualizadoEm: "2026-08-19T18:30",     // data daquela edição
     responsavel:  "Equipe Radar",
     resumo:       "Texto de abertura daquela semana…",
     destaques:    [ { titulo, texto, tom } ],                    // opcional
     agenda:       [ { data, hora, pais, evento, relevancia } ],  // opcional
     ativos: [
       { id: "ibovespa", valor: 141200, variacao12m: 7.90 },
       { id: "mxrf11",   valor: 9.14,   variacao12m: 5.10, dy: 13.02 }
     ]
   }

   Só o "id" e o "valor" são obrigatórios em cada ativo. Nome, ticker e
   descrição vêm do js/dados.js — não precisa repetir aqui.
   ========================================================================== */

const RADAR_HISTORICO = [

  // ↓↓↓ cole aqui a saída de radarArquivar(), sempre no topo ↓↓↓

];
