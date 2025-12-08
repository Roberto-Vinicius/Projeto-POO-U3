/* global radians */

// ============================================================
// CONFIGURAÇÕES GLOBAIS DO JOGO
// ============================================================

const CONFIG = {
  // Tempo necessário de olhar fixo para ativar um hotspot (ms)
  GAZE_MS: 2000,
  
  // Raio da esfera que representa o cenário 360°
  SCENE_RADIUS: 1000,
  
  // Fator de distância dos hotspots em relação ao raio da cena
  HOTSPOT_DIST_FACTOR: 0.95,
  
  // Limiares de detecção de olhar (em graus)
  YAW_THRESHOLD: 7,    // Eixo horizontal
  PITCH_THRESHOLD: 7   // Eixo vertical
};
