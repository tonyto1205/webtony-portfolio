document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerOffset = header ? header.offsetHeight + 8 : 72;
      const rect = target.getBoundingClientRect();
      const offsetTop = rect.top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });

      if (nav.classList.contains("open")) {
        nav.classList.remove("open");
      }
    });
  });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  const sections = document.querySelectorAll("section[id]");
  const linkMap = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      linkMap.set(href.slice(1), link);
    }
  });

  if ("IntersectionObserver" in window) {
    const headerOffset = header ? header.offsetHeight : 64;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          const link = linkMap.get(id);
          if (!link) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            navLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: `-${headerOffset + 16}px 0px -55% 0px`,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  const galleries = document.querySelectorAll(".gameplay-gallery");
  galleries.forEach((gallery) => {
    const track = gallery.querySelector(".gameplay-gallery-images");
    if (!track) return;
    const items = track.querySelectorAll(".gameplay-gallery-item");
    if (!items.length) return;

    const prevBtn = gallery.querySelector(".gameplay-gallery-nav--prev");
    const nextBtn = gallery.querySelector(".gameplay-gallery-nav--next");

    const scrollAmount = () => track.clientWidth * 0.6;

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        track.scrollBy({
          left: -scrollAmount(),
          behavior: "smooth",
        });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        track.scrollBy({
          left: scrollAmount(),
          behavior: "smooth",
        });
      });
    }
  });
});

