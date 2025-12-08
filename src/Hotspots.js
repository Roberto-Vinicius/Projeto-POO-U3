/* global mouseX, mouseY, PI, constrain, rotateX, rotateY, createVector, push, pop, translate, sphere, noStroke, fill, radians */

// ============================================================
// CLASSES: CAMERA E HOTSPOT
// ============================================================

/**
 * Classe Camera
 * Gerencia a visão do jogador (rotação da câmera)
 * Controla yaw (horizontal) e pitch (vertical) através de drag do mouse
 */
class Camera {
  constructor() {
    this.yaw = 0;      // Rotação horizontal (radianos)
    this.pitch = 0;    // Rotação vertical (radianos)
    this.lastX = 0;    // Última posição X do mouse
    this.lastY = 0;    // Última posição Y do mouse
    this.dragging = false;
  }

  /**
   * Inicia o arrasto da câmera
   */
  startDrag() {
    this.lastX = mouseX;
    this.lastY = mouseY;
    this.dragging = true;
  }

  /**
   * Para o arrasto da câmera
   */
  stopDrag() {
    this.dragging = false;
  }

  /**
   * Atualiza a rotação da câmera baseado no movimento do mouse
   */
  update() {
    if (this.dragging) {
      let dx = mouseX - this.lastX;
      let dy = mouseY - this.lastY;
      
      this.yaw += dx * 0.01;
      this.pitch -= dy * 0.01;
      this.pitch = constrain(this.pitch, -PI / 2, PI / 2);
      
      this.lastX = mouseX;
      this.lastY = mouseY;
    }
  }

  /**
   * Aplica a transformação de rotação inversa para renderizar o mundo
   * Deve ser chamada dentro de push/pop para não afetar outras renderizações
   */
  applyTransform() {
    rotateX(-this.pitch);
    rotateY(-this.yaw);
  }
}

/**
 * Classe Hotspot
 * Representa um ponto interativo no cenário 360°
 * Pode ser uma ação do jogo ou um portal para outro cenário
 */
class Hotspot {
  constructor(data) {
    this.id = data.id;
    this.label = data.label;
    this.actionType = data.actionType;  // "action", "goto", "startcase", "wrongaction"
    this.target = data.target;          // Destino (para tipo "goto")
    this.yaw = data.yaw;                // Ângulo horizontal (radianos)
    this.pitch = data.pitch;            // Ângulo vertical (radianos)
    
    // Calcula posição cartesiana 3D a partir dos ângulos
    const r = CONFIG.SCENE_RADIUS * CONFIG.HOTSPOT_DIST_FACTOR;
    this.pos = this.sphericalToCartesian(this.yaw, this.pitch, r);
  }

  /**
   * Converte coordenadas esféricas (yaw, pitch, raio) para cartesianas (x, y, z)
   * @param {number} yaw - Ângulo horizontal em radianos
   * @param {number} pitch - Ângulo vertical em radianos
   * @param {number} r - Raio (distância da origem)
   * @returns {p5.Vector} Posição cartesiana
   */
  sphericalToCartesian(yaw, pitch, r) {
    const x = -r * Math.sin(yaw) * Math.cos(pitch);
    const y =  r * Math.sin(pitch);
    const z = -r * Math.cos(yaw) * Math.cos(pitch);
    return createVector(x, y, z);
  }

  /**
   * Renderiza o hotspot como uma esfera colorida
   * @param {Camera} cam - Referência da câmera para aplicar transformações
   */
  render(cam) {
    push();
    cam.applyTransform();
    translate(this.pos.x, this.pos.y, this.pos.z);
    
    // Cores baseadas no tipo de ação
    if (this.actionType === "goto") {
      fill(100, 150, 255);      // Azul - navegação
    } else if (this.actionType === "startcase") {
      fill(100, 255, 150);      // Verde - início de caso
    } else {
      fill(255, 80, 80);        // Vermelho - ação
    }
    
    noStroke();
    sphere(8);
    pop();
  }

  /**
   * Verifica se a câmera está olhando para este hotspot
   * @param {Camera} cam - Referência da câmera
   * @returns {boolean} True se está olhando para o hotspot
   */
  isLookedAt(cam) {
    // Função auxiliar para calcular diferença angular circular
    const angleDiff = (a, b) => {
      let d = a - b;
      while (d > PI) d -= 2 * PI;
      while (d < -PI) d += 2 * PI;
      return d;
    };

    // Calcula diferenças angulares
    const dYaw = Math.abs(angleDiff(this.yaw, cam.yaw));
    const dPitch = Math.abs(this.pitch - cam.pitch);
    
    // Converte thresholds de graus para radianos
    const thYaw = radians(CONFIG.YAW_THRESHOLD);
    const thPitch = radians(CONFIG.PITCH_THRESHOLD);

    // Retorna true se está dentro dos limites
    return (dYaw < thYaw && dPitch < thPitch);
  }
}
