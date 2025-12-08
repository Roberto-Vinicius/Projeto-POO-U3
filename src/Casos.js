// ============================================================
// DEFINIÇÕES DE AÇÕES E CASOS CLÍNICOS
// ============================================================

/**
 * Objeto com todas as ações possíveis no jogo.
 * Usado para padronizar labels e facilitar manutenção.
 */
const Acoes = {
  HIG_MAOS: "Higienizar as mãos",
  SECAR_MAOS: "Secar as mãos",
  LUVAS: "Colocar luvas",
  ANAMNESE: "Fazer anamnese",
  ANALGESICO: "Aplicar analgésico",
  ANTI_INFLAMAT: "Aplicar anti-inflamatório",
  ANTI_ALERG: "Aplicar antialérgico",
  COMPRESSAO: "Fazer compressão",
  CURATIVO: "Fazer curativo",
  TEMPERATURA: "Medir temperatura",
  PESO: "Medir peso",
  PRESSAO: "Medir pressão",
  MEDICO: "Encaminhar para médico com urgência",
  FINALIZAR: "Finalizar atendimento",
  CONSULTA: "Encaminha para consulta",
  LOCAL_ENF: "Ir para consultório de enfermagem",
  LOCAL_PROC: "Ir para sala da procedimentos",
  LOCAL_RECEP: "Ir para recepção"
};

/**
 * Array de casos clínicos.
 * Cada caso define:
 * - descricao: Breve descrição do caso
 * - passos: Array ordenado de ações que devem ser executadas
 * - tempoLimite: Tempo máximo em segundos para completar o caso
 * - exigeMedico: Se true, o caso requer encaminhamento médico
 * - cenario: Nome do cenário onde o caso inicia
 */
const casos = [
  {
    descricao: "Paciente com febre e dor de cabeça.",
    passos: [Acoes.HIG_MAOS, Acoes.LUVAS, Acoes.ANAMNESE, Acoes.ANALGESICO],
    tempoLimite: 120,
    exigeMedico: false,
    cenario: "enfermaria"
  },
  {
    descricao: "Paciente com corte profundo no braço.",
    passos: [Acoes.HIG_MAOS, Acoes.LUVAS, Acoes.CURATIVO, Acoes.COMPRESSAO, Acoes.MEDICO],
    tempoLimite: 60,
    exigeMedico: true,
    cenario: "procedimentos"
  },
  {
    descricao: "Paciente idoso hipertenso.",
    passos: [Acoes.TEMPERATURA, Acoes.PESO, Acoes.PRESSAO, Acoes.CONSULTA],
    tempoLimite: 60,
    exigeMedico: false,
    cenario: "enfermaria"
  }
];

/**
 * Definições dos cenários 360°.
 * Cada cenário contém:
 * - image: Referência para a imagem (será preenchida no preload)
 * - hotspotsDef: Array de definições de hotspots
 * 
 * Cada hotspot tem:
 * - label: Texto descritivo da ação
 * - actionType: Tipo de ação ("action", "goto", "startcase")
 * - target: Cenário de destino (para tipo "goto")
 * - yawDeg: Ângulo horizontal em graus
 * - pitchDeg: Ângulo vertical em graus
 */
const cenariosDef = {
  recepcao: {
    image: null, // Será preenchida no preload
    hotspotsDef: [
      { label: Acoes.LOCAL_ENF, actionType: "goto", target: "enfermaria", yawDeg: 150, pitchDeg: 0 },
      { label: Acoes.LOCAL_PROC, actionType: "goto", target: "procedimentos", yawDeg: -150, pitchDeg: 0 }
    ]
  },
  enfermaria: {
    image: null,
    hotspotsDef: [
      { label: Acoes.LOCAL_RECEP, actionType: "goto", target: "recepcao", yawDeg: 32, pitchDeg: 10 },        
      { label: Acoes.ANAMNESE, actionType: "action", yawDeg: 110, pitchDeg: 10 },
      { label: Acoes.HIG_MAOS, actionType: "action", yawDeg: -45, pitchDeg: 20 },
      { label: Acoes.SECAR_MAOS, actionType: "action", yawDeg: -45, pitchDeg: -1.013 },
      { label: Acoes.LUVAS, actionType: "action", yawDeg: -15, pitchDeg: 20 },
      { label: Acoes.PESO, actionType: "action", yawDeg: 65, pitchDeg: 10 },
      { label: Acoes.TEMPERATURA, actionType: "action", yawDeg: 135, pitchDeg: 20 },
      { label: Acoes.PRESSAO, actionType: "action", yawDeg: 150, pitchDeg: 20 },
      { label: Acoes.MEDICO, actionType: "action", yawDeg: 165, pitchDeg: 20 },
      { label: Acoes.ANALGESICO, actionType: "action", yawDeg: -111.72, pitchDeg: 8.021 },
      { label: Acoes.CONSULTA, actionType: "action", yawDeg: 24.63, pitchDeg: 19.48 },
    ]
  },
  procedimentos: {
    image: null,
    hotspotsDef: [
      { label: Acoes.HIG_MAOS, actionType: "action", yawDeg: 496.75, pitchDeg: 4.58 },
      { label: Acoes.LUVAS, actionType: "action", yawDeg: 470.97, pitchDeg: 4.58 },
      { label: Acoes.CURATIVO, actionType: "action", yawDeg: 466.38, pitchDeg: 25.78 },
      { label: Acoes.COMPRESSAO, actionType: "action", yawDeg: 1349.31, pitchDeg: 14.89 },
      { label: Acoes.MEDICO, actionType: "action", yawDeg: 1467.91, pitchDeg: 17.76 }
    ]
  }
};
