/* global loadFont, loadImage, createCanvas, textAlign, textFont, resizeCanvas, windowWidth, windowHeight, WEBGL, CENTER, key */

// ============================================================
// PLANTÃO VR - ARQUIVO PRINCIPAL P5.JS
// ============================================================
// Este arquivo contém apenas as funções do ciclo de vida do p5.js.
// Toda a lógica do jogo foi organizada em arquivos separados na pasta src/
// ============================================================

let gameFont;
let imagens = {}; // Armazena imagens carregadas
let jogo; // Instância do GerenciadorDeJogo

// ---------------- FUNÇÕES P5.JS ----------------

/**
 * Carrega recursos antes de iniciar o jogo
 * - Fonte customizada
 * - Imagens 360° dos cenários
 */
function preload() {
  gameFont = loadFont('assets/Roboto.ttf');
  
  // Carrega imagens dos cenários
  imagens.recepcao = loadImage("https://raw.githubusercontent.com/reily-cleiane/AR/main/recepcao5.png");
  imagens.enfermaria = loadImage("https://raw.githubusercontent.com/reily-cleiane/AR/main/enf-novo.png");
  imagens.procedimentos = loadImage("https://raw.githubusercontent.com/reily-cleiane/AR/main/enfermagem2.jpeg");
}

/**
 * Configuração inicial do jogo
 * - Cria canvas 3D em tela cheia
 * - Inicializa o gerenciador de jogo
 * - Vincula imagens aos cenários
 */
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textAlign(CENTER, CENTER);
  textFont(gameFont);
  
  // Cria instância do gerenciador
  jogo = new GerenciadorDeJogo();
  
  // Vincula as imagens carregadas às definições de cenários
  cenariosDef.recepcao.image = imagens.recepcao;
  cenariosDef.enfermaria.image = imagens.enfermaria;
  cenariosDef.procedimentos.image = imagens.procedimentos;
  
  // Inicializa todos os cenários
  jogo.inicializarCenarios(cenariosDef);
}

/**
 * Loop principal de renderização
 * Chamada automaticamente 60 vezes por segundo
 */
function draw() {
  jogo.updateAndDraw();
}

/**
 * Evento de mouse pressionado
 * Inicia o arrasto da câmera
 */
function mousePressed() {
  jogo.cam.startDrag();
}

/**
 * Evento de mouse solto
 * Para o arrasto da câmera
 */
function mouseReleased() {
  jogo.cam.stopDrag();
}

/**
 * Evento de redimensionamento da janela
 * Ajusta o canvas para ocupar toda a tela
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/**
 * Evento de tecla pressionada
 * Repassa para o gerenciador de jogo
 */
function keyPressed() {
  jogo.handleKeyPressed(key);
}