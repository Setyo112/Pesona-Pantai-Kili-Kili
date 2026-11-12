// 1. Tombol tema (terang/gelap)
(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  try {
    var saved = localStorage.getItem("tema");
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) {}

  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function render() {
    btn.textContent = isDark() ? "☀️" : "🌙";
  }

  btn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("tema", next);
    } catch (e) {}
    render();
  });
  render();
})();

// 2. Tahun otomatis di footer
var tahunEl = document.getElementById("tahun");
if (tahunEl) tahunEl.textContent = new Date().getFullYear();

// 3. Tandai menu yang sedang aktif saat scroll
(function () {
  var links = document.querySelectorAll('nav a[href^="#"]');
  var map = {};
  links.forEach(function (a) {
    map[a.getAttribute("href").slice(1)] = a;
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) {
            a.classList.remove("active");
          });
          var link = map[entry.target.id];
          if (link) link.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})();

// 4. Latar bergerak (paralaks) saat halaman digeser
(function () {
  var items = document.querySelectorAll("[data-parallax]");
  if (!items.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ticking = false;
  function update() {
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var offset = -r.top * 0.25;
      var limit = el.offsetHeight * 0.3;
      offset = Math.max(-limit, Math.min(limit, offset));
      el.style.setProperty("--py", offset + "px");
    });
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
