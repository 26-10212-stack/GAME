/* Monster Chess Tactics - Full Game Engine */

// --- 1. 유닛 및 시너지 마스터 데이터베이스 ---
const SYNERGY_INFO = {
  "전사": {
    name: "전사",
    icon: "🛡️",
    desc: "전사들의 방어력과 체력이 크게 증가합니다.",
    tiers: [
      { count: 2, bonus: "아군 전사 방어력 +25" },
      { count: 4, bonus: "아군 전사 방어력 +60, 체력 +200" }
    ]
  },
  "마법사": {
    name: "마법사",
    icon: "🔮",
    desc: "모든 아군의 마법 주문력과 마나 재생이 상승합니다.",
    tiers: [
      { count: 2, bonus: "모든 아군 주문력 +30%" },
      { count: 4, bonus: "모든 아군 주문력 +75%, 스킬 시전 시 마나 20 반환" }
    ]
  },
  "암살자": {
    name: "암살자",
    icon: "🗡️",
    desc: "치명타 확률과 치명타 피해량이 증가합니다.",
    tiers: [
      { count: 2, bonus: "암살자 치명타율 +30%, 치명타 피해 +50%" },
      { count: 3, bonus: "암살자 치명타율 +60%, 치명타 피해 +120%" }
    ]
  },
  "궁수": {
    name: "궁수",
    icon: "🏹",
    desc: "공격할 때마다 공격 속도가 영구히 중첩됩니다.",
    tiers: [
      { count: 2, bonus: "공격당 공격속도 +8% (최대 10회 중첩)" },
      { count: 4, bonus: "공격당 공격속도 +18% (최대 10회 중첩)" }
    ]
  },
  "야수": {
    name: "야수",
    icon: "🐺",
    desc: "기본 공격 시 흡혈 효과를 얻습니다.",
    tiers: [
      { count: 2, bonus: "야수 피해의 25% 체력 회복" },
      { count: 4, bonus: "모든 아군 피해의 40% 체력 회복" }
    ]
  },
  "불꽃": {
    name: "불꽃",
    icon: "🔥",
    desc: "스킬 사용 시 대상을 불태워 지속 피해를 줍니다.",
    tiers: [
      { count: 2, bonus: "적에게 4초간 총 160의 고정 연소 피해" }
    ]
  },
  "신성": {
    name: "신성",
    icon: "✨",
    desc: "전투 시작 시 모든 아군에게 강력한 보호막을 제공합니다.",
    tiers: [
      { count: 2, bonus: "전투 시작 시 아군 전체에 250의 쉴드 부여" }
    ]
  }
};

const UNIT_POOL = [
  // 1코스트 (Tier 1)
  {
    id: "knight",
    name: "방패병",
    cost: 1,
    icon: "🛡️",
    traits: ["전사"],
    hp: 650,
    maxMana: 70,
    ad: 45,
    armor: 35,
    range: 1,
    skillName: "철벽 방패",
    skillDesc: "방어막 300을 얻고 주변 적에게 100의 피해를 줍니다.",
    skillCost: 70
  },
  {
    id: "scout",
    name: "궁수",
    cost: 1,
    icon: "🏹",
    traits: ["궁수"],
    hp: 450,
    maxMana: 60,
    ad: 50,
    armor: 15,
    range: 4,
    skillName: "연발 사격",
    skillDesc: "대상에게 빠르게 3연속 화살(총 180의 물리 피해)을 발사합니다.",
    skillCost: 60
  },
  {
    id: "wolf",
    name: "들개",
    cost: 1,
    icon: "🐺",
    traits: ["야수", "전사"],
    hp: 550,
    maxMana: 50,
    ad: 55,
    armor: 20,
    range: 1,
    skillName: "사나운 돌진",
    skillDesc: "적을 물어뜯어 150의 피해를 주고 1초간 기절시킵니다.",
    skillCost: 50
  },
  {
    id: "apprentice",
    name: "견습 법사",
    cost: 1,
    icon: "🔮",
    traits: ["마법사"],
    hp: 420,
    maxMana: 50,
    ad: 35,
    armor: 10,
    range: 3,
    skillName: "화염구",
    skillDesc: "대상 적에게 160의 광역 마법 피해를 폭발시킵니다.",
    skillCost: 50
  },

  // 2코스트 (Tier 2)
  {
    id: "rogue",
    name: "그림자 칼날",
    cost: 2,
    icon: "🗡️",
    traits: ["암살자"],
    hp: 550,
    maxMana: 60,
    ad: 65,
    armor: 20,
    range: 1,
    skillName: "암습 절단",
    skillDesc: "적의 등 뒤로 도약해 240의 치명타 마법 피해를 입힙니다.",
    skillCost: 60
  },
  {
    id: "pyro",
    name: "화염술사",
    cost: 2,
    icon: "🔥",
    traits: ["마법사", "불꽃"],
    hp: 500,
    maxMana: 70,
    ad: 40,
    armor: 15,
    range: 3,
    skillName: "화염 폭풍",
    skillDesc: "적 밀집 지역에 250의 화염 폭풍을 소환합니다.",
    skillCost: 70
  },
  {
    id: "bear",
    name: "불곰",
    cost: 2,
    icon: "🐻",
    traits: ["야수", "전사"],
    hp: 800,
    maxMana: 80,
    ad: 60,
    armor: 30,
    range: 1,
    skillName: "포효",
    skillDesc: "포효하여 아군 공격력을 20% 올리고 적에게 150 피해를 입힙니다.",
    skillCost: 80
  },
  {
    id: "priest",
    name: "성직자",
    cost: 2,
    icon: "✨",
    traits: ["신성"],
    hp: 520,
    maxMana: 70,
    ad: 35,
    armor: 20,
    range: 3,
    skillName: "신성한 은총",
    skillDesc: "체력이 가장 낮은 아군 2명의 체력을 280 회복시킵니다.",
    skillCost: 70
  },

  // 3코스트 (Tier 3)
  {
    id: "valkyrie",
    name: "발키리",
    cost: 3,
    icon: "⚔️",
    traits: ["전사", "신성"],
    hp: 950,
    maxMana: 80,
    ad: 75,
    armor: 45,
    range: 1,
    skillName: "신의 일격",
    skillDesc: "창을 내리꽂아 가로 일렬 적에게 320 마법 피해를 입힙니다.",
    skillCost: 80
  },
  {
    id: "sniper",
    name: "명사수",
    cost: 3,
    icon: "🎯",
    traits: ["궁수"],
    hp: 600,
    maxMana: 75,
    ad: 85,
    armor: 20,
    range: 5,
    skillName: "저격",
    skillDesc: "가장 먼 적에게 조준 사격을 날려 450의 치명적 피해를 입힙니다.",
    skillCost: 75
  },
  {
    id: "reaper",
    name: "사신",
    cost: 3,
    icon: "👻",
    traits: ["암살자", "마법사"],
    hp: 650,
    maxMana: 60,
    ad: 70,
    armor: 25,
    range: 1,
    skillName: "영혼 수확",
    skillDesc: "주변 모든 적의 영혼을 베어 220 마법 피해를 주고 체력을 흡수합니다.",
    skillCost: 60
  },

  // 4코스트 (Tier 4)
  {
    id: "archmage",
    name: "대마법사",
    cost: 4,
    icon: "🧙‍♂️",
    traits: ["마법사", "불꽃"],
    hp: 750,
    maxMana: 100,
    ad: 50,
    armor: 25,
    range: 4,
    skillName: "유성 낙하",
    skillDesc: "적 전체 진영에 거대한 메테오를 떨어뜨려 420 광역 피해를 줍니다.",
    skillCost: 100
  },
  {
    id: "dragon_slayer",
    name: "드래곤 슬레이어",
    cost: 4,
    icon: "🐲",
    traits: ["전사", "궁수"],
    hp: 1100,
    maxMana: 80,
    ad: 105,
    armor: 50,
    range: 2,
    skillName: "용의 분노",
    skillDesc: "6초간 공격력이 80% 증가하고 모든 공격이 스플래시 피해를 줍니다.",
    skillCost: 80
  },

  // 5코스트 (Tier 5)
  {
    id: "dragon_god",
    name: "고대 용왕",
    cost: 5,
    icon: "👑",
    traits: ["야수", "불꽃", "신성"],
    hp: 1500,
    maxMana: 120,
    ad: 130,
    armor: 60,
    range: 2,
    skillName: "천벌 브레스",
    skillDesc: "전체 전장에 불꽃 브레스를 뿜어 600의 고정 피해를 입히고 기절시킵니다.",
    skillCost: 120
  }
];

// 레벨별 코스트 출현 확률표 (Lv 1 ~ 9)
const SHOP_RATES = {
  1: [1.00, 0.00, 0.00, 0.00, 0.00],
  2: [1.00, 0.00, 0.00, 0.00, 0.00],
  3: [0.75, 0.25, 0.00, 0.00, 0.00],
  4: [0.55, 0.30, 0.15, 0.00, 0.00],
  5: [0.45, 0.33, 0.20, 0.02, 0.00],
  6: [0.30, 0.40, 0.25, 0.05, 0.00],
  7: [0.20, 0.35, 0.30, 0.14, 0.01],
  8: [0.15, 0.25, 0.35, 0.20, 0.05],
  9: [0.10, 0.15, 0.30, 0.30, 0.15]
};

// 레벨업 필요 경험치
const EXP_TABLE = {
  1: 2,
  2: 2,
  3: 6,
  4: 10,
  5: 20,
  6: 36,
  7: 56,
  8: 80,
  9: 999
};

// --- 2. 게임 상태 객체 ---
const GAME = {
  state: "PREPARATION", // "PREPARATION" | "COMBAT"
  stage: 1,
  round: 1,
  timer: 20,
  timerInterval: null,

  player: {
    hp: 100,
    gold: 100,
    streak: 0,
    level: 1,
    exp: 0,
    maxExp: 2,
    board: Array(32).fill(null), // 8 cols x 4 rows
    bench: Array(8).fill(null),   // 8 slots
    shopLocked: false,
    shopCards: []
  },

  enemy: {
    board: Array(32).fill(null)
  },

  combat: {
    units: [], // 전투 중인 유닛 인스턴스 배열
    interval: null,
    dps: {} // unitId -> totalDamage
  },

  stats: {
    kills: 0
  },

  draggedData: null // { source: 'bench'|'board', index: number, unit: Unit }
};

// --- 3. 유닛 인스턴스 클래스 ---
let uniqueUnitCounter = 1;
class UnitInstance {
  constructor(baseData, star = 1, isEnemy = false) {
    this.instanceId = uniqueUnitCounter++;
    this.base = baseData;
    this.id = baseData.id;
    this.name = baseData.name;
    this.cost = baseData.cost;
    this.icon = baseData.icon;
    this.traits = [...baseData.traits];
    this.star = star;
    this.isEnemy = isEnemy;

    // 성급 계수 (1성: x1, 2성: x1.8, 3성: x3.24)
    const starMult = star === 1 ? 1 : star === 2 ? 1.8 : 3.24;

    this.maxHp = Math.floor(baseData.hp * starMult);
    this.hp = this.maxHp;
    this.shield = 0;
    this.maxMana = baseData.maxMana;
    this.mana = 0;
    this.ad = Math.floor(baseData.ad * starMult);
    this.armor = baseData.armor;
    this.range = baseData.range;
    this.skillName = baseData.skillName;
    this.skillDesc = baseData.skillDesc;

    // 전투 중 동적 변수
    this.gridIndex = -1; // 0~31
    this.target = null;
    this.attackCooldown = 0;
    this.attackSpeed = 1.0; // 초당 공격수
    this.speedStacks = 0;
    this.isStunned = 0;
    this.burnDuration = 0;
    this.damageDealt = 0;
  }
}

// --- 4. DOM 요소 캐싱 ---
const DOM = {
  playerHp: document.getElementById("player-hp"),
  playerGold: document.getElementById("player-gold"),
  winStreak: document.getElementById("win-streak"),
  playerLvl: document.getElementById("player-lvl"),
  playerExp: document.getElementById("player-exp"),
  playerMaxExp: document.getElementById("player-max-exp"),
  stageRoundDisplay: document.getElementById("stage-round-display"),
  roundTimerBar: document.getElementById("round-timer-bar"),
  timerText: document.getElementById("timer-text"),
  btnBuyXp: document.getElementById("btn-buy-xp"),
  btnReadyCombat: document.getElementById("btn-ready-combat"),
  synergyList: document.getElementById("synergy-list"),
  combatDpsPanel: document.getElementById("combat-dps-panel"),
  dpsList: document.getElementById("dps-list"),
  enemyBoard: document.getElementById("enemy-board"),
  playerBoard: document.getElementById("player-board"),
  playerBench: document.getElementById("player-bench"),
  placedUnitsCount: document.getElementById("placed-units-count"),
  maxUnitsCount: document.getElementById("max-units-count"),
  shopCardsContainer: document.getElementById("shop-cards-container"),
  btnReroll: document.getElementById("btn-reroll"),
  btnLockShop: document.getElementById("btn-lock-shop"),
  lockIcon: document.getElementById("lock-icon"),
  unitTooltip: document.getElementById("unit-tooltip"),
  sellDropzone: document.getElementById("sell-dropzone"),
  sellText: document.getElementById("sell-text"),
  modalGameOver: document.getElementById("modal-gameover"),
  gameoverTitle: document.getElementById("gameover-title"),
  statFinalStage: document.getElementById("stat-final-stage"),
  statFinalKills: document.getElementById("stat-final-kills"),
  btnRestart: document.getElementById("btn-restart")
};

// --- 5. 초기화 및 보드 생성 ---
function initGame() {
  createBoardCells();
  bindEvents();
  startPreparationPhase();
}

function createBoardCells() {
  // 적 보드 8x4 = 32칸
  DOM.enemyBoard.innerHTML = "";
  for (let i = 0; i < 32; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    DOM.enemyBoard.appendChild(cell);
  }

  // 아군 보드 8x4 = 32칸
  DOM.playerBoard.innerHTML = "";
  for (let i = 0; i < 32; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    setupDropTarget(cell, "board", i);
    DOM.playerBoard.appendChild(cell);
  }

  // 벤치 8칸
  DOM.playerBench.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    setupDropTarget(cell, "bench", i);
    DOM.playerBench.appendChild(cell);
  }
}

// --- 6. 드래그 앤 드롭 및 클릭 조작 ---
function setupDropTarget(cell, targetType, targetIndex) {
  cell.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (GAME.state !== "PREPARATION") return;
    cell.classList.add("valid-drop");
  });

  cell.addEventListener("dragleave", () => {
    cell.classList.remove("valid-drop");
  });

  cell.addEventListener("drop", (e) => {
    e.preventDefault();
    cell.classList.remove("valid-drop");
    if (GAME.state !== "PREPARATION" || !GAME.draggedData) return;

    handleUnitDrop(GAME.draggedData, targetType, targetIndex);
    GAME.draggedData = null;
  });

  cell.addEventListener("click", () => {
    // 벤치 <-> 보드 빠른 배치 편의기능
    if (GAME.state !== "PREPARATION") return;
    if (targetType === "bench" && GAME.player.bench[targetIndex]) {
      // 벤치 유닛 빈 보드 슬롯에 자동배치 시도
      const unit = GAME.player.bench[targetIndex];
      const emptyBoardIdx = GAME.player.board.findIndex(u => u === null);
      const placedCount = GAME.player.board.filter(u => u !== null).length;
      if (emptyBoardIdx !== -1 && placedCount < GAME.player.level) {
        GAME.player.board[emptyBoardIdx] = unit;
        GAME.player.bench[targetIndex] = null;
        updateUI();
      }
    }
  });
}

function handleUnitDrop(dragged, targetType, targetIndex) {
  const { source, index: srcIndex, unit } = dragged;

  // 소스 리스트와 타겟 리스트 참조
  const srcList = source === "board" ? GAME.player.board : GAME.player.bench;
  const targetList = targetType === "board" ? GAME.player.board : GAME.player.bench;

  // 보드로 올릴 때 최대 유닛 수 체크
  if (source === "bench" && targetType === "board" && !targetList[targetIndex]) {
    const currentOnBoard = GAME.player.board.filter(u => u !== null).length;
    if (currentOnBoard >= GAME.player.level) {
      showToast(`레벨 ${GAME.player.level}: 유닛 배치 한도 초과!`);
      return;
    }
  }

  // 스왑 또는 단순 이동
  const targetUnit = targetList[targetIndex];
  targetList[targetIndex] = unit;
  srcList[srcIndex] = targetUnit;

  updateUI();
}

// --- 7. 유닛 UI 렌더링 헬퍼 ---
function renderUnitElement(unit) {
  const el = document.createElement("div");
  el.className = `chess-unit tier-${unit.cost} ${unit.isEnemy ? "enemy" : ""}`;
  el.draggable = !unit.isEnemy && GAME.state === "PREPARATION";

  // 별표 생성
  const starsStr = "★".repeat(unit.star);
  const starsDiv = document.createElement("div");
  starsDiv.className = "unit-stars";
  starsDiv.textContent = starsStr;
  el.appendChild(starsDiv);

  // 아이콘
  const iconDiv = document.createElement("div");
  iconDiv.className = "unit-icon";
  iconDiv.textContent = unit.icon;
  el.appendChild(iconDiv);

  // 체력 및 마나 바
  const barsDiv = document.createElement("div");
  barsDiv.className = "unit-status-bars";

  const hpBg = document.createElement("div");
  hpBg.className = "hp-bar-bg";
  const hpFill = document.createElement("div");
  hpFill.className = "hp-bar-fill";
  const hpRatio = Math.max(0, Math.min(100, (unit.hp / unit.maxHp) * 100));
  hpFill.style.width = `${hpRatio}%`;
  hpBg.appendChild(hpFill);

  const manaBg = document.createElement("div");
  manaBg.className = "mana-bar-bg";
  const manaFill = document.createElement("div");
  manaFill.className = "mana-bar-fill";
  const manaRatio = Math.max(0, Math.min(100, (unit.mana / unit.maxMana) * 100));
  manaFill.style.width = `${manaRatio}%`;
  manaBg.appendChild(manaFill);

  barsDiv.appendChild(hpBg);
  barsDiv.appendChild(manaBg);
  el.appendChild(barsDiv);

  // 툴팁 이벤트
  el.addEventListener("mouseenter", (e) => showUnitTooltip(e, unit));
  el.addEventListener("mouseleave", hideUnitTooltip);

  // 드래그 이벤트 (아군만)
  if (!unit.isEnemy) {
    el.addEventListener("dragstart", (e) => {
      if (GAME.state !== "PREPARATION") {
        e.preventDefault();
        return;
      }
      const parentCell = el.parentElement;
      const isBoard = parentCell.parentElement.id === "player-board";
      GAME.draggedData = {
        source: isBoard ? "board" : "bench",
        index: parseInt(parentCell.dataset.index),
        unit: unit
      };
      e.dataTransfer.setData("text/plain", unit.name);

      // 판매 구역 안내문 업데이트
      const refund = getUnitSellPrice(unit);
      DOM.sellText.textContent = `판매하기 (+${refund} 골드 획득)`;
      DOM.sellDropzone.classList.add("active-drag");
    });

    el.addEventListener("dragend", () => {
      DOM.sellDropzone.classList.remove("active-drag");
      DOM.sellText.textContent = "유닛을 여기로 드래그하여 판매";
    });
  }

  return el;
}

// 유닛 판매 가격 계산 (1성: cost, 2성: cost*3-1(또는 기본배수), 3성)
function getUnitSellPrice(unit) {
  if (unit.star === 1) return unit.cost;
  if (unit.star === 2) return Math.max(1, unit.cost * 3 - (unit.cost > 1 ? 1 : 0));
  return Math.max(1, unit.cost * 9 - 2);
}

function sellUnit(draggedData) {
  const { source, index, unit } = draggedData;
  const list = source === "board" ? GAME.player.board : GAME.player.bench;
  
  if (list[index] && list[index].instanceId === unit.instanceId) {
    const refund = getUnitSellPrice(unit);
    list[index] = null;
    GAME.player.gold += refund;
    showToast(`💰 ${unit.name} (${unit.star}성) 판매 완료! (+${refund}G)`);
    updateUI();
  }
}

// 툴팁
function showUnitTooltip(e, unit) {
  const sellPrice = getUnitSellPrice(unit);
  DOM.unitTooltip.innerHTML = `
    <div class="tooltip-title">${unit.name} ${"★".repeat(unit.star)}</div>
    <div class="tooltip-stat"><span>시너지:</span><span>${unit.traits.join(", ")}</span></div>
    <div class="tooltip-stat"><span>판매 가격:</span><span style="color:#ffd32a;font-weight:bold;">💰 ${sellPrice} Gold</span></div>
    <div class="tooltip-stat"><span>체력:</span><span>${Math.round(unit.hp)} / ${unit.maxHp}</span></div>
    <div class="tooltip-stat"><span>공격력:</span><span>${unit.ad}</span></div>
    <div class="tooltip-stat"><span>방어력:</span><span>${unit.armor}</span></div>
    <div class="tooltip-stat"><span>사거리:</span><span>${unit.range}칸</span></div>
    <div class="tooltip-skill">
      <b>${unit.skillName}</b> (마나: ${unit.maxMana})<br/>
      ${unit.skillDesc}
    </div>
  `;
  DOM.unitTooltip.style.display = "block";
  DOM.unitTooltip.style.left = `${Math.min(window.innerWidth - 240, e.clientX + 15)}px`;
  DOM.unitTooltip.style.top = `${Math.min(window.innerHeight - 200, e.clientY + 15)}px`;
}

function hideUnitTooltip() {
  DOM.unitTooltip.style.display = "none";
}

// 토스트 메시지
function showToast(msg) {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.top = "75px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "rgba(231, 76, 60, 0.9)";
  toast.style.color = "#fff";
  toast.style.padding = "8px 18px";
  toast.style.borderRadius = "20px";
  toast.style.fontSize = "13px";
  toast.style.fontWeight = "bold";
  toast.style.zIndex = "1000";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1600);
}

// --- 8. 상점 및 3성 합성 시스템 ---
function rollShop() {
  const rates = SHOP_RATES[GAME.player.level] || SHOP_RATES[9];
  const newCards = [];

  for (let i = 0; i < 5; i++) {
    const rand = Math.random();
    let accum = 0;
    let chosenTier = 1;
    for (let t = 0; t < rates.length; t++) {
      accum += rates[t];
      if (rand <= accum) {
        chosenTier = t + 1;
        break;
      }
    }

    const availableUnits = UNIT_POOL.filter(u => u.cost === chosenTier);
    const chosenUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
    newCards.push(chosenUnit);
  }

  GAME.player.shopCards = newCards;
  renderShop();
}

function renderShop() {
  DOM.shopCardsContainer.innerHTML = "";

  GAME.player.shopCards.forEach((unitData, idx) => {
    if (!unitData) {
      // 이미 구매된 빈 카드 슬롯
      const emptyCard = document.createElement("div");
      emptyCard.className = "shop-card disabled";
      emptyCard.innerHTML = `<span style="margin:auto;color:#495d82;font-size:12px;">구매 완료</span>`;
      DOM.shopCardsContainer.appendChild(emptyCard);
      return;
    }

    const card = document.createElement("div");
    card.className = `shop-card tier-${unitData.cost}`;
    card.innerHTML = `
      <div class="card-header">
        <span class="card-name">${unitData.name}</span>
        <span class="card-cost">${unitData.cost}G</span>
      </div>
      <div class="card-body">
        <div class="card-icon">${unitData.icon}</div>
        <div class="card-traits">
          ${unitData.traits.map(t => `<span class="card-trait">${t}</span>`).join("")}
        </div>
      </div>
      <div class="card-skill">${unitData.skillName}</div>
    `;

    card.addEventListener("click", () => buyUnit(idx));
    DOM.shopCardsContainer.appendChild(card);
  });
}

function buyUnit(shopIdx) {
  const unitData = GAME.player.shopCards[shopIdx];
  if (!unitData) return;

  if (GAME.player.gold < unitData.cost) {
    showToast("골드가 부족합니다!");
    return;
  }

  // 벤치 빈자리 탐색
  const emptyBenchIdx = GAME.player.bench.findIndex(u => u === null);
  if (emptyBenchIdx === -1) {
    showToast("대기석이 가득 찼습니다!");
    return;
  }

  // 골드 차감
  GAME.player.gold -= unitData.cost;
  const newUnit = new UnitInstance(unitData, 1, false);
  GAME.player.bench[emptyBenchIdx] = newUnit;
  GAME.player.shopCards[shopIdx] = null; // 카드 소모

  // 자동 3개 합성(성급 진화) 체크
  checkAutoCombine(unitData.id);

  updateUI();
  renderShop();
}

// 3성 자동 합성 알고리즘 (3개 1성 -> 1개 2성, 3개 2성 -> 1개 3성)
function checkAutoCombine(unitId) {
  // 1성 -> 2성 합성
  combineTier(unitId, 1);
  // 2성 -> 3성 합성
  combineTier(unitId, 2);
}

function combineTier(unitId, targetStar) {
  // 플레이어의 보드와 벤치에서 동일 유닛의 해당 성급 찾기
  const matches = [];

  GAME.player.board.forEach((u, idx) => {
    if (u && u.id === unitId && u.star === targetStar) {
      matches.push({ location: "board", index: idx, unit: u });
    }
  });

  GAME.player.bench.forEach((u, idx) => {
    if (u && u.id === unitId && u.star === targetStar) {
      matches.push({ location: "bench", index: idx, unit: u });
    }
  });

  if (matches.length >= 3) {
    // 3개 소모하여 첫 번째 위치의 유닛을 승급
    const baseUnitTarget = matches[0];
    const upgradedStar = targetStar + 1;
    const upgradedUnit = new UnitInstance(baseUnitTarget.unit.base, upgradedStar, false);

    // 나머지 2개 제거
    for (let i = 1; i < 3; i++) {
      const match = matches[i];
      if (match.location === "board") GAME.player.board[match.index] = null;
      else GAME.player.bench[match.index] = null;
    }

    // 첫 번째 위치를 새 진화 유닛으로 교체
    if (baseUnitTarget.location === "board") {
      GAME.player.board[baseUnitTarget.index] = upgradedUnit;
    } else {
      GAME.player.bench[baseUnitTarget.index] = upgradedUnit;
    }

    showEvolutionNotice(upgradedUnit);
  }
}

function showEvolutionNotice(unit) {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.top = "120px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "linear-gradient(135deg, #f1c40f, #e67e22)";
  toast.style.color = "#000";
  toast.style.padding = "10px 24px";
  toast.style.borderRadius = "24px";
  toast.style.fontSize = "15px";
  toast.style.fontWeight = "900";
  toast.style.boxShadow = "0 0 20px rgba(241, 196, 15, 0.6)";
  toast.style.zIndex = "1000";
  toast.innerHTML = `✨ ${unit.name} ${unit.star}성 진화 완료! ✨`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// --- 9. 시너지 계산 시스템 ---
function calculateSynergies() {
  const counts = {};
  const seenUnits = new Set();

  // 필드(보드)에 배치된 고유 아군 유닛의 시너지 집계 (중복 유닛은 1개로만 카운트)
  GAME.player.board.forEach(unit => {
    if (unit && !seenUnits.has(unit.id)) {
      seenUnits.add(unit.id);
      unit.traits.forEach(trait => {
        counts[trait] = (counts[trait] || 0) + 1;
      });
    }
  });

  // UI 렌더링
  DOM.synergyList.innerHTML = "";
  const activeSynergies = {};

  Object.entries(counts).forEach(([trait, count]) => {
    const info = SYNERGY_INFO[trait];
    if (!info) return;

    let highestTier = null;
    info.tiers.forEach(t => {
      if (count >= t.count) highestTier = t;
    });

    const isActivated = highestTier !== null;
    activeSynergies[trait] = { count, highestTier };

    const item = document.createElement("div");
    item.className = `synergy-item ${isActivated ? "active" : ""}`;
    item.innerHTML = `
      <div class="synergy-name-tag">
        <span>${info.icon}</span>
        <span>${info.name}</span>
      </div>
      <div class="synergy-counts">${count}</div>
    `;

    item.title = `${info.desc}\n` + info.tiers.map(t => `(${t.count}) ${t.bonus}`).join("\n");
    DOM.synergyList.appendChild(item);
  });

  if (Object.keys(counts).length === 0) {
    DOM.synergyList.innerHTML = `<div class="empty-synergy" style="font-size:11px;color:#70819e;text-align:center;padding:10px;">체스를 배치하여 시너지를 활성화하세요!</div>`;
  }

  return activeSynergies;
}

// 시너지 효과 유닛 스탯에 적용
function applySynergyBuffs(units, activeSynergies) {
  units.forEach(u => {
    if (u.isEnemy) return;

    // 전사 시너지
    if (activeSynergies["전사"] && activeSynergies["전사"].highestTier && u.traits.includes("전사")) {
      const bonusArmor = activeSynergies["전사"].count >= 4 ? 60 : 25;
      u.armor += bonusArmor;
      if (activeSynergies["전사"].count >= 4) {
        u.maxHp += 200;
        u.hp += 200;
      }
    }

    // 신성 시너지 (보호막)
    if (activeSynergies["신성"] && activeSynergies["신성"].highestTier) {
      u.shield += 250;
    }
  });
}

// --- 10. AI 적 생성 (스테이지 단계별 빌드) ---
function generateEnemyTeam() {
  GAME.enemy.board = Array(32).fill(null);
  const stage = GAME.stage;
  const round = GAME.round;
  const totalRounds = (stage - 1) * 4 + round;

  // 라운드가 지날수록 적의 수 및 고티어 등장
  let enemyCount = Math.min(8, Math.max(1, Math.floor(totalRounds * 0.9) + 1));

  // 적 유닛 풀 필터 (초반은 1~2코스트, 후반은 3~5코스트)
  const maxCostAllowed = Math.min(5, Math.ceil(totalRounds / 2.5));
  const pool = UNIT_POOL.filter(u => u.cost <= maxCostAllowed);

  // 랜덤 위치 배치 (적 진영: 뒷열 3줄 및 앞열 1줄 분산)
  for (let i = 0; i < enemyCount; i++) {
    const base = pool[Math.floor(Math.random() * pool.length)];
    // 라운드가 높으면 적도 2성 등장
    const star = (totalRounds >= 4 && Math.random() < 0.45) ? 2 : 1;
    const enemyUnit = new UnitInstance(base, star, true);

    let randomIdx;
    do {
      randomIdx = Math.floor(Math.random() * 32);
    } while (GAME.enemy.board[randomIdx] !== null);

    GAME.enemy.board[randomIdx] = enemyUnit;
  }
}

// --- 11. 게임 페이즈 순환 (준비 & 전투) ---
function startPreparationPhase() {
  GAME.state = "PREPARATION";
  DOM.btnReadyCombat.disabled = false;
  DOM.btnReadyCombat.textContent = "전투 시작 ⚔️";
  DOM.combatDpsPanel.style.display = "none";

  // 기본 라운드 이자 & 골드 지급 (+10 기본 + 이자 최대 10G + 연승 보너스)
  const interest = Math.min(10, Math.floor(GAME.player.gold / 10));
  const streakBonus = Math.min(5, Math.floor(GAME.player.streak / 2));
  const roundGold = 10 + interest + streakBonus;

  // 첫 라운드 제외 골드 지급
  if (!(GAME.stage === 1 && GAME.round === 1)) {
    GAME.player.gold += roundGold;
  }

  // 매 라운드 자연 경험치 +2
  if (GAME.player.level < 9) {
    addExp(2);
  }

  // 상점 잠금이 아니면 자동 리롤
  if (!GAME.player.shopLocked) {
    rollShop();
  } else {
    // 잠금 상태는 1라운드 유지 후 해제
    GAME.player.shopLocked = false;
    DOM.lockIcon.textContent = "🔓";
  }

  // 적 팀 프리뷰 생성
  generateEnemyTeam();

  // 타이머 15초 카운트다운
  GAME.timer = 15;
  clearInterval(GAME.timerInterval);
  updateTimerUI();

  GAME.timerInterval = setInterval(() => {
    GAME.timer--;
    updateTimerUI();
    if (GAME.timer <= 0) {
      clearInterval(GAME.timerInterval);
      startCombatPhase();
    }
  }, 1000);

  updateUI();
}

function updateTimerUI() {
  DOM.timerText.textContent = GAME.state === "PREPARATION"
    ? `준비 시간: ${GAME.timer}초`
    : `전투 진행 중... (${GAME.timer}초)`;

  const total = GAME.state === "PREPARATION" ? 15 : 30;
  const pct = Math.max(0, (GAME.timer / total) * 100);
  DOM.roundTimerBar.style.width = `${pct}%`;
  DOM.roundTimerBar.style.backgroundColor = GAME.state === "PREPARATION" ? "#3498db" : "#e74c3c";
}

function startCombatPhase() {
  // 보드에 아군 유닛이 한 마리도 없으면 벤치에서 강제 배치
  const placedUnits = GAME.player.board.filter(u => u !== null);
  if (placedUnits.length === 0) {
    const firstBench = GAME.player.bench.find(u => u !== null);
    if (firstBench) {
      const bIdx = GAME.player.bench.indexOf(firstBench);
      GAME.player.board[27] = firstBench; // 중앙 앞열
      GAME.player.bench[bIdx] = null;
    }
  }

  GAME.state = "COMBAT";
  clearInterval(GAME.timerInterval);
  DOM.btnReadyCombat.disabled = true;
  DOM.btnReadyCombat.textContent = "전투 진행 중...";
  DOM.combatDpsPanel.style.display = "block";
  DOM.dpsList.innerHTML = "";

  // 시너지 활성화 상태 계산 및 버프
  const activeSynergies = calculateSynergies();

  // 전투 인스턴스 복제 준비
  const combatUnits = [];

  // 아군 추가
  GAME.player.board.forEach((u, idx) => {
    if (u) {
      // 복사본 생성하여 전투
      const clone = new UnitInstance(u.base, u.star, false);
      clone.gridIndex = idx;
      clone.isPlayerSide = true;
      combatUnits.push(clone);
    }
  });

  // 적군 추가
  GAME.enemy.board.forEach((u, idx) => {
    if (u) {
      const clone = new UnitInstance(u.base, u.star, true);
      clone.gridIndex = idx;
      clone.isPlayerSide = false;
      combatUnits.push(clone);
    }
  });

  applySynergyBuffs(combatUnits, activeSynergies);

  GAME.combat.units = combatUnits;
  GAME.combat.dps = {};

  // 30초 전투 타이머
  GAME.timer = 30;
  updateTimerUI();
  GAME.timerInterval = setInterval(() => {
    GAME.timer--;
    updateTimerUI();
    if (GAME.timer <= 0) {
      endCombatPhase("DRAW");
    }
  }, 1000);

  // 전투 틱 루프 (200ms 단위)
  clearInterval(GAME.combat.interval);
  GAME.combat.interval = setInterval(combatTick, 200);
}

// --- 12. 실시간 자동 전투 엔진 (Auto-Battler Core) ---
function combatTick() {
  const units = GAME.combat.units;

  // 승패 판정
  const playerAlive = units.filter(u => !u.isEnemy && u.hp > 0);
  const enemyAlive = units.filter(u => u.isEnemy && u.hp > 0);

  if (playerAlive.length === 0 && enemyAlive.length === 0) {
    endCombatPhase("DRAW");
    return;
  }
  if (playerAlive.length === 0) {
    endCombatPhase("DEFEAT", enemyAlive.length);
    return;
  }
  if (enemyAlive.length === 0) {
    endCombatPhase("VICTORY");
    return;
  }

  // 각 유닛 AI 행동
  units.forEach(unit => {
    if (unit.hp <= 0) return;

    // 기절/연소 상태 이상 처리
    if (unit.isStunned > 0) {
      unit.isStunned -= 0.2;
      return;
    }
    if (unit.burnDuration > 0) {
      unit.burnDuration -= 0.2;
      applyDamage(unit, 8, "magic"); // 연소 피해
    }

    // 마나 가득 차면 스킬 시전!
    if (unit.mana >= unit.maxMana) {
      castSkill(unit, units);
      return;
    }

    // 타겟 탐색 (가장 가까운 적)
    if (!unit.target || unit.target.hp <= 0) {
      unit.target = findClosestEnemy(unit, units);
    }

    if (!unit.target) return;

    // 거리 계산
    const dist = getGridDistance(unit.gridIndex, unit.isPlayerSide, unit.target.gridIndex, unit.target.isPlayerSide);

    if (dist <= unit.range) {
      // 사거리 내: 공격 쿨다운 체크 후 공격
      unit.attackCooldown -= 0.2;
      if (unit.attackCooldown <= 0) {
        performAttack(unit, unit.target);
        unit.attackCooldown = 1.0 / unit.attackSpeed;
      }
    } else {
      // 사거리 밖: 타겟을 향해 1칸 이동
      moveUnitCloser(unit, unit.target, units);
    }
  });

  renderCombatBoard();
  renderDPS();
}

// 거리 계산 헬퍼 (그리드 좌표 변환)
function getGridDistance(idxA, isPlayerA, idxB, isPlayerB) {
  const colA = idxA % 8;
  const rowA = isPlayerA ? (idxA >> 3) + 4 : (idxA >> 3); // 플레이어는 아래쪽 4줄 (4~7)

  const colB = idxB % 8;
  const rowB = isPlayerB ? (idxB >> 3) + 4 : (idxB >> 3);

  return Math.max(Math.abs(colA - colB), Math.abs(rowA - rowB));
}

function findClosestEnemy(unit, allUnits) {
  const enemies = allUnits.filter(u => u.isEnemy !== unit.isEnemy && u.hp > 0);
  let closest = null;
  let minDist = 999;

  enemies.forEach(e => {
    const dist = getGridDistance(unit.gridIndex, unit.isPlayerSide, e.gridIndex, e.isPlayerSide);
    if (dist < minDist) {
      minDist = dist;
      closest = e;
    }
  });

  return closest;
}

// 이동 알고리즘
function moveUnitCloser(unit, target, allUnits) {
  const colA = unit.gridIndex % 8;
  const rowA = unit.gridIndex >> 3;

  const targetRow = target.isPlayerSide === unit.isPlayerSide ? (target.gridIndex >> 3) : (unit.isPlayerSide ? 0 : 3);
  const targetCol = target.gridIndex % 8;

  let stepCol = 0;
  let stepRow = 0;

  if (colA < targetCol) stepCol = 1;
  else if (colA > targetCol) stepCol = -1;

  if (rowA < targetRow) stepRow = 1;
  else if (rowA > targetRow) stepRow = -1;

  // 이동할 새 인덱스 시도
  const newRow = Math.max(0, Math.min(3, rowA + stepRow));
  const newCol = Math.max(0, Math.min(7, colA + stepCol));
  const newIdx = newRow * 8 + newCol;

  // 이미 다른 살아있는 유닛이 있는지 확인
  const isOccupied = allUnits.some(u => u.hp > 0 && u.isPlayerSide === unit.isPlayerSide && u.gridIndex === newIdx);
  if (!isOccupied) {
    unit.gridIndex = newIdx;
  }
}

// 기본 공격
function performAttack(attacker, defender) {
  // 공격 애니메이션 표시용 이벤트 트리거
  triggerUnitAnim(attacker, "attacking");

  // 암살자 시너지 치명타 계산
  let isCrit = false;
  let critMult = 1.5;
  if (attacker.traits.includes("암살자")) {
    const critChance = 0.35;
    if (Math.random() < critChance) {
      isCrit = true;
      critMult = 2.2;
    }
  }

  // 데미지 계산 (방어력 감쇄: 100 / (100 + 방어력))
  const mitigation = 100 / (100 + defender.armor);
  let damage = Math.round(attacker.ad * mitigation * (isCrit ? critMult : 1.0));

  applyDamage(defender, damage, isCrit ? "crit" : "physical", attacker);

  // 궁수 시너지 공속 중첩
  if (attacker.traits.includes("궁수") && attacker.speedStacks < 10) {
    attacker.speedStacks++;
    attacker.attackSpeed += 0.08;
  }

  // 야수 시너지 흡혈
  if (attacker.traits.includes("야수")) {
    const heal = Math.round(damage * 0.35);
    attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal);
  }

  // 공격 시 마나 충전 (+12)
  attacker.mana = Math.min(attacker.maxMana, attacker.mana + 12);
}

// 데미지 적용 및 피격 반응
function applyDamage(target, damage, dmgType, attacker = null) {
  if (target.hp <= 0) return;

  // 쉴드 우선 소모
  if (target.shield > 0) {
    if (target.shield >= damage) {
      target.shield -= damage;
      damage = 0;
    } else {
      damage -= target.shield;
      target.shield = 0;
    }
  }

  target.hp -= damage;
  if (attacker) {
    attacker.damageDealt += damage;
    GAME.combat.dps[attacker.instanceId] = {
      name: attacker.name,
      star: attacker.star,
      icon: attacker.icon,
      isEnemy: attacker.isEnemy,
      dmg: (GAME.combat.dps[attacker.instanceId]?.dmg || 0) + damage
    };
  }

  // 피격 시 마나 획득 (+6)
  target.mana = Math.min(target.maxMana, target.mana + 6);

  triggerUnitAnim(target, "hit");
  spawnFloatingText(target, damage, dmgType);

  if (target.hp <= 0) {
    target.hp = 0;
    if (target.isEnemy) GAME.stats.kills++;
  }
}

// 스킬 발동 시스템
function castSkill(unit, allUnits) {
  unit.mana = 0;
  triggerUnitAnim(unit, "casting");

  // 스킬 고유 로직
  switch (unit.id) {
    case "knight": {
      unit.shield += 320 * unit.star;
      // 주변 적에게 방패 밀치기
      const enemies = allUnits.filter(u => u.isEnemy !== unit.isEnemy && u.hp > 0);
      enemies.forEach(e => {
        if (getGridDistance(unit.gridIndex, unit.isPlayerSide, e.gridIndex, e.isPlayerSide) <= 1) {
          applyDamage(e, 120 * unit.star, "magic", unit);
        }
      });
      break;
    }

    case "scout": {
      if (unit.target && unit.target.hp > 0) {
        let shotCount = 0;
        const arrowInterval = setInterval(() => {
          if (unit.target && unit.target.hp > 0) {
            applyDamage(unit.target, 70 * unit.star, "physical", unit);
          }
          shotCount++;
          if (shotCount >= 3) clearInterval(arrowInterval);
        }, 120);
      }
      break;
    }

    case "wolf": {
      if (unit.target && unit.target.hp > 0) {
        applyDamage(unit.target, 160 * unit.star, "physical", unit);
        unit.target.isStunned = 1.2;
      }
      break;
    }

    case "apprentice":
    case "pyro": {
      if (unit.target && unit.target.hp > 0) {
        const dmg = unit.id === "pyro" ? 260 * unit.star : 170 * unit.star;
        applyDamage(unit.target, dmg, "magic", unit);
        unit.target.burnDuration = 4.0;
      }
      break;
    }

    case "rogue": {
      if (unit.target && unit.target.hp > 0) {
        applyDamage(unit.target, 280 * unit.star, "crit", unit);
      }
      break;
    }

    case "bear": {
      // 버프 + 전방 타격
      unit.ad = Math.round(unit.ad * 1.3);
      if (unit.target && unit.target.hp > 0) {
        applyDamage(unit.target, 180 * unit.star, "physical", unit);
      }
      break;
    }

    case "priest": {
      // 아군 힐링
      const allies = allUnits.filter(u => u.isEnemy === unit.isEnemy && u.hp > 0);
      allies.sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp));
      allies.slice(0, 2).forEach(ally => {
        ally.hp = Math.min(ally.maxHp, ally.hp + 280 * unit.star);
        spawnFloatingText(ally, `+${280 * unit.star}`, "physical");
      });
      break;
    }

    case "sniper": {
      // 가장 먼 적 저격
      const enemies = allUnits.filter(u => u.isEnemy !== unit.isEnemy && u.hp > 0);
      let farthest = null;
      let maxDist = -1;
      enemies.forEach(e => {
        const dist = getGridDistance(unit.gridIndex, unit.isPlayerSide, e.gridIndex, e.isPlayerSide);
        if (dist > maxDist) {
          maxDist = dist;
          farthest = e;
        }
      });
      if (farthest) {
        applyDamage(farthest, 460 * unit.star, "crit", unit);
      }
      break;
    }

    case "archmage": {
      // 메테오 적 전체 폭격
      const enemies = allUnits.filter(u => u.isEnemy !== unit.isEnemy && u.hp > 0);
      enemies.forEach(e => {
        applyDamage(e, 380 * unit.star, "magic", unit);
        e.burnDuration = 3.0;
      });
      break;
    }

    case "dragon_slayer": {
      unit.ad = Math.round(unit.ad * 1.8);
      unit.shield += 400;
      break;
    }

    case "dragon_god": {
      // 천벌 브레스 (전체 기절 + 폭딜)
      const enemies = allUnits.filter(u => u.isEnemy !== unit.isEnemy && u.hp > 0);
      enemies.forEach(e => {
        applyDamage(e, 550 * unit.star, "crit", unit);
        e.isStunned = 1.5;
      });
      break;
    }

    default:
      if (unit.target && unit.target.hp > 0) {
        applyDamage(unit.target, 200 * unit.star, "magic", unit);
      }
      break;
  }
}

// 애니메이션 및 텍스트 이펙트
function triggerUnitAnim(unit, animClass) {
  const sideBoard = unit.isPlayerSide ? DOM.playerBoard : DOM.enemyBoard;
  const cell = sideBoard.children[unit.gridIndex];
  if (cell && cell.firstElementChild) {
    cell.firstElementChild.classList.add(animClass);
    setTimeout(() => {
      if (cell.firstElementChild) cell.firstElementChild.classList.remove(animClass);
    }, 300);
  }
}

function spawnFloatingText(target, text, type) {
  const sideBoard = target.isPlayerSide ? DOM.playerBoard : DOM.enemyBoard;
  const cell = sideBoard.children[target.gridIndex];
  if (!cell) return;

  const ft = document.createElement("div");
  ft.className = `floating-text ${type}`;
  ft.textContent = text;
  cell.appendChild(ft);
  setTimeout(() => ft.remove(), 800);
}

// 전투 중 실시간 보드 렌더링
function renderCombatBoard() {
  // 적 보드 클리어
  for (let i = 0; i < 32; i++) {
    DOM.enemyBoard.children[i].innerHTML = "";
  }
  // 아군 보드 클리어
  for (let i = 0; i < 32; i++) {
    DOM.playerBoard.children[i].innerHTML = "";
  }

  // 살아있는 유닛 렌더
  GAME.combat.units.forEach(unit => {
    if (unit.hp <= 0) return;
    const sideBoard = unit.isPlayerSide ? DOM.playerBoard : DOM.enemyBoard;
    const cell = sideBoard.children[unit.gridIndex];
    if (cell) {
      cell.appendChild(renderUnitElement(unit));
    }
  });
}

// 실시간 DPS 표기
function renderDPS() {
  const dpsEntries = Object.values(GAME.combat.dps);
  dpsEntries.sort((a, b) => b.dmg - a.dmg);

  const maxDmg = dpsEntries.length > 0 ? dpsEntries[0].dmg : 1;
  DOM.dpsList.innerHTML = "";

  dpsEntries.slice(0, 5).forEach(e => {
    const row = document.createElement("div");
    row.className = "dps-row";
    const pct = Math.min(100, (e.dmg / maxDmg) * 100);

    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;color:${e.isEnemy ? '#ff7675' : '#74b9ff'}">
        <span>${e.icon} ${e.name}</span>
        <span>${e.dmg}</span>
      </div>
      <div class="dps-bar-bg">
        <div class="dps-bar-fill" style="width:${pct}%;background:${e.isEnemy ? '#e74c3c' : '#0984e3'};"></div>
      </div>
    `;
    DOM.dpsList.appendChild(row);
  });
}

// --- 13. 전투 종료 처리 ---
function endCombatPhase(result, enemiesSurviving = 0) {
  clearInterval(GAME.combat.interval);
  clearInterval(GAME.timerInterval);

  if (result === "VICTORY") {
    GAME.player.streak = GAME.player.streak >= 0 ? GAME.player.streak + 1 : 1;
    GAME.player.gold += 3; // 승리 보너스 +3골드
    showToast(`전투 승리! 연승 중 (+${GAME.player.streak}연승, +3G)`);
  } else if (result === "DEFEAT") {
    GAME.player.streak = GAME.player.streak <= 0 ? GAME.player.streak - 1 : -1;
    // 패배 데미지: 기본 2 + 살아남은 적 유닛 수 * 2
    const damageTaken = 2 + (enemiesSurviving * 2);
    GAME.player.hp = Math.max(0, GAME.player.hp - damageTaken);
    showToast(`전투 패배! 플레이어 체력 -${damageTaken}`);
  } else {
    showToast("무승부! 아무런 피해도 입지 않았습니다.");
  }

  // 체력 0 도달 시 게임오버
  if (GAME.player.hp <= 0) {
    showGameOver(false);
    return;
  }

  // 다음 라운드로 진행
  GAME.round++;
  if (GAME.round > 4) {
    GAME.stage++;
    GAME.round = 1;
  }

  // 최대 6스테이지 도달 시 최종 승리 클리어
  if (GAME.stage > 5) {
    showGameOver(true);
    return;
  }

  // 1.5초 후 새 준비 단계 시작
  setTimeout(() => {
    startPreparationPhase();
  }, 1600);
}

// --- 14. 경험치 및 레벨업 시스템 ---
function addExp(amount) {
  if (GAME.player.level >= 9) return;

  GAME.player.exp += amount;
  while (GAME.player.level < 9 && GAME.player.exp >= GAME.player.maxExp) {
    GAME.player.exp -= GAME.player.maxExp;
    GAME.player.level++;
    GAME.player.maxExp = EXP_TABLE[GAME.player.level];
    showToast(`🎉 레벨 업! Lv.${GAME.player.level} 달성 (배치 한도 +1)`);
  }
}

function buyExp() {
  if (GAME.player.level >= 9) {
    showToast("이미 최고 레벨(Lv.9)입니다.");
    return;
  }
  if (GAME.player.gold < 4) {
    showToast("골드가 부족합니다! (4 골드 필요)");
    return;
  }

  GAME.player.gold -= 4;
  addExp(4);
  updateUI();
}

function rerollShop() {
  if (GAME.player.gold < 2) {
    showToast("새로고침할 골드가 부족합니다! (2 골드 필요)");
    return;
  }

  GAME.player.gold -= 2;
  rollShop();
  updateUI();
}

function toggleShopLock() {
  GAME.player.shopLocked = !GAME.player.shopLocked;
  DOM.lockIcon.textContent = GAME.player.shopLocked ? "🔒" : "🔓";
  showToast(GAME.player.shopLocked ? "상점이 잠겼습니다." : "상점 잠금이 해제되었습니다.");
}

// --- 15. UI 동기화 ---
function updateUI() {
  // 스탯 표시
  DOM.playerHp.textContent = GAME.player.hp;
  DOM.playerGold.textContent = GAME.player.gold;
  DOM.winStreak.textContent = GAME.player.streak >= 0 ? `${GAME.player.streak}연승` : `${Math.abs(GAME.player.streak)}연패`;
  DOM.playerLvl.textContent = GAME.player.level;
  DOM.playerExp.textContent = GAME.player.exp;
  DOM.playerMaxExp.textContent = GAME.player.maxExp;
  DOM.stageRoundDisplay.textContent = `스테이지 ${GAME.stage}-${GAME.round} (${GAME.state === "PREPARATION" ? "준비 단계" : "전투 단계"})`;

  const placedCount = GAME.player.board.filter(u => u !== null).length;
  DOM.placedUnitsCount.textContent = placedCount;
  DOM.maxUnitsCount.textContent = GAME.player.level;

  // 준비 단계일 때의 보드 및 벤치 렌더링
  if (GAME.state === "PREPARATION") {
    // 적 보드 프리뷰 렌더링
    for (let i = 0; i < 32; i++) {
      const cell = DOM.enemyBoard.children[i];
      cell.innerHTML = "";
      if (GAME.enemy.board[i]) {
        cell.appendChild(renderUnitElement(GAME.enemy.board[i]));
      }
    }

    // 아군 보드 렌더링
    for (let i = 0; i < 32; i++) {
      const cell = DOM.playerBoard.children[i];
      cell.innerHTML = "";
      if (GAME.player.board[i]) {
        cell.appendChild(renderUnitElement(GAME.player.board[i]));
      }
    }

    // 벤치 렌더링
    for (let i = 0; i < 8; i++) {
      const cell = DOM.playerBench.children[i];
      cell.innerHTML = "";
      if (GAME.player.bench[i]) {
        cell.appendChild(renderUnitElement(GAME.player.bench[i]));
      }
    }

    calculateSynergies();
  }
}

// --- 16. 게임 종료 모달 ---
function showGameOver(isWin) {
  DOM.modalGameOver.style.display = "flex";
  DOM.gameoverTitle.textContent = isWin ? "👑 최종 승리! (CHAMPION)" : "💀 게임 오버 (DEFEAT)";
  DOM.gameoverTitle.style.color = isWin ? "#f1c40f" : "#e74c3c";
  DOM.statFinalStage.textContent = `${GAME.stage}-${GAME.round}`;
  DOM.statFinalKills.textContent = GAME.stats.kills;
}

function restartGame() {
  DOM.modalGameOver.style.display = "none";
  GAME.stage = 1;
  GAME.round = 1;
  GAME.player.hp = 100;
  GAME.player.gold = 100;
  GAME.player.streak = 0;
  GAME.player.level = 1;
  GAME.player.exp = 0;
  GAME.player.maxExp = 2;
  GAME.player.board = Array(32).fill(null);
  GAME.player.bench = Array(8).fill(null);
  GAME.player.shopLocked = false;
  GAME.stats.kills = 0;

  DOM.lockIcon.textContent = "🔓";
  startPreparationPhase();
}

// --- 17. 이벤트 리스너 바인딩 ---
function bindEvents() {
  DOM.btnBuyXp.addEventListener("click", buyExp);
  DOM.btnReroll.addEventListener("click", rerollShop);
  DOM.btnLockShop.addEventListener("click", toggleShopLock);
  DOM.btnReadyCombat.addEventListener("click", () => {
    if (GAME.state === "PREPARATION") {
      clearInterval(GAME.timerInterval);
      startCombatPhase();
    }
  });
  DOM.btnRestart.addEventListener("click", restartGame);

  // 판매 드롭존 이벤트 바인딩
  DOM.sellDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (GAME.state !== "PREPARATION") return;
    DOM.sellDropzone.classList.add("active-drag");
  });

  DOM.sellDropzone.addEventListener("dragleave", () => {
    DOM.sellDropzone.classList.remove("active-drag");
  });

  DOM.sellDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    DOM.sellDropzone.classList.remove("active-drag");
    if (GAME.state !== "PREPARATION" || !GAME.draggedData) return;

    sellUnit(GAME.draggedData);
    GAME.draggedData = null;
  });
}

// 실행 진입점
window.addEventListener("DOMContentLoaded", initGame);
