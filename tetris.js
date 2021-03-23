// 落ちるスピード
const GAME_SPEED = 500;

// テトロミノのサイズ
const TETRO_SIZE = 4;

// フィールドサイズ
const FIELD_COL = 10;
const FIELD_ROW = 20;

const SCREEN_H = 550;  // スクリーンサイズ（高さ）
const BLOCK_SIZE = SCREEN_H / FIELD_ROW;    // ブロック1つのサイズ（ピクセル）
const SCREEN_W = BLOCK_SIZE * FIELD_COL;    // スクリーンサイズ（幅）

const TETRO_TYPES = [
  [],  // 0. 空
  [  // 1. I
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [  // 2. L
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [  // 3. J
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [  // 4. T
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
  ],
  [  // 5. O
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [  // 6. Z
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [  // 7. S
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
  ],
];

const TETRO_COLORS = [
  '#000',  // 0. 空
  '#6CF',  // 1. 水色
  '#F92',  // 2. オレンジ
  '#66F',  // 3. 青
  '#C5C',  // 4. 紫
  '#FD2',  // 5. 黄色
  '#F44',  // 6. 赤
  '#5B5',  // 7. 緑
];

const START_X = FIELD_COL / 2 - TETRO_SIZE / 2;
const START_Y = 0;

let can = document.getElementById('can');
can.width = SCREEN_W;
can.height = SCREEN_H;
can.style.border = '4px solid #555';
let con = can.getContext("2d");

// テトロミノの形
let tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;

// テトロミノ本体
let tetro = TETRO_TYPES[tetro_t];

// テトロミノの座標
let tetro_x = START_X;
let tetro_y = START_Y;

// フィールドの中身
let field = [];

// ゲームオーバーフラグ
let over = false;

// 消したライン数
let lines = 0;

// スコア
let score = 0;

// 初期化
function init() {
  // フィールドのクリア
  for (let y = 0; y < FIELD_ROW; y++) {
    field[y] = [];
    for (let x = 0; x < FIELD_COL; x++) {
      field[y][x] = 0;
    }
  }
}

// ブロック1つを描画する
function drawBlodk(x, y, c) {
  let px = x * BLOCK_SIZE;
  let py = y * BLOCK_SIZE;

  con.fillStyle = TETRO_COLORS[c];
  con.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
  con.strokeStyle = 'black';
  con.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
}

// 全部描画する
function drawAll() {
  con.clearRect(0, 0, SCREEN_W, SCREEN_H);

  for (let y = 0; y < FIELD_ROW; y++) {
    for (let x = 0; x < FIELD_COL; x++) {
      if (field[y][x]) {
        drawBlodk(x, y, field[y][x]);
      }
    }
  }

  for (let y = 0; y < TETRO_SIZE; y++) {
    for (let x = 0; x < TETRO_SIZE; x++) {
      if (tetro[y][x]) {
        drawBlodk(tetro_x + x, tetro_y + y, tetro_t)
      }
    }
  }

  con.font = "14px 'ＭＳ　ゴシック'";
  con.strokeText('Score: ' + score, 2, 15);

  if (over) {
    let s = 'GAME OVER';
    con.font = "40px 'ＭＳ　ゴシック'";
    let w = con.measureText(s).width;
    let x = SCREEN_W / 2 - w / 2;
    let y = SCREEN_H / 2 - 20;
    con.lineWidth = 4;
    con.strokeText(s, x, y);
    con.fillStyle = 'white';
    con.fillText(s, x, y);
  }
}

// ブロッックの衝突判定
function checkMove(mx, my, ntetro) {
  if (ntetro == undefined) ntetro = tetro;

  for (let y = 0; y < TETRO_SIZE; y++) {
    for (let x = 0; x < TETRO_SIZE; x++) {
      if (ntetro[y][x]) {
          let nx = tetro_x + mx + x;
          let ny = tetro_y + my + y;

          if (ny < 0 || nx < 0 || ny >= FIELD_ROW || nx >= FIELD_COL || field[ny][nx]) {
            return false;
        }
      }
    }
  }
  return true;
}

// テトロの回転
function rotate() {
  let ntetro = [];

  for (let y = 0; y < TETRO_SIZE; y++) {
    ntetro[y] = [];
    for (let x = 0; x < TETRO_SIZE; x++) {
      ntetro[y][x] = tetro[TETRO_SIZE - x - 1][y];
    }
  }

  return ntetro;
}

// テトロを固定する
function fixTetro() {
  for (let y = 0; y < TETRO_SIZE; y++) {
    for (let x = 0; x < TETRO_SIZE; x++) {
      if (tetro[y][x]) {
        field[tetro_y + y][tetro_x + x] = tetro_t;
      }
    }
  }
}

// ラインが揃ったかチェックして消す
function checkLine() {
  let linec = 0;

  for (let y = 0; y < FIELD_ROW; y++) {
    let flag = true;

    for (let x = 0; x < FIELD_COL; x++) {
      if (!field[y][x]) {
        flag = false;
        break;
      }
    }

    if (flag) {
      linec++;

      for (let ny = y; ny > 0; ny--) {
        for (let nx = 0; nx < FIELD_COL; nx++) {
          field[ny][nx] = field[ny - 1][nx];
        }
      }
    }
  }

  if (linec) {
    lines += linec;
    score += 100 * (2 ** (linec - 1));
  }
}

// ブロックの落ちる処理
function dropTetro() {
  if (over) return;

  if (checkMove(0, 1)) {
    tetro_y++;
  } else {
    fixTetro();
    checkLine();

    tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
    tetro = TETRO_TYPES[tetro_t];
    tetro_x = START_X;
    tetro_y = START_Y;

    if (!checkMove(0, 0)) over = true;
  }
  drawAll();
}

function leftAction(e) {
  if (e != null) e.preventDefault();
  if (checkMove(-1, 0)) tetro_x--;
}

function rightAction(e) {
  if (e != null) e.preventDefault();
  if (checkMove(1, 0)) tetro_x++;
}

function underAction(e) {
  if (e != null) e.preventDefault();
  if (checkMove(0, 1)) tetro_y++;
}

function rotateAction(e) {
  let ntetro = rotate();

  if (e != null) e.preventDefault();
  if (checkMove(0, 0, ntetro)) tetro = ntetro;
}

function setEvent() {
  let leftBtn = document.getElementById('left-btn');
  let rightBtn = document.getElementById('right-btn');
  let underBtn = document.getElementById('under-btn');
  let rotateBtn = document.getElementById('rotate-btn');

  // キーボードが押された時の処理
  document.onkeydown = function (e) {
    if (over) return;

    switch (e.keyCode) {
      case 37: // 左
        leftAction();
        break;
      case 39: // 右
        rightAction();
        break;
      case 40: // 下
        underAction();
        break;
      case 32: // スペース
        rotateAction();
        break;
    }

    drawAll();
  }

  leftBtn.addEventListener('touchstart', leftAction);
  leftBtn.addEventListener('click', leftAction);

  rightBtn.addEventListener('touchstart', rightAction);
  rightBtn.addEventListener('click', rightAction);

  underBtn.addEventListener('touchstart', underAction);
  underBtn.addEventListener('click', underAction);

  rotateBtn.addEventListener('touchstart', rotateAction);
  rotateBtn.addEventListener('click', rotateAction);
}

init();
drawAll();
setEvent();
setInterval(dropTetro, GAME_SPEED);
