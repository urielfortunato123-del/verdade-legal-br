# ⚖️ Verdade na Lei Brasil

> **Combatendo a desinformação no Brasil com base na legislação oficial.**

O **Verdade na Lei BR** é um aplicativo web progressivo (PWA) que ajuda cidadãos brasileiros a verificar a veracidade de notícias, afirmações e conteúdos usando inteligência artificial e a legislação brasileira como referência.

---

## 🎯 O que o app faz pelo cidadão

### 🔍 Verificador de Fatos (`/fact-check`)
O cidadão pode colar **textos de redes sociais** (WhatsApp, Twitter/X, Facebook), **notícias**, **manchetes** ou **links de sites** e receber uma análise completa com:
- **Veredito claro**: Verdade ✅ | Mentira ❌ | Meia Verdade ⚠️ | Inconclusivo ❓
- **Explicação detalhada** do porquê da classificação
- **Pontos-chave** numerados para fácil compreensão
- **Contexto importante** sobre o tema
- **Fontes consultadas** com links para verificação
- **Índice de confiança** da análise (porcentagem)
- **Compartilhamento** do resultado via redes sociais

### 📘 Perguntar sobre Leis (`/perguntar`)
O cidadão pode fazer **perguntas jurídicas em linguagem simples** e receber respostas baseadas na legislação oficial. Exemplos:
- *"Qual o prazo para troca de produto com defeito?"*
- *"Quais meus direitos na demissão sem justa causa?"*
- *"O que diz a lei sobre pensão alimentícia?"*

**Recursos:**
- Seleção de categoria jurídica (Penal, Trânsito, Consumidor, Trabalho, Família, Constitucional)
- Detecção automática da área do direito
- Artigos de lei citados com links para o texto oficial
- Indicador de confiança (alta, média, baixa)
- Compartilhamento do resultado

### 📸 Checar Imagem/Documento (`/checar-imagem`)
O cidadão pode enviar **fotos, prints, PDFs ou documentos Word** para análise. Funciona em dois modos:

**Modo Notícia/TV:**
- Analisa prints de notícias, capturas de tela de redes sociais
- Extrai afirmações e verifica cada uma individualmente
- Selo de veredito geral (Confirmado, Enganoso, Falso, Inverificável)
- Referência aos artigos de lei relacionados

**Modo Documento:**
- Extrai informações-chave do documento
- Identifica pontos legais relevantes
- Resume o conteúdo de forma acessível

### 🎙️ Checar Áudio (`/checar-audio`)
O cidadão pode **gravar áudios ao vivo** ou **enviar arquivos de áudio** para:
- **Transcrição automática** do conteúdo falado usando IA
- **Análise legal** do que foi dito
- Verificação de afirmações com base na legislação
- Download do áudio original como prova
- Processo em 3 etapas com indicador de progresso: Upload → Transcrição → Análise

**Ideal para:** gravar trechos de jornais na TV, rádio, conversas, discursos políticos.

### 📰 Feed de Notícias (`/` - Página Inicial)
Agregador de notícias em tempo real de **mais de 25 fontes brasileiras**, incluindo:

**Jornais tradicionais:** G1, Folha de S. Paulo, UOL, Estadão, R7, CNN Brasil, BBC Brasil, Terra

**Portais independentes/esquerda:** Brasil 247, Brasil de Fato, Esquerda Diário, CartaCapital

**Portais independentes/direita:** O Antagonista, Revista Oeste, Pleno News, Conexão Política, Revista Crusoé, Jornal da Cidade Online, Brasil Paralelo

**Categorias:** Geral, Política, Economia

**Funcionalidades:**
- Verificação de cada notícia com IA
- Veredito de confiabilidade por notícia
- Compartilhamento individual

### ⚖️ Biblioteca de Leis (`/biblioteca`)
Acesso direto aos principais textos legais do Brasil:
- Constituição Federal de 1988
- Código Penal
- Código Civil
- Código de Defesa do Consumidor
- Código de Trânsito Brasileiro
- Estatuto da Criança e do Adolescente
- Lei Maria da Penha
- Estatuto do Idoso

Com busca por assunto, filtro por tipo de norma e links diretos para o Planalto.

### 🗂️ Histórico (`/historico`)
Todas as consultas ficam salvas para referência futura:
- Busca no histórico
- Filtro por tipo (perguntas, imagens, áudios)
- Sistema de favoritos ⭐
- Exportação completa em PDF
- Exclusão individual

---

## 🛡️ Princípios

| Princípio | Descrição |
|-----------|-----------|
| **Neutralidade** | Fontes de todos os espectros políticos |
| **Transparência** | Todas as fontes são citadas e linkadas |
| **Acessibilidade** | Linguagem simples, interface intuitiva |
| **Privacidade** | Dados do usuário protegidos |
| **Responsabilidade** | Aviso legal em todas as telas |

---

## ⚠️ Aviso Legal

> Este aplicativo tem caráter **informativo** e **não substitui** a orientação de um advogado ou autoridade pública. A verificação é baseada em fontes públicas disponíveis e inteligência artificial.

---

## 🛠️ Tecnologias

- **Frontend:** React + TypeScript + Vite
- **Estilização:** Tailwind CSS + shadcn/ui
- **Backend:** Lovable Cloud (Edge Functions)
- **IA:** Modelos de linguagem para análise e verificação
- **PWA:** Instalável como app no celular
- **Feed RSS:** Agregação de notícias em tempo real

---

## 📱 Instalação no Celular

O Verdade na Lei BR é um **Progressive Web App (PWA)**. Para instalar:

1. Acesse o app pelo navegador do celular
2. Toque em **"Adicionar à tela inicial"** (ou similar)
3. O app ficará disponível como um ícone no seu celular

---

## 🚀 Desenvolvimento Local

```sh
# Clonar o repositório
git clone <URL_DO_REPOSITORIO>

# Entrar na pasta
cd verdade-na-lei-br

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

---

## 📄 Licença

© 2025 Verdade na Lei Brasil. Feito com 💚💛 no Brasil.
