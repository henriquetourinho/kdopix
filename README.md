# 🚨 KD O PIX? - A Casa Caiu

![Status](https://img.shields.io/badge/STATUS-FORAGIDO-red?style=for-the-badge)
![Tech](https://img.shields.io/badge/TECH-TAILWIND%20%2B%20JS-blue?style=for-the-badge)
![Location](https://img.shields.io/badge/LOCAL-BAHIA-yellow?style=for-the-badge&labelColor=green)

> "A visão foi passada, o dinheiro não." 💸

## 📜 Sobre o Projeto

Este é um projeto de **sátira jornalística interativa** focado no escândalo do desvio de doações via Pix na Bahia. O site reproduz a estética caótica e alarmista de programas policiais sensacionalistas ("Cidade Alerta", "Balanço Geral") utilizando tecnologias web modernas para criar uma experiência imersiva de "denúncia".

**O objetivo é puramente humorístico e de protesto.**

**Desenvolvido por:** Carlos Henrique Tourinho Santana

---

## 🚓 Funcionalidades (Features)

* **🚨 Estética "Mundo Cão":** Cores vibrantes (Vermelho Sangue/Amarelo Alerta), fontes impactantes e animações de sirene.
* **💸 Chuva de Dinheiro:** Script JS otimizado para renderizar desvio de verba em tempo real na sua tela (limite de 15 notas simultâneas para não travar o celular).
* **📂 Dossiê Interativo:** Modal com dados reais (mas públicos) sobre o montante desviado e tipificações penais.
* **🔊 Sound Design:** Integração de áudio sensacionalista com botão de *mute/unmute* e autoplay (via interação do usuário).
* **📱 Responsividade:** Funciona em qualquer dispositivo, perfeito para espalhar em grupos de Zap.
* **♿ Acessível até para quem tá correndo da polícia:** Suporte a teclado, screen readers e reduced motion.
* **⚡ Performance:** Carrega mais rápido que o Pix desviado (FCP em 1.2s).

---

## 🛠️ Tecnologias Usadas

Desenvolvido com a *stack* mais leve possível para rodar até em celular apreendido:

* **HTML5 Semântico** (Para os bots da polícia indexarem).
* **Tailwind CSS (via CDN)** (Estilização rápida e suja, igual o esquema).
* **JavaScript (Vanilla)** (Sem framework pesado, apenas a lógica do crime).
* **CSS Animations** (Para as luzes de sirene e letreiros).
* **Font Awesome** (Ícones de algema e martelo do juiz).
* **Google Fonts** (Anton, Roboto Condensed, Special Elite).

---

## 🚀 Como Rodar

Não precisa de `npm install`, não precisa de `docker`, não precisa de nada. É só baixar e abrir.

### Método 1: Abrir Direto (Mais Rápido que Desviar um Pix)
1. Clone o repositório:
   ```bash
   git clone https://github.com/henriquetourinho/kdopix.git
   cd kdopix
   ```

2. Abra o arquivo `index.html` no seu navegador.

3. Aumente o volume.

### Método 2: Servidor Local (Para os Paranóicos)
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Acesse `http://localhost:8000`

---

## 📁 Estrutura do Projeto

```
kdopix/
├── index.html          # Página principal (o local do crime)
├── script.js           # JavaScript modular (a perícia técnica)
├── media/
│   ├── juca.webp      # Imagem principal
│   ├── kdopix.mp3     # Áudio inicial
│   ├── policia.mp3    # Loop de sirene
│   └── icon.png       # Favicon
├── robots.txt          # Para os bots da PF
├── sitemap.xml         # Mapa do crime
├── manifest.json       # PWA (Procurado Web App)
├── .htaccess           # Configurações Apache
├── README.md           # Este arquivo
└── CHANGELOG.md        # Histórico de versões
```

---

## ✨ Melhorias Técnicas (Versão 2.0)

### 🚀 Performance (+27 pontos no Lighthouse)

#### Otimização de Animações
- **Redução de elementos DOM:** Limite de 15 elementos de dinheiro simultâneos (antes: ilimitado = memory leak)
- **Intervalo otimizado:** Aumentado de 400ms para 800ms
- **Will-change CSS:** Aplicado para otimização de GPU
- **Cleanup automático:** Remoção adequada de elementos após animação

#### Carregamento Otimizado
- **Lazy loading do YouTube:** iframe carrega apenas quando modal é aberto
- **Preconnect DNS:** Conexões antecipadas para Google Fonts, CDNs e YouTube
- **Audio preload="none":** Áudio não carrega até interação do usuário
- **JavaScript modular:** Separado em arquivo externo (script.js)

#### Métricas de Performance

| Métrica | Antes (v1.0) | Depois (v2.0) | Melhoria |
|---------|--------------|---------------|----------|
| First Contentful Paint | ~2.5s | ~1.2s | **-52%** |
| Time to Interactive | ~4.0s | ~2.1s | **-47.5%** |
| Total Blocking Time | ~800ms | ~250ms | **-68.75%** |
| Lighthouse Score | ~65/100 | ~92/100 | **+27pts** |

**Resultado:** Carrega mais rápido que o dinheiro sumiu das contas.

---

### ♿ Acessibilidade (WCAG 2.1 Level AA) - Porque Até Réu Tem Direitos

#### Semântica HTML
- Tags semânticas apropriadas (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`)
- Headings hierárquicos (H1 → H2 → H3)
- Landmarks ARIA para navegação (até deficiente visual consegue ver o escândalo)

#### Navegação por Teclado
- Focus visível em todos elementos interativos (amarelo polícia)
- Modal fecha com tecla ESC (igual o Juca quando vê a PF)
- Ordem de tabulação lógica
- Trap de foco no modal (você não escapa igual eles não escaparam)

#### Screen Readers
- Atributos ARIA (`role`, `aria-label`, `aria-labelledby`, `aria-modal`)
- Textos alternativos descritivos
- Labels ocultos visualmente mas acessíveis (`sr-only`)
- Elementos decorativos com `aria-hidden="true"`

#### Contraste e Legibilidade
- Ratios de contraste WCAG AA/AAA
- Fontes responsivas e escaláveis
- Suporte a zoom até 200% (para ler os valores desviados de perto)

#### Reduced Motion (Para Quem Já Tá Passando Mal)
```css
@media (prefers-reduced-motion: reduce) {
    /* Animações desabilitadas ou reduzidas */
    /* Chuva de dinheiro desabilitada (igual na conta das vítimas) */
}
```

---

### 🔍 SEO - Para o Google Achar Antes da Justiça

#### Meta Tags Completas
- Open Graph (Facebook, LinkedIn) - compartilhe o escândalo
- Twitter Cards - trending topic garantido
- Canonical URL - URL única, igual deveria ser a conta bancária
- Structured Data (JSON-LD) - pros bots entenderem o esquema

#### Structured Data
```json
{
  "@type": "NewsArticle",
  "headline": "Escândalo do Pix na Bahia...",
  "author": {"@type": "Person", "name": "Carlos Henrique Tourinho Santana"}
}
```

#### Otimização
- Titles descritivos e únicos
- Meta descriptions otimizadas
- Keywords relevantes: "golpe", "pix", "bahia", "record"
- Alt text em todas imagens
- robots.txt e sitemap.xml incluídos

---

### 💻 Código Limpo - Diferente das Contas Bancárias

#### JavaScript Modular
- Separação de responsabilidades (cada função faz sua parte, diferente dos réus)
- Funções puras e reutilizáveis
- Gerenciamento de estado centralizado
- Cache de elementos DOM (performance++)
- Error handling adequado
- Comentários JSDoc

#### Organização do script.js
```javascript
// Estrutura
- Constants           // Configurações fixas
- State Management    // Estado da aplicação
- DOM Cache           // Elementos cacheados
- Utility Functions   // Funções auxiliares
- Audio Module        // Controle de som
- Modal Module        // Modal do dossiê
- Animation Module    // Chuva de dinheiro
- Event Listeners     // Eventos
- Initialization      // Inicialização
```

---

### 📱 Responsividade - Funciona Até no Celular do Presídio

- Mobile-First design
- Breakpoints otimizados
- Touch targets ≥ 44x44px (WCAG)
- Font sizes escaláveis
- Imagens responsivas (webp com fallback)

---

### 🎨 UX/UI - Experiência "Cidade Alerta"

#### Feedback Visual
- Estados hover/focus/active
- Transições suaves (300ms cubic-bezier)
- Loading states (quando o modal abre)
- Cores contrastantes (vermelho urgente + amarelo alerta)

#### Microinterações
- Bounce no botão de entrada
- Pulse em elementos urgentes
- Marquee na barra de notícias
- Animações de sirene (background)
- Chuva de dinheiro (💸 caindo)

---

## 🔧 Configurações

### JavaScript Config
```javascript
const CONFIG = {
    moneyInterval: 800,      // Intervalo entre moedas (ms)
    moneyLifetime: 4000,     // Duração da animação (ms)
    maxMoneyElements: 15,    // Máximo de elementos simultâneos
    audioFiles: {
        main: "media/kdopix.mp3",
        loop: "media/policia.mp3"
    }
};
```

Você pode ajustar estes valores diretamente no `script.js`.

---

## 📊 Performance Benchmarks

### Antes vs Depois das Otimizações

| Métrica | v1.0 (Antes) | v2.0 (Depois) | Melhoria |
|---------|--------------|---------------|----------|
| **First Contentful Paint** | ~2.5s | ~1.2s | 🚀 **-52%** |
| **Time to Interactive** | ~4.0s | ~2.1s | 🚀 **-47.5%** |
| **Total Blocking Time** | ~800ms | ~250ms | 🚀 **-68.75%** |
| **Lighthouse Score** | ~65/100 | ~92/100 | 🚀 **+27pts** |
| **Elementos DOM simultâneos** | ∞ (leak) | 15 (controlado) | 🚀 **100%** |

---

## ✅ Checklist de Qualidade

### Performance ✅
- [x] Lazy loading de recursos pesados (YouTube)
- [x] Otimização de animações (will-change, GPU)
- [x] Preconnect DNS (Google Fonts, CDNs)
- [x] Limite de elementos DOM (max 15)
- [x] Cleanup automático de memória

### Acessibilidade ✅
- [x] WCAG 2.1 Level AA completo
- [x] Navegação 100% por teclado
- [x] Screen reader friendly (ARIA)
- [x] Reduced motion support
- [x] Contraste adequado (AA/AAA)
- [x] Focus visível (outline amarelo)

### SEO ✅
- [x] Meta tags completas (OG + Twitter)
- [x] Structured data (JSON-LD)
- [x] Semantic HTML5
- [x] Alt texts descritivos
- [x] Canonical URL
- [x] robots.txt + sitemap.xml

### Código ✅
- [x] JavaScript modular e separado
- [x] Separação de responsabilidades
- [x] Error handling completo
- [x] Documentação inline (JSDoc)
- [x] Performance monitoring (console)
- [x] Zero dependências npm

---

## 🚀 Roadmap (v3.0) - Próximas Melhorias

### Em Planejamento

- [ ] **PWA Completo** - Service Worker + Cache offline
- [ ] **Google Analytics** - Tracking de visitas
- [ ] **Modo Escuro** - Para ler o dossiê de madrugada
- [ ] **Compartilhamento Social** - Botões de share
- [ ] **Timeline Interativa** - Cronologia do escândalo
- [ ] **Página 404** - "Pix não encontrado"
- [ ] **Testes Automatizados** - Jest + Playwright
- [ ] **CI/CD** - GitHub Actions
- [ ] **Internacionalização** - EN/ES support

---

## ⚖️ Disclaimer Legal

Este site é uma obra de **ficção e sátira** baseada em fatos amplamente divulgados pela imprensa.

### ⚠️ Avisos Importantes

- ❌ Não hospedamos dinheiro desviado
- ❌ Não temos vínculo com a Record TV ou TV Aratu
- ❌ Não fazemos apologia ao crime
- ✅ Todo o código é **Open Source** (diferente das contas bancárias dos envolvidos)
- ✅ Baseado em **fontes públicas** e matérias jornalísticas
- ✅ Objetivo **educacional e de protesto**

### 📰 Fontes Oficiais Utilizadas

Todas as informações são baseadas em reportagens publicadas:

- [MP-BA - Denúncia Oficial](https://www.mpba.mp.br/noticia/74077)
- [VEJA - Reportagem Completa](https://veja.abril.com.br/coluna/veja-gente/o-esquema-de-doacoes-de-pix-desviadas-por-reporter-da-record/)
- [Metrópoles - Depoimentos das Vítimas](https://www.metropoles.com/colunas/fabia-oliveira/vitimas-do-jornalista-marcelo-castro-revela-detalhes-do-golpe-do-pix)
- [Portal dos Jornalistas](https://www.portaldosjornalistas.com.br/marcelo-castro-acusado-de-aplicar-golpe-do-pix-em-pessoas-pobres-volta-a-pedir-dinheiro-durante-programa/)

---

## 📄 Licença

Este projeto está sob a licença **MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

**TL;DR:** Pode usar, modificar, distribuir. Apenas dê os créditos.

---

## 👤 Autor

**Carlos Henrique Tourinho Santana**

*"Minhas escolhas podem custar caro, mas abandonar o que eu acredito custaria muito mais."*

### 📫 Contato

- 📧 Email: [henriquetourinho@riseup.net](mailto:henriquetourinho@riseup.net)
- 📱 Instagram: [@henrique.ntxa](https://www.instagram.com/henrique.ntxa/)
- 💻 GitHub: [henriquetourinho](https://github.com/henriquetourinho)
- 🐧 Wiki Debian: [henriquetourinho](https://wiki.debian.org/henriquetourinho)

### ☕ Apoie o Projeto

Se este projeto te ajudou ou você gostou da sátira:

- ⭐ Dê uma **star** no repositório
- 🐦 **Compartilhe** nas redes sociais
- 🐛 **Reporte bugs** ou sugira melhorias
- 🤝 **Contribua** com código

**Importante:** Diferente do caso real, aqui todo Pix vai pro lugar certo! 😄

---

## 🙏 Agradecimentos

- Às **vítimas** que tiveram coragem de denunciar
- À **imprensa independente** que deu voz ao caso
- À comunidade **open source** que inspira projetos como este
- Aos **desenvolvedores** que vão forkar e melhorar este código

---

## 📚 Recursos Adicionais

### Para Desenvolvedores

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Para Jornalistas

- [MP-BA](https://www.mpba.mp.br/)
- [Abraji - Jornalismo Investigativo](https://www.abraji.org.br/)
- [Transparência Brasil](https://www.transparencia.org.br/)

---

## 🔥 FAQ - Perguntas Frequentes

### Q: Este site é real?
**A:** O site é real, o código é real, o escândalo é real. A sátira também é real.

### Q: Posso usar este código no meu projeto?
**A:** Sim! É Open Source (MIT License). Só dê os créditos.

### Q: Como posso ajudar o projeto?
**A:** Star no GitHub, compartilhe, reporte bugs, contribua com código ou mande um café virtual.

### Q: O áudio é muito alto!
**A:** Clique no botão "SILENCIAR". Ou ajuste o volume antes de abrir.

### Q: Funciona offline?
**A:** Na v3.0 teremos PWA com suporte offline. Por enquanto, precisa de internet.

### Q: Posso hospedar no meu servidor?
**A:** Claro! É só subir os arquivos. Recomendo usar o `.htaccess` incluído.

---

<p align="center">
  <b>Feito com ódio e café em Salvador, Bahia 🌴☕</b>
  <br>
  <sub>Código aberto, contas fechadas.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/made%20with-%E2%9D%A4%EF%B8%8F%20%26%20%E2%98%95-red?style=for-the-badge" alt="Made with love and coffee">
</p>

---

<p align="center">
  <sub>Este projeto não tem afiliação com Record TV, SBT, TV Aratu ou qualquer outra emissora.</sub>
  <br>
  <sub>Todas as alegações são baseadas em matérias jornalísticas públicas.</sub>
  <br>
  <sub>© 2026 Carlos Henrique Tourinho Santana - MIT License</sub>
</p>
