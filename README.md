# Radar de Investimentos

Site estático com o panorama semanal do mercado financeiro nacional e
internacional. Feito para quem entra uma vez por semana e quer bater o olho: a
estrutura nunca muda de lugar, só os números.

No ar em <https://d2ozvuv8754sun.cloudfront.net> · repositório
<https://github.com/lucas-stsouza/radar-investimento> (público, branch `main`).

Sem build, sem dependências, sem npm. As ferramentas rodam com o Node que você
já tem instalado.

---

## A regra que não se quebra

**Nenhum número entra no site sem estar confirmado na fonte, agora.**

Os valores vêm exclusivamente do `ferramentas/coletar.mjs`. Nunca digite uma
cotação de memória, nunca estime, nunca arredonde para um valor plausível. O
que a coleta não confirmar mantém o valor da semana anterior e é reportado como
pendência, ou é marcado com `exemplo: true` no `dados.js` — o que faz o ativo
aparecer na tarja amarela do topo.

O selo **"Feito com IA"** no cabeçalho só se sustenta por causa dessa regra: a
edição é montada com auxílio de IA, mas os números não saem do modelo.

As outras três premissas:

- **A estrutura da página está pronta e não muda.** Toda alteração semanal é
  só de conteúdo. Não redesenhar, não "melhorar" a marcação por conta própria.
- **Rotação semanal aos domingos, 08:00 (America/Sao_Paulo).** O `index.html`
  no ar é arquivado com o nome do período em que esteve publicado; a edição
  nova sempre se chama `index.html`.
- **Nada é apagado do bucket.** A publicação sobrescreve os arquivos da semana;
  o histórico já publicado permanece.

---

## Estrutura da pasta

```
Investimentos/
├── .claude/
│   ├── launch.json                 preview local na porta 5599
│   └── skills/atualizar-radar/     o comando /atualizar-radar
├── .github/workflows/deploy.yml    publica no S3 a cada push na main
├── ferramentas/
│   ├── coletar.mjs                 busca os 55 ativos nas fontes reais
│   └── arquivar.mjs                congela a edição que está no ar
├── site/                           ← isto, e só isto, vai para o bucket
│   ├── index.html                  a edição da semana
│   ├── historico.html              a linha do tempo das edições
│   ├── historico/*.html            cada semana congelada, autocontida
│   ├── css/style.css               visual de todas as páginas
│   └── js/
│       ├── dados.js                a edição atual  ← muda toda semana
│       ├── historico.js            o índice das edições anteriores
│       └── app.js                  motor (modos radar / historico / arquivo)
└── README.md                       este arquivo
```

A pasta `site/` é exatamente o conteúdo do bucket, na mesma hierarquia. Não
existe passo de build: o que está em `site/` é o que é publicado. Tudo o que
está fora dela — `.claude/`, `ferramentas/`, `.git/`, este README — são
arquivos de trabalho e **nunca** sobem.

São **duas páginas vivas**. O radar mostra só a semana atual — quem abre uma vez
por semana vê o que mudou e vai embora. O arquivo das semanas passadas fica em
`historico.html`, a um clique no botão **Histórico** do topo.

Além disso, cada semana que sai do ar vira um **arquivo congelado** em
`site/historico/`, com o nome do período em que aquela edição esteve na página
inicial. Esse arquivo é autocontido: CSS, dados e script vão embutidos nele.
Abre igualzinho daqui a anos, offline, mesmo que o resto do site mude.

---

## Como rodar

**Não abra o `index.html` com dois cliques.** Pelo protocolo `file://` o
navegador bloqueia as chamadas às APIs e você perde os dados ao vivo (o site
ainda funciona, mas só com os valores do `dados.js`).

Suba um servidor local na pasta:

```bash
python -m http.server 5599 --directory site
```

E abra <http://localhost:5599>. É o que a entrada `radar` do
`.claude/launch.json` faz.

---

## A rotina semanal

```
/atualizar-radar
```

O comando executa, em ordem:

1. **Arquiva** a edição no ar → `site/historico/<período>.html` + entrada no
   `site/js/historico.js`;
2. **Coleta** os 55 ativos nas fontes reais e reescreve `valor`,
   `variacao12m`, `dy` e a data no `site/js/dados.js`;
3. **Pede o texto da semana** — resumo, destaques, agenda e as fontes do
   rodapé, a única parte que depende de apuração humana;
4. **Verifica** no navegador e mostra o que mudou;
5. Faz o commit na `main` → o GitHub Actions publica no S3 e limpa o cache.

O passo a passo detalhado, com as regras de checagem, está em
`.claude/skills/atualizar-radar/SKILL.md`.

### Rodando as ferramentas na mão

```bash
node ferramentas/arquivar.mjs               # congela a edição no ar
node ferramentas/coletar.mjs                # mostra os números, sem gravar
node ferramentas/coletar.mjs --escrever     # grava no site/js/dados.js
```

O `coletar.mjs` imprime um relatório com três blocos: confirmados, parciais
(veio o valor mas não a variação de 12 meses — caso do IFIX, SMLL e IDIV) e não
confirmados. **O que não é confirmado não é escrito**: o ativo mantém o valor
anterior e aparece na lista, para você decidir. Nenhum número é estimado.

Se o `arquivar.mjs` avisar que o arquivo do período já existe, **não use
`--forcar` por conta própria**: quase sempre significa que a data em `dados.js`
não foi atualizada na semana passada. Investigue primeiro.

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
delas remonta a página inteira daquela semana.

### O que dá para fazer na página

- **Botão "Histórico"**, no topo à direita, leva para `historico.html`. O
  contador ao lado mostra quantas edições já estão arquivadas.
- Dentro do histórico, o **seletor "Edição"** troca de semana sem recarregar, e
  a URL guarda a escolha (`historico.html?e=1`) — dá para mandar o link de uma
  semana específica para alguém.
- **Botão `?`** em cada card abre uma explicação de uma linha, observações e a
  fonte do dado.
- **Cada linha da agenda** é um link para quem divulga o dado.
- **Tema claro/escuro** no canto superior direito, salvo no navegador.
- **Selo de cada card** diz de onde veio o número: `ao vivo` (API, agora),
  `edição` (o que você digitou) ou `exemplo` (ainda não conferido).

### Os três números de cada card

| Chip | O que é | De onde vem |
|---|---|---|
| **12m** | Variação em 12 meses | `variacao12m` no `dados.js`, ou calculado pela API |
| **vs. dd/mm** | Variação desde a edição anterior | **calculado sozinho** a partir do `historico.js` |
| **DY** | Dividend yield de 12 meses | `dy` no `dados.js` (opcional) |

O mini-gráfico também é automático: é desenhado com os valores das edições
guardadas no `historico.js` (ou com a série da API, nos indicadores ao vivo).
Quanto mais semanas você arquivar, mais completo ele fica. Não existe campo de
histórico para preencher à mão.

---

## De onde vem cada número

| Grupo | Fonte |
|---|---|
| Ibovespa, IFIX, SMLL, IDIV, índices dos EUA, ações BR e EUA, BDRs, FIIs, ETFs, commodities | Yahoo Finance (chart API) |
| Selic, CDI, IPCA (mês e 12m), IGP-M 12m | Banco Central, séries SGS (432, 4389, 433, 13522, 189) |
| Dólar, euro e as 7 criptomoedas | [AwesomeAPI](https://docs.awesomeapi.com.br/) |
| Dividend yield | proventos dos últimos 12 meses ÷ preço atual |

**Dados ao vivo** (se atualizam sozinhos a cada visita, sem cadastro): dólar,
euro, as 7 criptomoedas, Selic, CDI, IPCA e IGP-M. Se qualquer chamada falhar,
o site cai silenciosamente no valor do `dados.js`. Nada quebra.

Índices de bolsa, ações, FIIs e commodities não têm API que funcione direto do
navegador (o CORS bloqueia). Eles ficam parados no `dados.js` entre uma edição e
outra — mas o `coletar.mjs` os busca de verdade toda semana, porque roda no Node
e não sofre essa restrição.

### Ligar mais dados ao vivo (opcional)

Para automatizar Ibovespa, FIIs e ações no navegador, o caminho mais curto é a
[brapi.dev](https://brapi.dev) — cobre B3 e ações americanas, tem plano
gratuito, mas exige token. Em `site/js/app.js`, na seção *9. Dados ao vivo*, já
existe o encaixe pronto: escreva uma função nos moldes de `buscarCambio()` que
monte a lista de pontos `{ data, valor }`, chame `aplicarSerie(ativo, pontos)` e
depois `repintarPorId(id)`. Formatação, cores, gráfico e o selo `ao vivo`
acontecem sozinhos.

Atenção: um token em site estático fica visível para quem abrir o código-fonte.
Se isso for um problema, coloque um proxy simples na frente.

---

## Editando o `site/js/dados.js`

### O que é escrito à mão

Só o texto: `resumo`, `destaques`, `agenda` e as `fontes` do rodapé. É o que
transforma uma tabela de números em uma leitura de cinco minutos — e é
justamente o que não dá para automatizar sem correr o risco de inventar causa
para movimento de preço.

### Campos que valem conhecer

| Campo | Para que serve |
|---|---|
| `formato` | `"pontos"`, `"brl"` (R$), `"usd"` (US$) ou `"percentual"` (%) |
| `casas` | Casas decimais. Padrão: 2 (ou 0 acima de 10 mil). O câmbio usa 4 |
| `sufixo` | Texto miúdo depois do valor: `"a.a."`, `"/barril"`, `"/onça"` |
| `nota` | Observação extra que aparece dentro do botão `?` |
| `destaque: true` | Promove o ativo para os cards grandes do Panorama (máximo 6) |
| `inverso: true` | Inverte as cores: subir vira vermelho. Ligado no VIX e nos índices de inflação |
| `exemplo: true` | Marca o número como ainda não conferido |
| `grupo` | Em qual grade o card cai |

Grupos disponíveis: `br-indices`, `br-macro`, `cambio`, `br-fiis`, `br-acoes`,
`cripto`, `int-indices`, `int-etfs`, `int-acoes`, `commodities`.

### Adicionar um ativo novo

Copie um bloco existente, troque `id` (precisa ser único), `nome`, `ticker` e
escolha o `grupo`; acrescente uma linha no `MAPA` do `coletar.mjs`. O card
aparece sozinho, na grade certa, nas duas páginas. Não precisa mexer no HTML.

Para outra criptomoeda, confira antes se o par existe em
<https://economia.awesomeapi.com.br/json/available>. Se aparecer, por exemplo,
`ADA-BRL`, copie um bloco do grupo `cripto` e use `aoVivo: "moeda-ADA"` — a
cotação passa a vir sozinha.

### A tarja amarela do topo

Rede de segurança. Se algum ativo levar `exemplo: true`, o topo do site lista
quais são e o card ganha o selo `exemplo`. Quando não sobra nenhum, a tarja some
sozinha — não tem interruptor global para lembrar de desligar.

Hoje **nenhum ativo está marcado**: os 55 foram confirmados na fonte.

> Duas descrições ainda pedem revisão: **PLAG11** e **GARE11**, onde o segmento
> do fundo não está confirmado. Elas têm uma `nota` avisando isso no botão `?`.

### Os links da agenda

Cada linha aponta para a página **oficial** de quem divulga o dado — nada de
agregador, portal de notícia ou blog. Cada item precisa de `data`, `hora`,
`pais` (`BR`/`EUA`/`GLB`), `evento`, `relevancia` (`alta`/`media`), `fonte` e
`link` (só `http://` ou `https://`; o site ignora qualquer outra coisa).

| Fonte | Onde conferir |
|---|---|
| IBGE (IPCA, IPCA-15, PIB) | <https://www.ibge.gov.br/calendario-divulgacoes-novoportal.html> |
| Banco Central (estatísticas) | <https://www.bcb.gov.br/estatisticas/calendarioestatisticas> |
| Copom | <https://www.bcb.gov.br/controleinflacao/copom> |
| FGV IBRE (IGP-M) | <https://portalibre.fgv.br/igp> |
| Federal Reserve | <https://www.federalreserve.gov/newsevents/calendar.htm> |
| BLS (CPI, payroll) | <https://www.bls.gov/schedule/news_release/> |
| US Dept. of Labor (jobless) | <https://oui.doleta.gov/unemploy/claims.asp> |
| BEA (PCE) | <https://www.bea.gov/data/personal-consumption-expenditures-price-index> |
| S&P Global (PMI) | <https://www.pmi.spglobal.com/> |

Melhor uma agenda curta e certa do que longa e chutada.

---

## Publicação — S3 + CloudFront

| Item | Valor |
|---|---|
| Conta AWS | `706394914754` (usuário IAM `lucas`) |
| Bucket S3 | `investimento.bloglm.com.br` |
| Região do bucket | `us-east-2` (Ohio) |
| Distribuição CloudFront | `E1AKI0YMNC0GKL` |
| Domínio CloudFront | `d2ozvuv8754sun.cloudfront.net` |
| Default root object | `index.html` |
| Block public access | ligado — bucket privado, só o CloudFront lê (OAC) |
| Domínio final pretendido | `investimento.bloglm.com.br` — pendente |

O que sobe é o **conteúdo de `site/`, na raiz do bucket**, mantendo a
hierarquia. Nada mais.

### Publicação automática (GitHub Actions)

O arquivo `.github/workflows/deploy.yml` publica a cada push na `main`, e também
sob demanda pelo botão *Run workflow* na aba Actions. Ele valida o JavaScript com `node
--check`, pega uma credencial temporária da AWS via OIDC, sincroniza o bucket,
cria a invalidação `/*` no CloudFront, espera ela terminar e confere que a raiz
responde HTTP 200.

Os `aws s3 sync` **não usam `--delete`**: o histórico já publicado permanece
intacto, só os arquivos da semana são sobrescritos. CSS e JS vão com
`max-age=3600`; os HTML vão com `no-cache`, para o navegador sempre revalidar a
edição da semana.

#### Configuração inicial na AWS (uma vez só)

A autenticação é por **OIDC**: o GitHub troca um token de identidade por uma
credencial temporária. Não existe access key para vazar — o que importa num
repositório público.

**1. Identity Provider** — IAM → Identity providers → Add provider → OpenID
Connect. Provider URL `https://token.actions.githubusercontent.com`, audience
`sts.amazonaws.com`.

**2. Role** — IAM → Roles → Create role → Custom trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::706394914754:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:lucas-stsouza@195336924/radar-investimento@1347947121:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

Aquele `sub` é a trava: **só** workflows rodando na `main` **desse** repositório
conseguem assumir a role. Um fork ou outra branch não consegue.

> **Atenção ao formato do `sub`.** O GitHub usa *immutable subject claims*: o
> `sub` do token não vem como `repo:dono/repo:...`, e sim com os **IDs
> numéricos** anexados — `repo:lucas-stsouza@195336924/radar-investimento@1347947121:...`
> (195336924 = ID da conta, 1347947121 = ID do repositório). Os IDs nunca mudam,
> nem se você renomear a conta ou o repositório, o que é justamente a vantagem:
> um rename não transfere a confiança para quem tomar o nome antigo.
>
> Uma trust policy escrita no formato antigo falha com
> `Not authorized to perform sts:AssumeRoleWithWebIdentity` — a mesma mensagem
> genérica de ARN errado ou audience errado, o que torna o diagnóstico confuso.
> Para descobrir o `sub` real de qualquer repositório, o caminho mais rápido é:
>
> ```bash
> curl -s https://api.github.com/repos/DONO/REPO | grep -E '"id"|"login"'
> ```

**3. Permissão da role** — policy inline:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SincronizarSite",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::investimento.bloglm.com.br",
        "arn:aws:s3:::investimento.bloglm.com.br/*"
      ]
    },
    {
      "Sid": "InvalidarCache",
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"],
      "Resource": "arn:aws:cloudfront::706394914754:distribution/E1AKI0YMNC0GKL"
    }
  ]
}
```

Não há `s3:DeleteObject` — coerente com a decisão de nunca apagar nada do
bucket. Dê à role um nome reconhecível (`github-actions-radar-deploy`) e
**copie o ARN**.

**4. Secret no GitHub** — Settings → Secrets and variables → Actions → New
repository secret. Name `AWS_ROLE_ARN`, valor
`arn:aws:iam::706394914754:role/github-actions-radar-deploy`.

**5. Testar** — aba Actions → workflow "Publicar no S3" → Run workflow.

#### Quando algo falhar

| Erro no log | Causa |
|---|---|
| `Not authorized to perform sts:AssumeRoleWithWebIdentity` | o `sub` da trust policy não bate (veja o aviso sobre os IDs numéricos acima), o secret `AWS_ROLE_ARN` está errado, ou o audience do provedor não é `sts.amazonaws.com`. A mensagem é a mesma nos três casos |
| `AccessDenied` no `s3 sync` | a policy da role não cobre o bucket |
| `AccessDenied` no `create-invalidation` | falta a permissão de CloudFront, ou o ID da distribuição está errado |
| o passo final acusa HTTP diferente de 200 | o site subiu mas não está sendo servido — veja o diagnóstico abaixo |

### Publicação manual (plano B)

Pelo console: S3 → bucket → Upload → *Add files* (`index.html`,
`historico.html`) e *Add folder* (`css`, `js`, e `historico` se existir) — todos
de dentro de `site/`. Depois CloudFront → `E1AKI0YMNC0GKL` → Invalidations →
Create invalidation → `/*`.

Com o AWS CLI configurado:

```bash
aws s3 sync site/ s3://investimento.bloglm.com.br/ --exclude "*.html" --cache-control "public, max-age=3600" --region us-east-2
```

```bash
aws s3 sync site/ s3://investimento.bloglm.com.br/ --exclude "*" --include "*.html" --cache-control "no-cache" --region us-east-2
```

```bash
aws cloudfront create-invalidation --distribution-id E1AKI0YMNC0GKL --paths "/*"
```

### Diagnóstico: CloudFront devolvendo AccessDenied

O erro vem do S3 e é repassado pelo CloudFront. Três causas, na ordem:

**1. O bucket está vazio.** O S3 responde `AccessDenied` em vez de `NoSuchKey`
porque quem pede não tem `s3:ListBucket` — o erro esconde a diferença entre "não
existe" e "não posso ver". Confira se os objetos estão lá.

**2. Falta o "Default root object".** CloudFront → `E1AKI0YMNC0GKL` → General →
Settings → Edit → **Default root object** = `index.html`. Sem ele, abrir `/` faz
o CloudFront pedir uma chave vazia ao S3. O sintoma é característico:
`/index.html` funciona e `/` não. *(Foi exatamente isso em 30/08/2026 — já
resolvido.)*

**3. A política do bucket não autoriza o CloudFront.** Com Origin Access
Control, o bucket precisa liberar `cloudfront.amazonaws.com` para aquela
distribuição:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::investimento.bloglm.com.br/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::706394914754:distribution/E1AKI0YMNC0GKL"
        }
      }
    }
  ]
}
```

**Mantenha o Block all public access ligado.** Com OAC o bucket continua privado
e só o CloudFront lê — é o arranjo correto. Tornar o bucket público faz o erro
sumir, mas expõe os arquivos a qualquer um.

---

## Estado atual e o que falta

Atualizado em **30/08/2026**.

✅ Site no ar em <https://d2ozvuv8754sun.cloudfront.net>, carregando completo,
com os selos "ao vivo" de câmbio, cripto e juros atualizando. Bucket criado e
populado, bucket policy com OAC correta, `Default root object` resolvido.

### 1. Deploy automático ✅ concluído

Ordem importa — o secret do GitHub depende da role existir.

- [x] **`.github/workflows/deploy.yml` escrito** — 8 passos: valida o JS, confere
      que o `site/` está completo, autentica por OIDC, sobe CSS/JS com
      `max-age=3600`, sobe os HTML com `no-cache`, invalida o CloudFront, espera
      a invalidação e confere que a raiz responde 200.
- [x] **AWS**: Identity Provider, Role `github-actions-radar-deploy` e policy
      `publicar-radar` criados.
- [x] **GitHub**: secret `AWS_ROLE_ARN` cadastrado.
- [x] **Testado e no ar em 30/08/2026.** Primeira publicação automática
      confirmada pelos cabeçalhos: `public, max-age=3600` no CSS/JS e
      `no-cache` nos HTML.

### 2. Domínio próprio

Lucas assumiu esta parte. Ordem obrigatória:

- [ ] Certificado no ACM **em `us-east-1`** para `investimento.bloglm.com.br`,
      validado por DNS. (O CloudFront só aceita certificado da Virgínia do
      Norte, mesmo com o bucket em Ohio.) Sem este passo, o próximo falha.
- [ ] Alternate domain name (CNAME) na distribuição, em General → Settings → Edit.
- [ ] Custom SSL certificate, na mesma tela, apontando para o certificado.
- [ ] CNAME no DNS do `bloglm.com.br`: `investimento` → `d2ozvuv8754sun.cloudfront.net`.

### 3. Nome do arquivo de histórico por período

- [ ] Ajustar `ferramentas/arquivar.mjs`: hoje grava
      `site/historico/AAAA-MM-DD.html` (uma data só). Precisa gravar o
      **intervalo** em que a edição esteve no ar, num formato que continue
      ordenável por data — ex.: `2026-08-23 a 2026-08-29.html`, exibido como
      "23-08 - 29-08".
- [ ] Ajustar o rótulo correspondente em `site/js/historico.js` e na
      `site/historico.html`, sem mexer na estrutura visual.
- [ ] Atualizar a `.claude/skills/atualizar-radar/SKILL.md`, que ainda descreve
      o formato antigo.

### 4. Fontes do rodapé por edição

- [ ] Hoje o bloco "Fontes" do rodapé está **fixo no HTML**. Pela premissa 4 ele
      precisa refletir as fontes que realmente alimentaram aquela edição — ou
      seja, vir de um campo novo em `site/js/dados.js` (algo como `meta.fontes`)
      e ser renderizado pelo `app.js`, como já acontece com `rodapeData` e
      `rodapeResponsavel`.
- [ ] Fazer o mesmo em `site/historico.html`, para os snapshots preservarem as
      fontes da edição deles.

### 5. Pendências menores

- [ ] `site/historico/` ainda não existe — nenhuma edição foi arquivada até
      agora. A primeira rodada do `arquivar.mjs` cria a pasta.
- [ ] O rodapé tem um título sem acentuação: "Como esta edicao e feita".
      Corrigir para "Como esta edição é feita".

---

## Aviso

Conteúdo informativo e educacional. Não é recomendação de compra ou venda de
qualquer ativo. Rentabilidade passada não garante rentabilidade futura.
