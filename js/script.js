document.addEventListener('DOMContentLoaded', function () {
  setupNav();
  setupActiveLink();
  setupPlayButton();
  setupGallery();
  setupHeroCanvas();
});

// mobile hamburger menu
function setupNav() {
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  // close the menu after clicking a link, otherwise it just stays open on mobile
  var allLinks = links.querySelectorAll('a');
  for (var i = 0; i < allLinks.length; i++) {
    allLinks[i].addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }
}

// highlights the current section in the nav bar as you scroll
function setupActiveLink() {
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      navLinks.forEach(function (link) {
        if (link.dataset.section === id) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

function setupPlayButton() {
  var button = document.getElementById('play-now');
  var status = document.getElementById('play-status');

  button.addEventListener('click', function () {
    status.textContent = "Ashfall is still in development — here's what's built so far.";
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });

    setTimeout(function () {
      status.textContent = '';
    }, 6000);
  });
}

// click a gallery thumbnail to open it bigger, arrow keys / buttons to browse
function setupGallery() {
  var items = document.querySelectorAll('.gallery-item');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var caption = document.getElementById('lightbox-caption');
  var closeBtn = document.getElementById('lightbox-close');
  var prevBtn = document.getElementById('lightbox-prev');
  var nextBtn = document.getElementById('lightbox-next');

  if (items.length === 0) return;

  var current = 0;

  function show(index) {
    // wraps around so prev/next never breaks at the ends
    current = (index + items.length) % items.length;
    var item = items[current];
    var img = item.querySelector('img');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    caption.textContent = item.dataset.caption || '';
    lightbox.hidden = false;
  }

  function close() {
    lightbox.hidden = true;
  }

  items.forEach(function (item, index) {
    item.addEventListener('click', function () {
      show(index);
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });

  // clicking the dark background also closes it
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });
}

// small floating dots on the hero banner, just for atmosphere
function setupHeroCanvas() {
  var canvas = document.getElementById('signal-canvas');
  if (!canvas || !canvas.getContext) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  var width, height, dots;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;

    var count = Math.floor((width * height) / 18000);
    dots = [];
    for (var i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.4,
        speed: Math.random() * 0.15 + 0.03,
        offset: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < dots.length; i++) {
      var dot = dots[i];
      var brightness = 0.35 + 0.35 * Math.sin(time * 0.001 * dot.speed + dot.offset);
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(76, 224, 179, ' + brightness + ')';
      ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
}
