const wallpaper = document.querySelector("[data-wallpaper]");
const wallpaperRefresh = document.querySelector("[data-wallpaper-refresh]");
const hitokoto = document.querySelector("[data-hitokoto]");
const hitokotoFrom = document.querySelector("[data-hitokoto-from]");
const hitokotoRefresh = document.querySelector("[data-hitokoto-refresh]");

function refreshWallpaper() {
  if (!wallpaper) return;
  const seed = Date.now();
  wallpaper.style.backgroundImage = `
    linear-gradient(115deg, rgba(8, 12, 26, 0.96), rgba(35, 18, 45, 0.58), rgba(8, 12, 26, 0.78)),
    radial-gradient(circle at 20% 20%, rgba(255, 143, 199, 0.36), transparent 28rem),
    radial-gradient(circle at 80% 10%, rgba(126, 231, 224, 0.32), transparent 24rem),
    url("https://api.animepics.me/wallpaper?${seed}")
  `;
}

async function loadHitokoto() {
  if (!hitokoto) return;
  hitokoto.textContent = "正在捕捉一句话...";
  hitokotoFrom.textContent = "";

  try {
    const response = await fetch("https://v1.hitokoto.cn/?encode=json&c=a&c=b&c=i&c=k");
    const data = await response.json();
    hitokoto.textContent = data.hitokoto || "愿你走过的路，都开出自己的花。";
    hitokotoFrom.textContent = data.from ? `-- ${data.from}` : "-- Hitokoto";
  } catch {
    hitokoto.textContent = "愿你走过的路，都开出自己的花。";
    hitokotoFrom.textContent = "-- Local fallback";
  }
}

wallpaperRefresh?.addEventListener("click", refreshWallpaper);
hitokotoRefresh?.addEventListener("click", loadHitokoto);
loadHitokoto();

const canvas = document.querySelector("[data-sakura]");
const ctx = canvas?.getContext("2d");
const petals = [];

function resizeCanvas() {
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createPetal() {
  return {
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight,
    size: 8 + Math.random() * 16,
    speed: 0.7 + Math.random() * 1.8,
    drift: -0.7 + Math.random() * 1.4,
    rotate: Math.random() * Math.PI,
    spin: -0.025 + Math.random() * 0.05,
    alpha: 0.45 + Math.random() * 0.45
  };
}

function initPetals() {
  petals.length = 0;
  const count = Math.min(86, Math.max(34, Math.floor(window.innerWidth / 16)));
  for (let i = 0; i < count; i += 1) petals.push(createPetal());
}

function drawPetal(petal) {
  ctx.save();
  ctx.translate(petal.x, petal.y);
  ctx.rotate(petal.rotate);
  ctx.globalAlpha = petal.alpha;
  const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, petal.size);
  gradient.addColorStop(0, "#fff2f8");
  gradient.addColorStop(1, "#ff8fc7");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, petal.size * 0.64, petal.size * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function animatePetals() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  petals.forEach((petal, index) => {
    petal.x += petal.drift + Math.sin(petal.y * 0.015) * 0.4;
    petal.y += petal.speed;
    petal.rotate += petal.spin;
    if (petal.y > window.innerHeight + 30) petals[index] = createPetal();
    drawPetal(petal);
  });
  requestAnimationFrame(animatePetals);
}

if (canvas && ctx) {
  resizeCanvas();
  initPetals();
  animatePetals();
  window.addEventListener("resize", () => {
    resizeCanvas();
    initPetals();
  });
}
