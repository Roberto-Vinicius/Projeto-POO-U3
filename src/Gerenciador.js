// ============================================================
// CLASSE: GERENCIADOR DE JOGO
// ============================================================

/**
 * Classe GerenciadorDeJogo
 * Controla toda a lógica do jogo: cenários, casos clínicos, pontuação, interações
 */
class GerenciadorDeJogo {
  constructor() {
    this.cam = new Camera();
    this.cenarios = {};
    this.cenarioAtual = null;
    
    // Estado do Jogo
    this.pontos = 0;
    this.penalidades = 0;
    this.jogoEncerrado = false;
    this.mensagemFinal = "";
    
    // Estado do Caso
    this.casoAtivo = false;
    this.casoIndex = 0;
    this.progressoCaso = 0;        // Índice do passo atual
    this.tempoInicioCaso = 0;
    this.msgTemp = "";
    this.mostrandoMsg = false;
    
    // Lógica de Gaze (olhar fixo)
    this.olhandoHotspot = null;
    this.gazeStart = 0;
    this.ultimoHotspotId = null;

    // Editor de hotspots
    this.editMode = false;
  }

  /**
   * Inicializa todos os cenários a partir das definições
   */
  inicializarCenarios(defs) {
    for (let nome in defs) {
      let img = defs[nome].image; 
      this.cenarios[nome] = new Cenario(nome, img, defs[nome].hotspotsDef);
    }
    this.mudarCenario("recepcao");
  }

  /**
   * Muda o cenário atual
   */
  mudarCenario(nome) {
    if (!this.cenarios[nome]) {
      console.warn("Cenário inexistente:", nome);
      return;
    }
    this.cenarioAtual = this.cenarios[nome];
    
    // Verifica início automático de caso
    if (this.casoIndex < casos.length && 
        casos[this.casoIndex].cenario === this.cenarioAtual.nome && 
        !this.casoAtivo) {
      this.iniciarCaso();
    }
  }

  // ============================================================
  // LÓGICA DE CASOS CLÍNICOS
  // ============================================================

  /**
   * Inicia o caso clínico atual
   */
  iniciarCaso() {
    if (this.casoIndex >= casos.length) return;
    this.casoAtivo = true;
    this.progressoCaso = 0;
    this.tempoInicioCaso = millis();
    console.log("Iniciando caso:", casos[this.casoIndex].descricao);
  }

  /**
   * Finaliza o caso atual com sucesso
   */
  finalizarCaso() {
    this.casoAtivo = false;
    this.casoIndex++;
    this.msgTemp = "Caso finalizado! Próximo em breve...";
    this.mostrandoMsg = true;

    if (this.casoIndex >= casos.length) {
      this.encerrarJogo("Parabéns! Completou todos os casos!\nPontos: " + this.pontos);
    } else {
      setTimeout(() => {
        this.mostrandoMsg = false;
        if(casos[this.casoIndex].cenario === this.cenarioAtual.nome) {
          this.iniciarCaso();
        }
      }, 3000);
    }
  }

  /**
   * Registra falha no caso atual
   */
  falharCaso() {
    this.casoAtivo = false;
    this.penalidades++;
    this.pontos -= 30;
    this.msgTemp = "Tempo esgotado ou erro crítico! Penalidade.";
    this.mostrandoMsg = true;

    if (this.penalidades >= 3) {
      this.encerrarJogo("Fim de Jogo! Muitas penalidades.");
    } else if (this.casoIndex >= casos.length) {
      this.encerrarJogo("Fim! Pontos: " + this.pontos);
    } else {
      setTimeout(() => {
        this.casoIndex++;
        this.mostrandoMsg = false;
        if(this.casoIndex < casos.length && casos[this.casoIndex].cenario === this.cenarioAtual.nome) {
          this.iniciarCaso();
        }
      }, 3000);
    }
  }

  /**
   * Encerra o jogo
   * @param {string} msg - Mensagem final
   */
  encerrarJogo(msg) {
    this.jogoEncerrado = true;
    this.mensagemFinal = msg;
  }

  // ============================================================
  // LÓGICA DE INTERAÇÃO (GAZE)
  // ============================================================

  /**
   * Processa a lógica de olhar fixo (gaze) para ativar hotspots
   */
  processarGaze() {
    if (this.jogoEncerrado || this.mostrandoMsg) return;

    // Detectar hotspot candidato (aquele que está sendo olhado)
    let candidato = null;
    for (let h of this.cenarioAtual.hotspots) {
      if (h.isLookedAt(this.cam)) {
        candidato = h;
        break;
      }
    }

    if (candidato) {
      // Começou a olhar agora ou mudou de alvo
      if (!this.olhandoHotspot || this.olhandoHotspot.id !== candidato.id) {
        this.olhandoHotspot = candidato;
        // Se for o mesmo que acabamos de ativar, não reinicia contagem
        if (this.ultimoHotspotId === candidato.id) {
          this.gazeStart = 0; 
        } else {
          this.gazeStart = millis();
        }
      }

      // Calcula progresso do timer
      if (this.gazeStart > 0) {
        const decorrido = millis() - this.gazeStart;
        const frac = constrain(decorrido / CONFIG.GAZE_MS, 0, 1);
        this.desenharCursor(frac, candidato.label);

        // Ativa o hotspot quando completar o tempo
        if (decorrido >= CONFIG.GAZE_MS) {
          this.ativarHotspot(candidato);
          this.olhandoHotspot = null;
          this.gazeStart = 0;
        }
      } else {
        this.desenharCursor(0, null);
      }
    } else {
      // Não está olhando para nenhum hotspot
      this.olhandoHotspot = null;
      this.gazeStart = 0;
      this.desenharCursor(0, null);
    }
  }

  /**
   * Ativa um hotspot (executa sua ação)
   * @param {Hotspot} h - Hotspot a ser ativado
   */
  ativarHotspot(h) {
    this.ultimoHotspotId = h.id;

    // Navegação entre cenários
    if (h.actionType === "goto") {
      this.mudarCenario(h.target);
      return;
    }
    
    // Início manual de caso
    if (h.actionType === "startcase") {
      return; 
    }

    // Ação incorreta
    if (h.actionType === "wrongaction") {
      this.pontos -= 20;
      this.penalidades++;
      return;
    }

    // Ação do caso clínico
    if (h.actionType === "action") {
      if (!this.casoAtivo) return;

      const caso = casos[this.casoIndex];
      const passoEsperado = caso.passos[this.progressoCaso];

      if (h.label === passoEsperado) {
        // Acertou o passo
        this.pontos += 20;
        this.progressoCaso++;
        console.log("Passo correto:", h.label);
        
        // Verifica se completou todos os passos
        if (this.progressoCaso >= caso.passos.length) {
          // Bônus de tempo
          const tempoRestante = caso.tempoLimite - floor((millis() - this.tempoInicioCaso) / 1000);
          if (tempoRestante > 0) this.pontos += max(0, tempoRestante * 2);
          this.finalizarCaso();
        }
      } else {
        // Errou o passo
        this.pontos -= 15;
        console.log("Erro! Esperado:", passoEsperado, "Clicado:", h.label);
      }
    }
  }

  /**
   * Verifica se o tempo limite do caso foi excedido
   */
  verificarTempo() {
    if (this.casoAtivo && !this.jogoEncerrado && !this.mostrandoMsg) {
      const caso = casos[this.casoIndex];
      const decorrido = floor((millis() - this.tempoInicioCaso) / 1000);
      const restante = caso.tempoLimite - decorrido;
      
      if (restante <= 0) {
        this.falharCaso();
      }
    }
  }

  // ============================================================
  // RENDERIZAÇÃO
  // ============================================================

  /**
   * Loop principal de atualização e renderização
   */
  updateAndDraw() {
    this.cam.update();
    background(0);

    // 1. Renderiza cenário 3D
    if (this.cenarioAtual) {
      this.cenarioAtual.render(this.cam);
    }

    // 2. Lógica de jogo
    this.processarGaze();
    this.verificarTempo();

    // 3. Interface HUD
    this.desenharHUD();

    // 4. Mensagens e telas de aviso
    if (this.mostrandoMsg) this.desenharTelaMensagem(this.msgTemp);
    if (this.jogoEncerrado) this.desenharTelaMensagem(this.mensagemFinal, true);
    
    // 5. Overlay do editor
    if (this.editMode) this.desenharOverlayEditor();
  }

  /**
   * Desenha o cursor circular de gaze com progresso
   * @param {number} frac - Fração de progresso (0-1)
   * @param {string} label - Label do hotspot (opcional)
   */
  desenharCursor(frac, label) {
    push();
    resetMatrix();
    noFill();
    strokeWeight(6);
    stroke(100);
    ellipse(0, 0, 80, 80);
    
    if (frac > 0) {
      stroke(0, 200, 0);
      let start = -PI / 2;
      arc(0, 0, 80, 80, start, start + TWO_PI * frac);
    }
    
    noStroke();
    if (label) {
      fill(255); 
      stroke(0); 
      strokeWeight(2);
      textSize(16); 
      text(label, 0, 50);
    }
    pop();
  }

  /**
   * Desenha a interface HUD (pontos, tempo, progresso)
   */
  desenharHUD() {
    push();
    resetMatrix();
    translate(-width / 2 + 20, -height / 2 + 20);
    textAlign(LEFT, TOP);
    
    // Painel de informações
    fill(0, 0, 0, 150);
    rect(0, 0, 250, 120, 10);
    fill(255);
    noStroke();
    textSize(14);
    
    text("Cenário: " + (this.cenarioAtual ? this.cenarioAtual.nome : "?"), 10, 10);
    text("Pontos: " + this.pontos, 10, 30);
    text("Penalidades: " + this.penalidades + "/3", 10, 50);
    
    // Informações do caso
    if (this.casoAtivo) {
      const caso = casos[this.casoIndex];
      const restante = max(0, caso.tempoLimite - floor((millis() - this.tempoInicioCaso) / 1000));
      
      text("Caso Atual: " + (this.casoIndex + 1), 10, 80);
      text("Tempo: " + restante + "s", 10, 100);
      
      this.desenharListaPassos(caso);
    } else {
      text("Nenhum caso ativo", 10, 80);
    }
    pop();
  }

  /**
   * Desenha a lista de passos do procedimento atual
   * @param {Object} caso - Caso clínico atual
   */
  desenharListaPassos(caso) {
    push();
    translate(260, 0); 
    fill(0, 0, 0, 100);
    rect(0, 0, 300, 250, 10);
    
    fill(255);
    text("Procedimento: " + caso.descricao, 10, 10, 280, 50);
    
    let y = 60;
    caso.passos.forEach((p, i) => {
      if (i < this.progressoCaso) {
        fill(100, 255, 100);      // Verde - concluído
      } else if (i === this.progressoCaso) {
        fill(255, 255, 0);        // Amarelo - atual
      } else {
        fill(200);                // Cinza - pendente
      }
      text((i+1) + ". " + p, 10, y);
      y += 20;
    });
    pop();
  }

  /**
   * Desenha tela de mensagem (avisos, fim de jogo)
   * @param {string} txt - Texto da mensagem
   * @param {boolean} final - Se true, mostra mensagem de fim de jogo
   */
  desenharTelaMensagem(txt, final = false) {
    push();
    resetMatrix();
    fill(0, 0, 0, 220);
    rect(-width/2, -height/2, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(28);
    text(txt, 0, 0);
    
    if(final) {
      textSize(16);
      text("Recarregue a página para jogar novamente.", 0, 50);
    }
    pop();
  }
  
  /**
   * Desenha overlay do modo editor
   */
  desenharOverlayEditor() {
    push();
    resetMatrix();
    noFill();
    stroke(255, 220, 0);
    strokeWeight(2);
    ellipse(0, 0, 20, 20);
    
    fill(255, 220, 0);
    noStroke();
    textSize(14);
    textAlign(CENTER);
    text("MODO EDITOR (C para criar, E para sair)", 0, -height/2 + 30);
    pop();
  }

  // ============================================================
  // INPUT DO USUÁRIO
  // ============================================================

  /**
   * Processa teclas pressionadas
   * @param {string} k - Tecla pressionada
   */
  handleKeyPressed(k) {
    if (k === 'e' || k === 'E') {
      this.editMode = !this.editMode;
      console.log("Modo Editor:", this.editMode);
    }
    
    if ((k === 'c' || k === 'C') && this.editMode) {
      this.criarHotspotManual();
    }
  }

  /**
   * Cria um hotspot manualmente no modo editor
   */
  criarHotspotManual() {
    const label = prompt("Label (ex: 'Pia'):");
    if (!label) return;
    
    const type = prompt("Tipo (action/goto):", "action");
    let target = null;
    
    if (type === "goto") {
      target = prompt("Destino:");
    }
    
    // Cria definição do hotspot
    const def = {
      label: label,
      actionType: type,
      target: target,
      yawDeg: degrees(this.cam.yaw),
      pitchDeg: degrees(this.cam.pitch)
    };
    
    this.cenarioAtual.addHotspotFromDef(def, "editor_" + Date.now());
    alert("Hotspot criado!");
    console.log("Hotspot criado:", def);
  }
}
