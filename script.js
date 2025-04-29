const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');
const overlay = document.getElementById('overlay');
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{x:10, y:10}];
let velocity = {x:1, y:0};
let food = {};
let proofToken = null;
let cycles = 0, score = 0, highScore = 0, nextToken = 5;
let gameInterval;

function placeFood() {
  food = { x: Math.floor(Math.random()*tileCount), y: Math.floor(Math.random()*tileCount) };
}
function placeProof() {
  proofToken = { x: Math.floor(Math.random()*tileCount), y: Math.floor(Math.random()*tileCount) };
}
function startGame() {
  overlay.style.visibility = 'hidden';
  snake = [{x:10, y:10}];
  velocity = {x:1, y:0};
  cycles = score = 0; nextToken = 5;
  placeFood(); proofToken = null;
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100);
}
function gameLoop() {
  cycles++;
  const head = { x: (snake[0].x + velocity.x + tileCount) % tileCount, y: (snake[0].y + velocity.y + tileCount) % tileCount };
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) return showReject();
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    highScore = Math.max(highScore, score);
    placeFood();
    if (score === nextToken) { placeProof(); nextToken += 5; }
  } else snake.pop();
  if (proofToken && head.x === proofToken.x && head.y === proofToken.y) {
    score += 5; proofToken = null;
  }
  draw();
}
function draw() {
  ctx.fillStyle = 'pink'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00DFFC'; ctx.fillRect(food.x*gridSize, food.y*gridSize, gridSize, gridSize);
  if (proofToken) {
    ctx.fillStyle = '#7A5FFF';
    ctx.beginPath();
    ctx.moveTo((proofToken.x+0.5)*gridSize, proofToken.y*gridSize);
    ctx.lineTo(proofToken.x*gridSize, (proofToken.y+1)*gridSize);
    ctx.lineTo((proofToken.x+1)*gridSize, (proofToken.y+1)*gridSize);
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#7A5FFF';
  snake.forEach(seg => ctx.fillRect(seg.x*gridSize, seg.y*gridSize, gridSize, gridSize));
  hud.textContent = `Score: ${score} | High Score: ${highScore} | Cycles: ${cycles}`;
}
function showReject() {
  clearInterval(gameInterval);
  overlay.style.visibility = 'visible';
}
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && velocity.y !== 1) velocity = {x:0, y:-1};
  if (e.key === 'ArrowDown' && velocity.y !== -1) velocity = {x:0, y:1};
  if (e.key === 'ArrowLeft' && velocity.x !== 1) velocity = {x:-1, y:0};
  if (e.key === 'ArrowRight' && velocity.x !== -1) velocity = {x:1, y:0};
});
startGame();