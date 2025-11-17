// script.js - kompletný: gallery order, lazy-load, lightbox, mobile menu, reveal, form

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------
     Galéria - poradie obrázkov
     ------------------------- */
  const imageOrder = [
    1,2,6,8,10,11,13,12,22,3,21,23,5,14,15,16,17,18,19,20,24,25,7,9,26,27,28,29,30,31,32,33
  ];

  const galleryGrid = document.getElementById("galleryGrid");
  const toggleBtn = document.getElementById("toggle-gallery");
  const toggleText = document.getElementById("toggle-text");
  const arrowIcon = document.querySelector(".arrow-icon");

  const initialCount = 12;
  let expanded = false;
  let currentIndex = 0;

  function makeImg(num, idx) {
    const img = document.createElement("img");
    img.className = "gallery-img";
    img.dataset.index = idx;
    img.alt = `Fotka ${num}`;
    img.loading = "lazy";
    img.src = `assets/gallery/gallery-${String(num).padStart(2,"0")}.jpg`;
    return img;
  }

  function renderGallery() {
    galleryGrid.innerHTML = "";
    const count = expanded ? imageOrder.length : Math.min(initialCount, imageOrder.length);
    for (let i = 0; i < count; i++) {
      const num = imageOrder[i];
      const img = makeImg(num, i);
      galleryGrid.appendChild(img);
    }
  }

  toggleBtn.addEventListener("click", () => {
    expanded = !expanded;
    toggleBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
    toggleText.textContent = expanded ? "Zobraziť menej" : "Zobraziť viac";
    arrowIcon.textContent = expanded ? "▲" : "▼";
    renderGallery();
  });

  renderGallery();


  /* -------------------------
     Lightbox
     ------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  function openLightbox(idx) {
    currentIndex = idx;
    const num = imageOrder[currentIndex];
    lightboxImg.src = `assets/gallery/gallery-${String(num).padStart(2,"0")}.jpg`;
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imageOrder.length;
    openLightbox(currentIndex);
  }
  function showPrev() {
    currentIndex = (currentIndex - 1 + imageOrder.length) % imageOrder.length;
    openLightbox(currentIndex);
  }

  galleryGrid.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;
    const idx = Number(img.dataset.index);
    if (Number.isInteger(idx)) openLightbox(idx);
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lbNext.addEventListener("click", showNext);
  lbPrev.addEventListener("click", showPrev);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("show")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  /* -------------------------
     Mobile menu
     ------------------------- */
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  function toggleMobile() {
    const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.style.display = isOpen ? "none" : "block";
    mobileMenu.setAttribute("aria-hidden", String(isOpen));
  }
  menuBtn.addEventListener("click", toggleMobile);
  // close menu on link click
  mobileMenu.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
      mobileMenu.style.display = "none";
      menuBtn.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    }
  });
  // ensure initial state
  mobileMenu.style.display = "none";
  mobileMenu.setAttribute("aria-hidden", "true");

  /* -------------------------
     Smooth scroll for anchors (and close menu)
     ------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) {
          if (menuBtn.getAttribute("aria-expanded") === "true") toggleMobile();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* -------------------------
     Scroll reveal (IntersectionObserver)
     ------------------------- */
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => revealObserver.observe(r));

  /* -------------------------
     Booking form mailto
     ------------------------- */
  const bookingForm = document.getElementById("bookingForm");
  const formStatus = document.getElementById("formStatus");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const checkin = document.getElementById("checkin").value;
      const checkout = document.getElementById("checkout").value;
      const guests = document.getElementById("guests").value;
      const phone = document.getElementById("phone").value.trim();
      const message = document.getElementById("message").value.trim();

      const subject = encodeURIComponent("Rezervácia Apartmán Diamond");
      let body = `Meno a priezvisko: ${name}%0D%0A`;
      body += `Email: ${email}%0D%0A`;
      body += `Príchod: ${checkin}%0D%0A`;
      body += `Odchod: ${checkout}%0D%0A`;
      body += `Počet osôb: ${guests}%0D%0A`;
      if (phone) body += `Telefón: ${phone}%0D%0A`;
      if (message) body += `Poznámka: ${encodeURIComponent(message)}%0D%0A`;

      const mailto = `mailto:diamondpodhajska@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailto;
      formStatus.textContent = "Otvára sa váš e-mailový klient...";
      setTimeout(() => { formStatus.textContent = ""; }, 4000);
    });
  }

  /* -------------------------
     Footer year
     ------------------------- */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

});
