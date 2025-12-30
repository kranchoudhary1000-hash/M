/* ===============================
   SAFE HELPER
================================ */
const $ = id => document.getElementById(id);

/* ===============================
   ELEMENTS (NULL SAFE)
================================ */
const loader = $("loader");
const app = $("app");
const chat = $("chat");
const statusEl = $("status");
const proposal = $("proposal");
const finalBox = $("final");
const music = $("music");
const canvas = $("fx");

if (!canvas) {
  console.warn("Canvas missing");
}

const ctx = canvas ? canvas.getContext("2d") : null;

/* ===============================
   CANVAS FIX
================================ */
function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ===============================
   STATE (ANTI-BUG)
================================ */
let msgIndex = 0;
let accepted = false;
let started = false;

/* ===============================
   LOADER FIX (NO STUCK)
================================ */
window.addEventListener("load", () => {
  setTimeout(() => {
    if (loader) loader.style.display = "none";
    if (app) app.classList.remove("hidden");
    startStory();
  }, 1500);
});

/* ===============================
   STORY DATA
================================ */
const STORY = [
  "Hey 👋",
  "Tum thodi der free ho?",
  "Mujhe kuch important kehna hai…",
  "Tumhari smile meri weakness hai 😍",
  "Tumhari presence sab kuch special bana deti hai ✨",
  "Ab aur wait nahi hota…",
  "I really really like you ❤️"
];

/* ===============================
   CHAT ENGINE (SAFE)
================================ */
function setStatus(txt) {
  if (statusEl) statusEl.innerText = txt;
}

function typeMessage(text, done) {
  if (!chat) return;

  const msg = document.createElement("div");
  msg.className = "msg me";
  chat.appendChild(msg);

  let i = 0;
  setStatus("typing…");

  const typer = setInterval(() => {
    msg.textContent += text[i++] || "";
    chat.scrollTop = chat.scrollHeight;

    if (i >= text.length) {
      clearInterval(typer);
      setStatus("online");
      done && done();
    }
  }, 40);
}

function startStory() {
  if (started) return;
  started = true;

  const playNext = () => {
    if (msgIndex >= STORY.length) {
      showProposal();
      return;
    }
    typeMessage(STORY[msgIndex], () => {
      msgIndex++;
      setTimeout(playNext, 700);
    });
  };

  playNext();
}

/* ===============================
   PROPOSAL
================================ */
function showProposal() {
  if (proposal) proposal.classList.remove("hidden");
}

/* ===============================
   YES BUTTON (ANTI DOUBLE CLICK)
================================ */
function yes() {
  if (accepted) return;
  accepted = true;

  if (proposal) proposal.classList.add("hidden");
  if (finalBox) finalBox.classList.remove("hidden");

  playMusic();
  startFireworks();
}

/* ===============================
   MUSIC FIX (BROWSER SAFE)
================================ */
function playMusic() {
  if (!music) return;

  music.volume = 0;
  music.play().then(() => {
    let v = 0;
    const fade = setInterval(() => {
      v += 0.05;
      music.volume = Math.min(v, 0.6);
      if (v >= 0.6) clearInterval(fade);
    }, 150);
  }).catch(() => {
    console.log("Autoplay blocked — user interaction needed");
  });
}

/* ===============================
   PARTICLE SYSTEM (OPTIMIZED)
================================ */
let particles = [];
let fireInterval = null;

function spawnFirework(x, y) {
  for (let i = 0; i < 50; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      life: 80,
      r: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 360},100%,70%)`
    });
  }
}

function startFireworks() {
  if (!canvas || !ctx || fireInterval) return;

  fireInterval = setInterval(() => {
    spawnFirework(
      Math.random() * canvas.width,
      Math.random() * canvas.height * 0.6
    );
  }, 700);
}

/* ===============================
   ANIMATION LOOP (NO LAG)
================================ */
function animate() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(p => p.life > 0);

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    p.r *= 0.98;
  });

  requestAnimationFrame(animate);
}
animate();

/* ===============================
   GLOBAL EXPORT
================================ */
window.yes = yes;
