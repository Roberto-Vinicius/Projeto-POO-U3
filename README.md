# 🏥 Plantão VR - Simulador de Enfermagem 360°

> Simulador educacional em realidade virtual 360° para treinamento de procedimentos de enfermagem, desenvolvido com p5.js.

## 📖 Sobre o Projeto

O **Plantão VR** é uma aplicação web interativa que simula ambientes hospitalares em 360° para treinar estudantes e profissionais de enfermagem em procedimentos clínicos. O sistema utiliza a técnica de **gaze-based interaction** (interação por olhar fixo) para ativar hotspots e executar ações, proporcionando uma experiência imersiva sem necessidade de hardware especial.

## 📁 Estrutura do Projeto

```
ambiente_enfermagem_roberto_vinicius/
├── index.html              # Página principal
├── sketch.js               # Loop principal p5.js (preload, setup, draw)
├── style.css              # Estilos da página
│
├── src/                   # 📂 Código-fonte organizado
│   ├── Config.js          # Configurações globais (timers, thresholds)
│   ├── Casos.js           # Definição de casos clínicos e cenários
│   ├── Hotspots.js        # Classes Camera e Hotspot
│   ├── Cenarios.js        # Classe Cenario (ambientes 360°)
│   └── Gerenciador.js     # Classe GerenciadorDeJogo (lógica principal)
│
├── assets/                # Recursos do jogo
│   └── Roboto.ttf        # Fonte customizada
│
├── libs/                  # Bibliotecas externas
│   ├── p5.min.js
│   └── p5.sound.min.js
```

## 🚀 Como Executar

### Requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- JavaScript habilitado
- Conexão com internet (para carregar p5.js via CDN)

### Instalação
```bash
# Clone ou baixe o projeto
cd ambiente_enfermagem_robero_vinicius

# Abra o index.html diretamente no navegador
# OU use um servidor local:
python -m http.server 8000
# Acesse: http://localhost:8000
```

## 🎮 Como Jogar

### Controles Básicos
- **Mouse**: Arraste para olhar ao redor (360°)
- **Gaze (Olhar Fixo)**: Olhe para um hotspot por 2 segundos para ativá-lo
- **Tecla E**: Ativar/desativar modo editor
- **Tecla C**: Criar hotspot (apenas no modo editor)

### Objetivo
1. Leia a descrição do caso clínico apresentado
2. Siga a sequência correta de procedimentos listados no HUD
3. Olhe fixamente para os hotspots corretos na ordem indicada
4. Complete todos os passos dentro do tempo limite
5. Evite acumular 3 penalidades para não perder o jogo

## 🛠️ Modo Editor (Desenvolvedor)

O modo editor permite criar novos hotspots de forma visual:

**Ativar/Desativar:** Pressione `E`  
**Criar Hotspot:** Pressione `C` (quando no modo editor)

### Passos para criar um hotspot:
1. Pressione `E` para ativar o modo editor
2. Posicione a câmera (mouse) no local desejado do cenário 360°
3. Pressione `C` para iniciar a criação
4. Preencha os prompts que aparecerem:
   - Label do hotspot (ex: "Higienizar mãos")
   - Tipo de ação: `action` ou `goto`
   - Se `goto`: nome do cenário de destino
5. Abra o console do navegador (F12)
6. Copie os valores `yawDeg` e `pitchDeg` exibidos
7. Cole esses valores em `src/Casos.js` na definição do cenário correspondente

## 📋 Arquivos Principais

### `src/Config.js`
Configurações globais do jogo:
- `GAZE_MS`: Tempo de olhar fixo (ms)
- `SCENE_RADIUS`: Raio da esfera 360°
- `YAW_THRESHOLD` / `PITCH_THRESHOLD`: Sensibilidade de detecção

### `src/Casos.js`
- **Acoes**: Constantes com nomes de ações padronizadas
- **casos**: Array com casos clínicos e suas sequências corretas
- **cenariosDef**: Definições de cenários e posições de hotspots

### `src/Hotspots.js`
- **Camera**: Controle de visão do jogador (yaw/pitch)
- **Hotspot**: Pontos interativos no cenário 360°

### `src/Cenarios.js`
- **Cenario**: Ambiente 360° com imagem e hotspots

### `src/Gerenciador.js`
- **GerenciadorDeJogo**: Lógica principal do jogo
  - Gerenciamento de cenários
  - Sistema de pontuação
  - Lógica de casos clínicos
  - Sistema de gaze (olhar fixo)
  - Editor de hotspots

### `sketch.js`
Funções do ciclo de vida p5.js:
- `preload()`: Carrega recursos
- `setup()`: Inicialização
- `draw()`: Loop de renderização
- Eventos de mouse e teclado

## 🎯 Sistema de Pontuação

- ✅ **Passo correto**: +20 pontos
- ❌ **Passo errado**: -15 pontos
- ⏰ **Tempo restante**: +2 pontos/segundo (no final do caso)
- 🚫 **Ação incorreta**: -20 pontos + penalidade
- ⏳ **Tempo esgotado**: -30 pontos + penalidade
- 💀 **3 penalidades**: Fim de jogo

## 🔧 Como Adicionar Novos Casos

1. Abra `src/Casos.js`
2. Adicione nova entrada no array `casos`:

```javascript
{
  descricao: "Descrição do caso",
  passos: [Acoes.PASSO1, Acoes.PASSO2, Acoes.PASSO3],
  tempoLimite: 90, // segundos
  exigeMedico: false,
  cenario: "nome_do_cenario"
}
```

3. Certifique-se de que os hotspots necessários existem no cenário

## 🗺️ Como Adicionar Novos Cenários

1. Adicione a imagem 360° em `preload()` no `sketch.js`
2. Adicione entrada em `cenariosDef` no `src/Casos.js`:

```javascript
nome_cenario: {
  image: null, // Será preenchida no setup
  hotspotsDef: [
    { label: Acoes.ACAO, actionType: "action", yawDeg: 45, pitchDeg: 10 },
    { label: "Ir para X", actionType: "goto", target: "outro_cenario", yawDeg: -90, pitchDeg: 0 }
  ]
}
```

3. Vincule a imagem no `setup()` do `sketch.js`

## � Recursos Principais

- ✨ **Visualização 360°**: Navegação imersiva em ambientes hospitalares
- 👁️ **Gaze Interaction**: Sistema de interação por olhar fixo (2 segundos)
- 🎯 **Sistema de Casos**: Múltiplos cenários clínicos com sequências de procedimentos
- 📊 **Sistema de Pontuação**: Feedback em tempo real sobre desempenho
- ⏱️ **Modo Cronômetro**: Tempo limite para completar cada caso
- 🎨 **HUD Informativo**: Interface clara com instruções e feedback
- 🛠️ **Editor de Hotspots**: Ferramenta visual para criar novos pontos de interação
- 🔄 **Multi-cenários**: Sistema de navegação entre diferentes ambientes

## 📦 Tecnologias Utilizadas

- **[p5.js](https://p5js.org/)** v1.9.0 - Framework de criação gráfica
- **[p5.sound.js](https://p5js.org/reference/#/libraries/p5.sound)** v1.9.0 - Biblioteca de áudio (preparado para expansão)
- **JavaScript ES6+** - Linguagem principal
- **HTML5 Canvas** - Renderização gráfica
- **CSS3** - Estilização da interface

## 🎓 Aplicações Educacionais

Este simulador pode ser utilizado para:
- � Treinamento de estudantes de enfermagem
- 🏥 Capacitação de novos profissionais
- 🔄 Reciclagem de procedimentos padronizados
- 📝 Avaliação de conhecimentos práticos
- 🎯 Simulação de situações de emergência sem riscos

## �🚀 Melhorias Futuras

- [ ] Sistema de save/load de progresso do jogador
- [ ] Implementar sons e feedback sonoro
- [ ] Adicionar mais casos clínicos variados
- [ ] Tutorial interativo para novos usuários
- [ ] Suporte nativo para VR headsets (WebXR)
- [ ] Exportação automática de hotspots do editor
- [ ] Sistema de conquistas e badges
- [ ] Modo multiplayer/colaborativo
- [ ] Relatórios de desempenho detalhados
- [ ] Integração com LMS (Learning Management Systems)

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👨‍💻 Autor

**Roberto Vinícius**

---

💡 **Dica**: Para melhor experiência, use um monitor grande ou projetor para simular uma visão mais imersiva do ambiente 360°.