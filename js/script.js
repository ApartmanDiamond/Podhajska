// script.js - kompletný: gallery order, lazy-load, lightbox, mobile menu, reveal, form

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------
     Mobile menu (on all pages)
     ------------------------- */
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuBtn && mobileMenu) {
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
  }

  /* -------------------------
     Scroll reveal (on all pages)
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
     Footer year (on all pages)
     ------------------------- */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* -------------------------
     Page-specific functions
     ------------------------- */
  const currentPage = window.location.pathname.split('/').pop();

  // Global function for privacy policy
  window.showPrivacyPolicy = function() {
    alert("Zásady ochrany súkromia:\n\nVaše osobné údaje budú použité len na účely spracovania vašej rezervácie. Nebudú poskytnuté tretím stranám bez vášho súhlasu.");
  };

  if (currentPage === 'galeria.html') {
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
  }

  if (currentPage === 'rezervacia.html') {
    /* -------------------------
       Booking form mailto
       ------------------------- */
    const bookingForm = document.getElementById("bookingForm");
    const formStatus = document.getElementById("formStatus");

    // Pre-fill form from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const checkinParam = urlParams.get('checkin');
    const checkoutParam = urlParams.get('checkout');
    const guestsParam = urlParams.get('guests');
    const priceParam = urlParams.get('price');
    if (checkinParam) document.getElementById("checkin").value = checkinParam;
    if (checkoutParam) document.getElementById("checkout").value = checkoutParam;
    if (guestsParam) document.getElementById("guests").value = guestsParam;
    if (priceParam) document.getElementById("price").value = priceParam;

    if (bookingForm) {
      bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Show consent alert
        const consent = confirm("Súhlasím so spracovaním osobných údajov podľa zásad ochrany súkromia.");
        if (!consent) {
          formStatus.textContent = "Musíte súhlasiť so spracovaním údajov.";
          return;
        }

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const checkin = document.getElementById("checkin").value;
        const checkout = document.getElementById("checkout").value;
        const guests = document.getElementById("guests").value;
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();
        const price = document.getElementById("price").value.trim();

        const subject = encodeURIComponent("Rezervácia Apartmán Diamond");
        let body = `Meno a priezvisko: ${name}%0D%0A`;
        body += `Email: ${email}%0D%0A`;
        body += `Príchod: ${checkin}%0D%0A`;
        body += `Odchod: ${checkout}%0D%0A`;
        body += `Počet osôb: ${guests}%0D%0A`;
        if (phone) body += `Telefón: ${phone}%0D%0A`;
        if (price) body += `Predbežná cena: ${price}€%0D%0A`;
        if (message) body += `Poznámka: ${encodeURIComponent(message)}%0D%0A`;

        const mailto = `mailto:diamondpodhajska@gmail.com?subject=${subject}&body=${body}`;
        window.open(mailto, '_blank');
        formStatus.textContent = "Otvára sa váš e-mailový klient. Po odoslaní emailu budete presmerovaný na ďakovnú stránku.";
        // Redirect to thank you page after 5 seconds to allow time to send email
        setTimeout(() => {
          window.location.href = "thank-you.html";
        }, 5000);
      });
    }
  }

  if (currentPage === 'cenik.html') {
    /* -------------------------
       Price Calculator
       ------------------------- */
    const prices = {
      summer: {1: 60, 2: 60, 3: 80, 4: 90},
      off: {1: 50, 2: 50, 3: 70, 4: 80},
      winter: {1: 50, 2: 50, 3: 70, 4: 80},
      holiday: {1: 60, 2: 60, 3: 80, 4: 90}
    };

    const guestsInput = document.getElementById('calc-guests');
    const checkinInput = document.getElementById('calc-checkin');
    const checkoutInput = document.getElementById('calc-checkout');
    const totalPriceEl = document.getElementById('total-price');
    const pricePerNightEl = document.getElementById('price-per-night');
    const discountInfoEl = document.getElementById('discount-info');
    const reserveBtn = document.getElementById('reserve-btn');

    function getSeason(date) {
      const month = date.getMonth() + 1; // 1-12
      const day = date.getDate();
      if ((month === 4 && day >= 1 && day <= 7) || (month === 12 && day >= 21) || (month === 1 && day <= 8)) {
        return 'holiday';
      } else if (month >= 5 && month <= 10) {
        return 'summer';
      } else if ((month === 4 && day >= 8 && day <= 30) || (month === 11 && day >= 1 && day <= 20) || (month >= 1 && month <= 3)) {
        return 'off';
      } else {
        return 'winter';
      }
    }

    function calculatePrice() {
      const checkin = new Date(checkinInput.value);
      const checkout = new Date(checkoutInput.value);
      const guests = parseInt(guestsInput.value);

      if (!checkinInput.value || !checkoutInput.value || isNaN(guests)) {
        totalPriceEl.textContent = 'Vyplňte všetky polia';
        pricePerNightEl.textContent = '';
        discountInfoEl.textContent = '';
        reserveBtn.disabled = true;
        return;
      }

      const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
      if (nights < 2) {
        totalPriceEl.textContent = 'Minimálny pobyt 2 noci';
        pricePerNightEl.textContent = '';
        discountInfoEl.textContent = '';
        reserveBtn.disabled = true;
        return;
      }

      let total = 0;
      let breakdown = {};
      for (let i = 0; i < nights; i++) {
        const date = new Date(checkin);
        date.setDate(date.getDate() + i);
        const season = getSeason(date);
        const price = prices[season][guests];
        total += price;
        breakdown[season] = (breakdown[season] || 0) + 1;
      }

      let discount = 0;
      if (nights > 7) {
        discount = total * 0.05;
        total -= discount;
      }

      totalPriceEl.textContent = Math.round(total) + '€';
      pricePerNightEl.textContent = `Priemerná cena: ${Math.round(total / nights)}€ / noc`;
      discountInfoEl.textContent = discount > 0 ? `Zľava: ${Math.round(discount)}€` : '';
      reserveBtn.disabled = false;
    }

    guestsInput.addEventListener('input', calculatePrice);
    checkinInput.addEventListener('input', calculatePrice);
    checkoutInput.addEventListener('input', calculatePrice);

    reserveBtn.addEventListener('click', () => {
      const checkin = checkinInput.value;
      const checkout = checkoutInput.value;
      const guests = guestsInput.value;
      const totalPrice = totalPriceEl.textContent.replace('€', '').trim();
      const url = `rezervacia.html?checkin=${encodeURIComponent(checkin)}&checkout=${encodeURIComponent(checkout)}&guests=${guests}&price=${encodeURIComponent(totalPrice)}`;
      window.location.href = url;
    });

    calculatePrice(); // initial calculation
  }

  if (currentPage === 'recenzie.html') {
    /* -------------------------
       Recenzie - Accordion
       ------------------------- */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.accordion-content');

        // Close all other accordions
        document.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector('.accordion-content');
            otherItem.classList.remove('active');
            otherContent.classList.remove('active');
            otherContent.style.maxHeight = null;
          }
        });

        // Toggle the clicked one
        if (item.classList.contains('active')) {
          // Closing
          item.classList.remove('active');
          content.classList.remove('active');
          content.style.maxHeight = null;
        } else {
          // Opening
          item.classList.add('active');
          content.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  if (currentPage === 'okolie.html') {
    /* -------------------------
       Okolie - Lightbox Gallery
       ------------------------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    let images = [];

    // Get all trip icons
    images = Array.from(document.querySelectorAll('.trip-icon'));

    function openLightbox(index) {
      lightboxImg.src = images[index].src;
      lightboxImg.alt = images[index].alt;
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('show');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    // Event listeners for trip icons
    images.forEach((img, index) => {
      img.addEventListener('click', () => {
        openLightbox(index);
      });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);

    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('show')) return;
      if (e.key === 'Escape') closeLightbox();
    });
  }
});
