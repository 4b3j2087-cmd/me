const loader = document.getElementById("loader");
window.addEventListener("load", () => {
  setTimeout(() => { if (loader) loader.style.display = "none"; }, 2300);
});

// Header shadow and scroll reveal
const header = document.getElementById("header");
const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach(item => revealObserver.observe(item));
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 20));

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("show"));
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("show")));

// Category filters
const filterButtons = document.querySelectorAll(".filter-btn");
const workCards = [...document.querySelectorAll(".work-card")];
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    workCards.forEach(card => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hide", !shouldShow);
    });
  });
});

// Image lightbox with previous / next controls
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCount = document.getElementById("lightboxCount");
let currentIndex = 0;
let visibleCards = [];
function refreshVisibleCards() {
  visibleCards = workCards.filter(card => !card.classList.contains("hide"));
}
function showLightbox(index) {
  refreshVisibleCards();
  currentIndex = (index + visibleCards.length) % visibleCards.length;
  const card = visibleCards[currentIndex];
  lightboxImage.src = card.dataset.image;
  lightboxImage.alt = card.querySelector("img").alt;
  lightboxTitle.textContent = card.dataset.title;
  lightboxCount.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(visibleCards.length).padStart(2, "0")}`;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
workCards.forEach(card => card.addEventListener("click", () => {
  refreshVisibleCards();
  showLightbox(visibleCards.indexOf(card));
}));
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click", () => showLightbox(currentIndex - 1));
document.getElementById("lightboxNext").addEventListener("click", () => showLightbox(currentIndex + 1));
lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showLightbox(currentIndex - 1);
  if (event.key === "ArrowRight") showLightbox(currentIndex + 1);
});

// Custom cursor (desktop only)
if (window.matchMedia("(pointer:fine)").matches) {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  window.addEventListener("mousemove", event => {
    mouseX = event.clientX; mouseY = event.clientY;
    dot.style.opacity = ring.style.opacity = "1";
    dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`;
  });
  function animateCursor() {
    ringX += (mouseX - ringX) * .16; ringY += (mouseY - ringY) * .16;
    ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll("a,button").forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });
}
