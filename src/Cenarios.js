/* global push, pop, texture, noStroke, sphere, radians */

// ============================================================
// CLASSE: CENARIO
// ============================================================

/**
 * Classe Cenario
 * Representa um ambiente 360° com sua imagem e hotspots interativos
 */
class Cenario {
  /**
   * Construtor do cenário
   * @param {string} nome - Nome identificador do cenário
   * @param {p5.Image} img - Imagem 360° do cenário
   * @param {Array} hotspotsDef - Array com definições de hotspots
   */
  constructor(nome, img, hotspotsDef) {
    this.nome = nome;
    this.imagem = img;
    this.hotspots = [];
    
    // Cria hotspots a partir das definições
    if (hotspotsDef) {
      hotspotsDef.forEach((def, idx) => {
        this.addHotspotFromDef(def, idx);
      });
    }
  }

  /**
   * Adiciona um hotspot ao cenário a partir de uma definição
   * @param {Object} def - Definição do hotspot (label, actionType, target, yawDeg, pitchDeg)
   * @param {number|string} idxOrIdSuffix - Índice ou sufixo para gerar ID único
   */
  addHotspotFromDef(def, idxOrIdSuffix) {
    // Converte ângulos de graus para radianos
    const yaw = radians(def.yawDeg || 0);
    const pitch = radians(def.pitchDeg || 0);
    
    // Gera ID único para o hotspot
    const id = def.id || (this.nome + "_" + idxOrIdSuffix);

    // Cria e adiciona o hotspot
    this.hotspots.push(new Hotspot({
      id: id,
      label: def.label || "hot",
      actionType: def.actionType || "action",
      target: def.target || null,
      yaw: yaw,
      pitch: pitch
    }));
  }

  /**
   * Renderiza o cenário (esfera com textura) e todos os seus hotspots
   * @param {Camera} cam - Referência da câmera para aplicar transformações
   */
  render(cam) {
    // Renderiza a esfera 360° com a imagem como textura
    push();
    cam.applyTransform();
    texture(this.imagem);
    noStroke();
    sphere(CONFIG.SCENE_RADIUS, 64, 32);
    pop();

    // Renderiza todos os hotspots
    this.hotspots.forEach(h => h.render(cam));
  }
}
