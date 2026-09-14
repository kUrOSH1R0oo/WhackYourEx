// Whack Your Ex — class lab reskin
// Original game concept: "Whack Your Ex" by Tom Winkler (Doodieman), 2004.
// This is a from-scratch, non-commercial fan rebuild for a school assignment.

document.addEventListener('DOMContentLoaded', function () {
  setupNav();
  setupActiveLink();
  setupPlayScroll();
  setupGame();
});

// ---------- nav ----------
function setupNav() {
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupActiveLink() {
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.dataset.section === id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(function (s) { observer.observe(s); });
}

function setupPlayScroll() {
  var button = document.getElementById('play-now');
  button.addEventListener('click', function () {
    document.getElementById('game').scrollIntoView({ behavior: 'smooth' });
  });
}

// ---------- characters ----------
var CHARACTERS = {
  jordan: {
    name: 'Jordan',
    hair: '#3a2049',
    shirt: '#ff3e7f',
    hairShape: 'M70,90 Q150,10 230,90 L230,120 Q150,70 70,120 Z'
  },
  alex: {
    name: 'Alex',
    hair: '#ffc93c',
    shirt: '#34e4c1',
    hairShape: 'M65,100 Q150,-10 235,100 L235,60 Q150,20 65,60 Z'
  }
};

function characterSVG(key, faceState) {
  var c = CHARACTERS[key];
  var mouth = faceState === 'hit'
    ? '<path d="M120,215 Q150,195 180,215" stroke="#241132" stroke-width="6" fill="none" stroke-linecap="round"/>'
    : '<path d="M125,210 Q150,222 175,210" stroke="#241132" stroke-width="6" fill="none" stroke-linecap="round"/>';
  var eyes = faceState === 'hit'
    ? '<path d="M110,170 L130,185 M130,170 L110,185" stroke="#241132" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M170,170 L190,185 M190,170 L170,185" stroke="#241132" stroke-width="5" stroke-linecap="round"/>'
    : '<circle cx="120" cy="177" r="6" fill="#241132"/><circle cx="180" cy="177" r="6" fill="#241132"/>';

  return '' +
    '<g>' +
      '<ellipse cx="150" cy="330" rx="70" ry="10" fill="rgba(36,17,50,0.12)"/>' +
      '<rect x="95" y="210" width="110" height="110" rx="26" fill="' + c.shirt + '"/>' +
      '<circle cx="150" cy="165" r="75" fill="#ffdcb8"/>' +
      eyes +
      mouth +
      '<circle cx="105" cy="195" r="10" fill="rgba(255,62,127,0.35)"/>' +
      '<circle cx="195" cy="195" r="10" fill="rgba(255,62,127,0.35)"/>' +
      '<path d="' + c.hairShape + '" fill="' + c.hair + '"/>' +
    '</g>';
}

// ---------- props / weapons ----------
var PROPS = [
  { id: 'pie', emoji: '🥧', name: 'Pie', comic: 'SPLAT!', particle: '🥧' },
  { id: 'chicken', emoji: '🐔', name: 'Chicken', comic: 'BONK!', particle: '🪶' },
  { id: 'balloon', emoji: '💦', name: 'Balloon', comic: 'SPLOOSH!', particle: '💧' },
  { id: 'glitter', emoji: '✨', name: 'Glitter', comic: 'POOF!', particle: '✨' },
  { id: 'horn', emoji: '📣', name: 'Air Horn', comic: 'HONK!', particle: '🎵' },
  { id: 'banana', emoji: '🍌', name: 'Banana', comic: 'WHOA!', particle: '🍌' },
  { id: 'tp', emoji: '🧻', name: 'TP Roll', comic: 'WRAP!', particle: '🧻' },
  { id: 'confetti', emoji: '🎉', name: 'Confetti', comic: 'POW!', particle: '🎊' }
];

var CAPTIONS = [
  "Standing there. Being an ex. The nerve.",
  "That landed perfectly.",
  "They did not see that coming.",
  "Somewhere, a tiny violin plays. It's not for them.",
  "10/10, would whack again.",
  "This is surprisingly therapeutic.",
  "They're rethinking every text they never answered.",
  "Closure, one prop at a time.",
  "The glitter will never fully come out. Good.",
  "You feel a little lighter already."
];

// ---------- game ----------
function setupGame() {
  var stage = document.getElementById('stage');
  var svgEl = document.getElementById('character-svg');
  var tray = document.getElementById('tray');
  var scoreEl = document.getElementById('score');
  var meterFill = document.getElementById('meter-fill');
  var comicText = document.getElementById('comic-text');
  var particles = document.getElementById('particles');
  var caption = document.getElementById('caption');
  var winBanner = document.getElementById('win-banner');
  var resetBtn = document.getElementById('reset-game');
  var playAgainBtn = document.getElementById('play-again');
  var toggleBtns = document.querySelectorAll('.toggle-btn');

  var state = { character: 'jordan', score: 0, meter: 0, won: false };

  function render() {
    svgEl.innerHTML = characterSVG(state.character, 'idle');
  }

  function buildTray() {
    tray.innerHTML = '';
    PROPS.forEach(function (prop) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.innerHTML = '<span class="tray-emoji">' + prop.emoji + '</span><span>' + prop.name + '</span>';
      btn.addEventListener('click', function () { whack(prop); });
      tray.appendChild(btn);
    });
  }

  function whack(prop) {
    if (state.won) return;

    state.score += 1;
    state.meter = Math.min(100, state.meter + 12);
    scoreEl.textContent = state.score;
    meterFill.style.width = state.meter + '%';

    svgEl.innerHTML = characterSVG(state.character, 'hit');
    svgEl.classList.remove('hit');
    void svgEl.offsetWidth; // restart animation
    svgEl.classList.add('hit');

    comicText.textContent = prop.comic;
    comicText.classList.remove('pop');
    void comicText.offsetWidth;
    comicText.classList.add('pop');

    spawnParticles(prop.particle);

    caption.textContent = CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)];

    setTimeout(function () {
      if (!state.won) svgEl.innerHTML = characterSVG(state.character, 'idle');
    }, 380);

    if (state.meter >= 100 && !state.won) {
      state.won = true;
      winBanner.hidden = false;
    }
  }

  function spawnParticles(emoji) {
    for (var i = 0; i < 6; i++) {
      var span = document.createElement('span');
      span.className = 'particle';
      span.textContent = emoji;
      span.style.left = (30 + Math.random() * 40) + '%';
      span.style.top = (20 + Math.random() * 10) + '%';
      span.style.animationDelay = (Math.random() * 0.15) + 's';
      particles.appendChild(span);
      (function (el) {
        setTimeout(function () { el.remove(); }, 1000);
      })(span);
    }
  }

  function resetGame() {
    state.score = 0;
    state.meter = 0;
    state.won = false;
    scoreEl.textContent = '0';
    meterFill.style.width = '0%';
    winBanner.hidden = true;
    comicText.classList.remove('pop');
    caption.textContent = "Standing there. Being an ex. The nerve.";
    render();
  }

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      toggleBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.character = btn.dataset.character;
      render();
    });
  });

  resetBtn.addEventListener('click', resetGame);
  playAgainBtn.addEventListener('click', resetGame);

  buildTray();
  render();
}
