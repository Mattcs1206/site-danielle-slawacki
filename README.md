# Site da Danielle Slawacki

Site institucional de **Danielle Slawacki** — Advogada Colaborativa e Mediadora (mediação, advocacia colaborativa e gerenciamento de conflitos familiares, societários, imobiliários e escolares).

**No ar em:** [slawacki.com.br](https://slawacki.com.br)

HTML, CSS e JavaScript puros, sem etapa de build. Os componentes de interface seguem o padrão do [shadcn/ui](https://ui.shadcn.com) (Button, Card, Badge, Tabs, Accordion, Dialog, Sheet, Tooltip, Progress, Alert, Table, Toast), recriados em CSS/JS puro com a paleta da marca.

## Páginas

- `index.html` — home: apresentação, formação, áreas de atuação, método, diagnóstico interativo (10 perguntas), dúvidas frequentes e contato
- `mediacao-familiar.html`, `mediacao-societaria.html`, `mediacao-imobiliaria.html`, `mediacao-escolar.html` — landing pages por área de atuação
- `mediacao-ou-processo-judicial.html` — guia comparativo
- `404.html` — página de erro

## Arquivos de apoio

- `ui.css` — design system (tokens e componentes)
- `ui.js` — comportamento dos componentes, diagnóstico, captura de origem (UTM) e eventos de conversão (`dataLayer`)
- Imagens: `danielle-hero.jpg`, `danielle-about.jpg`, `danielle-bridge-family.jpg`, `og-image.jpg` (compartilhamento), `favicon.svg`
- `danielle-bridge-family.png` — versão antiga da imagem (não é mais usada)

## SEO e GEO

- Títulos, descrições, canonical e Open Graph em todas as páginas
- Dados estruturados (JSON-LD): Attorney, Person, WebSite, Service, FAQPage, BreadcrumbList e Article
- Respostas diretas no topo das páginas e perguntas frequentes, pensadas para buscadores e mecanismos de IA
- `sitemap.xml`, `robots.txt` e `llms.txt`
- `_headers` — cabeçalhos de segurança e cache (Netlify)

## Campanhas e métricas

Links com parâmetros `utm_*`, `gclid` ou `fbclid` têm a origem registrada na sessão e incluída na mensagem de WhatsApp. Cliques em contato e conclusão do diagnóstico são enviados ao `window.dataLayer`, pronto para Google Tag Manager/GA4 quando forem configurados.

## Como atualizar

1. Edite os arquivos direto neste repositório (pelo GitHub web, ou clonando o repositório localmente).
2. Faça commit na branch `main`.
3. O deploy no Netlify é automático — o site atualizado fica no ar em 1 a 2 minutos.
