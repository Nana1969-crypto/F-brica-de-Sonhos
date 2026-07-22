# Orquestra Jovem da Fábrica de Sonhos

> **Onde os sonhos ganham som.**
> Um movimento cultural que forma adolescentes através da excelência artística.
> Nascida na Zona Norte de Porto Alegre, dentro do Instituto BZN — com identidade própria.

Este repositório contém a identidade digital da Orquestra Jovem: um site concebido
como uma **instituição cultural contemporânea**, não como um projeto social, escola
ou site institucional. A experiência foi desenhada para que o visitante sinta que
entrou em um teatro alguns minutos antes do concerto começar — silêncio, luz,
expectativa, elegância.

---

## Conceito

A frase-conceito **"Onde os sonhos ganham som"** governa cada decisão. A home é
estruturada como o **programa de um concerto**: uma abertura cinematográfica seguida
de movimentos (I a VII) que conduzem o visitante por uma narrativa emocional até a
conversão — assistir, matricular, patrocinar, doar, compartilhar. A origem na Zona
Norte não abre o site; ela é a **última revelação**, o contraste proposital.

## Sistema de marca

| Elemento | Escolha |
|----------|---------|
| Cor principal | Veludo `#6C2338` |
| Fundo | Marfim `#F5F1EA` |
| Texto / atos escuros | Carvão `#2B2623` |
| Apoios | Madeira `#8A5A3A`, Oliva `#6B7561` |
| Detalhe (uso raríssimo) | Bronze `#B98548` |
| Título | Cormorant Garamond |
| Texto / interface | Manrope |

Direção de arte: tipografia protagonista, muito espaço em branco, pouquíssimos
elementos gráficos, zero ícones decorativos. A **fotografia é a protagonista** —
sempre pessoas, nunca instrumentos isolados.

## Arquitetura de arquivos

```
.
├── index.html          # Estrutura semântica completa (uma home narrativa)
├── css/
│   └── main.css        # Tokens de design + 10 camadas organizadas
├── js/
│   └── main.js         # Vanilla, modular, acessível (zero dependências)
├── assets/
│   └── favicon.svg     # Monograma OJ
└── README.md
```

## Sistema fotográfico

Como as fotografias documentais reais dos adolescentes ainda não estão neste
repositório, cada área de imagem é uma **placa art-directed** (duotone quente +
grão de filme) que evoca a atmosfera correta e serve de *slot* para a foto real.

**Para inserir uma fotografia real**, localize o elemento com o atributo
`data-photo="..."` correspondente e aplique a imagem, por exemplo:

```css
.hero__slide[data-photo="ensaio-luz-quente"] {
  background-image:
    linear-gradient(to top, rgba(20,17,15,.85), rgba(20,17,15,.15)),
    url("../assets/fotos/ensaio-luz-quente.jpg");
}
```

O layout, o `alt`/`figcaption` e as proporções já estão preparados — a foto entra
sem tocar na estrutura.

## Qualidade técnica

- **Zero bibliotecas** — HTML, CSS e JavaScript puros.
- **Acessível** — HTML semântico, skip-link, foco visível, ARIA, contraste,
  `prefers-reduced-motion` respeitado em todas as animações.
- **SEO** — meta tags, Open Graph, dados estruturados JSON-LD (`PerformingGroup`).
- **Performance** — sem render-blocking desnecessário, `IntersectionObserver` para
  animações, imagens preparadas para `lazy`.
- **Responsivo** — mobile-first, breakpoints em 1080 / 820 / 520px.
- **Componentizado e preparado para crescimento.**

## Uso local

É um site estático. Basta abrir `index.html` no navegador, ou servir a pasta:

```bash
python3 -m http.server 8080
# acesse http://localhost:8080
```
