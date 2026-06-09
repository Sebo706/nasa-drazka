const eventDate = new Date("2027-06-05T13:00:00+02:00");

const MANUAL_ATTENDANCE = [
  { name: "Sebastián O.", status: "Prídem", people: 1, brings: "" }
];

const GALLERY_PHOTOS = [
  { file: "images/gallery/IMG_20260607_132751.jpg", alt: "Fotka zo stretnutia Naša drážka 1", caption: "Fotka zo stretnutia 1" },
  { file: "images/gallery/IMG_20260607_141034.jpg", alt: "Fotka zo stretnutia Naša drážka 2", caption: "Fotka zo stretnutia 2" },
  { file: "images/gallery/IMG_20260607_142107.jpg", alt: "Fotka zo stretnutia Naša drážka 3", caption: "Fotka zo stretnutia 3" },
  { file: "images/gallery/IMG_20260607_142117.jpg", alt: "Fotka zo stretnutia Naša drážka 4", caption: "Fotka zo stretnutia 4" },
  { file: "images/gallery/IMG_20260607_143400.jpg", alt: "Fotka zo stretnutia Naša drážka 5", caption: "Fotka zo stretnutia 5" },
  { file: "images/gallery/IMG_20260607_143513.jpg", alt: "Fotka zo stretnutia Naša drážka 6", caption: "Fotka zo stretnutia 6" }
];

const countdownElements = {
  daysLeft: document.querySelector("#daysLeft"),
  hoursLeft: document.querySelector("#hoursLeft"),
  minutesLeft: document.querySelector("#minutesLeft"),
  secondsLeft: document.querySelector("#secondsLeft")
};

const photoGrid = document.querySelector("#photoGrid");
const galleryToggle = document.querySelector("#galleryToggle");
const lightboxElements = {
  root: document.querySelector("#photoLightbox"),
  image: document.querySelector("#lightboxImage"),
  caption: document.querySelector("#lightboxCaption"),
  download: document.querySelector("#lightboxDownload"),
  nextImage: document.querySelector("#lightboxNext"),
  nextButton: document.querySelector("#lightboxNextButton"),
  prevButton: document.querySelector("#lightboxPrev")
};
const attendanceElements = {
  list: document.querySelector("#attendanceList"),
  yesCount: document.querySelector("#yesCount"),
  maybeCount: document.querySelector("#maybeCount"),
  noCount: document.querySelector("#noCount"),
  peopleTotal: document.querySelector("#peopleTotal")
};

updateCountdown();
setInterval(updateCountdown, 1000);
setupSmoothScroll();
setupReveal();
renderGallery();
renderAttendance();
setupGalleryToggle();
setupLightbox();

function updateCountdown() {
  const now = new Date();
  const diff = Math.max(0, eventDate - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  countdownElements.daysLeft.textContent = days;
  countdownElements.hoursLeft.textContent = hours;
  countdownElements.minutesLeft.textContent = minutes;
  countdownElements.secondsLeft.textContent = seconds;
}

function renderGallery() {
  if (!photoGrid) {
    return;
  }

  if (GALLERY_PHOTOS.length === 0) {
    photoGrid.innerHTML = '<div class="empty-state">Fotky doplníme, keď sa pozbierajú. Ak nejaké máte, pošlite ich adminovi.</div>';
    return;
  }

  photoGrid.innerHTML = GALLERY_PHOTOS.map((photo, index) => `
    <figure class="photo-item">
      <button class="photo-open" type="button" data-photo-index="${index}">
        <img src="${escapeHtml(photo.file)}" alt="${escapeHtml(photo.alt || photo.caption || "Fotka zo stretnutia")}">
        <span>Otvoriť väčší náhľad</span>
      </button>
      <figcaption>${escapeHtml(photo.caption || "Fotka zo stretnutia")}</figcaption>
    </figure>
  `).join("");
}

function setupGalleryToggle() {
  if (!galleryToggle || !photoGrid) {
    return;
  }

  galleryToggle.textContent = `Otvoriť galériu (${GALLERY_PHOTOS.length})`;

  galleryToggle.addEventListener("click", () => {
    const isOpening = photoGrid.classList.contains("is-collapsed");
    photoGrid.classList.toggle("is-collapsed", !isOpening);
    galleryToggle.setAttribute("aria-expanded", String(isOpening));
    galleryToggle.textContent = isOpening ? "Skryť galériu" : `Otvoriť galériu (${GALLERY_PHOTOS.length})`;
  });
}

function setupLightbox() {
  if (!photoGrid || !lightboxElements.root) {
    return;
  }

  photoGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".photo-open");

    if (!button) {
      return;
    }

    openLightbox(Number.parseInt(button.dataset.photoIndex, 10) || 0);
  });

  lightboxElements.nextImage?.addEventListener("click", showNextPhoto);
  lightboxElements.nextButton?.addEventListener("click", showNextPhoto);
  lightboxElements.prevButton?.addEventListener("click", showPreviousPhoto);

  lightboxElements.root.querySelectorAll("[data-close-lightbox]").forEach((closeControl) => {
    closeControl.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightboxElements.root.classList.contains("is-open")) {
      closeLightbox();
    } else if (event.key === "ArrowRight" && lightboxElements.root.classList.contains("is-open")) {
      showNextPhoto();
    } else if (event.key === "ArrowLeft" && lightboxElements.root.classList.contains("is-open")) {
      showPreviousPhoto();
    }
  });
}

let currentPhotoIndex = 0;

function openLightbox(index) {
  currentPhotoIndex = getPhotoIndex(index);
  updateLightboxPhoto();
  lightboxElements.root.classList.add("is-open");
  lightboxElements.root.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-lightbox");
}

function updateLightboxPhoto() {
  const photo = GALLERY_PHOTOS[currentPhotoIndex];

  lightboxElements.image.alt = photo.alt || photo.caption || "Fotka zo stretnutia";
  lightboxElements.image.src = photo.file;
  lightboxElements.caption.textContent = `${photo.caption || "Fotka zo stretnutia"} (${currentPhotoIndex + 1}/${GALLERY_PHOTOS.length})`;
  lightboxElements.download.href = photo.file;
  lightboxElements.download.setAttribute("download", getFileName(photo.file));
}

function closeLightbox() {
  lightboxElements.root.classList.remove("is-open");
  lightboxElements.root.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-lightbox");
}

function showNextPhoto() {
  currentPhotoIndex = getPhotoIndex(currentPhotoIndex + 1);
  updateLightboxPhoto();
}

function showPreviousPhoto() {
  currentPhotoIndex = getPhotoIndex(currentPhotoIndex - 1);
  updateLightboxPhoto();
}

function renderAttendance() {
  if (!attendanceElements.list) {
    return;
  }

  const rows = MANUAL_ATTENDANCE.map(normalizeAttendanceRow).filter((row) => row.name);
  const yesRows = rows.filter((row) => row.status === "Prídem");
  const maybeRows = rows.filter((row) => row.status === "Možno");
  const noRows = rows.filter((row) => row.status === "Neprídem");
  const visibleRows = rows.filter((row) => row.status === "Prídem" || row.status === "Možno");
  const peopleTotal = visibleRows.reduce((sum, row) => sum + row.people, 0);

  attendanceElements.yesCount.textContent = yesRows.length;
  attendanceElements.maybeCount.textContent = maybeRows.length;
  attendanceElements.noCount.textContent = noRows.length;
  attendanceElements.peopleTotal.textContent = peopleTotal;

  if (visibleRows.length === 0) {
    attendanceElements.list.innerHTML = '<tr><td colspan="4">Zatiaľ tu nie je nikto zapísaný.</td></tr>';
    return;
  }

  attendanceElements.list.innerHTML = visibleRows.map((row) => `
    <tr>
      <td><strong>${escapeHtml(row.name)}</strong></td>
      <td><span class="status-pill ${getStatusClass(row.status)}">${escapeHtml(row.status)}</span></td>
      <td>${row.people}</td>
      <td>${escapeHtml(row.brings || "-")}</td>
    </tr>
  `).join("");
}

function normalizeAttendanceRow(row) {
  return {
    name: String(row.name || "").trim(),
    status: normalizeStatus(row.status),
    people: Math.max(1, Number.parseInt(row.people, 10) || 1),
    brings: String(row.brings || "").trim()
  };
}

function normalizeStatus(status) {
  const cleanStatus = String(status || "").trim().toLowerCase();

  if (["prídem", "pridem", "áno", "ano", "idem"].includes(cleanStatus)) {
    return "Prídem";
  }

  if (["možno", "mozno"].includes(cleanStatus)) {
    return "Možno";
  }

  if (["neprídem", "nepridem", "nie"].includes(cleanStatus)) {
    return "Neprídem";
  }

  return "Možno";
}

function getStatusClass(status) {
  if (status === "Prídem") {
    return "status-yes";
  }

  if (status === "Možno") {
    return "status-maybe";
  }

  return "status-no";
}

function getFileName(path) {
  return String(path || "fotka-zo-stretnutia.jpg").split("/").pop() || "fotka-zo-stretnutia.jpg";
}

function getPhotoIndex(index) {
  if (GALLERY_PHOTOS.length === 0) {
    return 0;
  }

  return (index + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function setupReveal() {
  const revealTargets = document.querySelectorAll(".intro-panel, .video-card, .next-date-section, .countdown-section, .registration-card, .attendance-card, .photos-card");

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (observerEntries) => {
      observerEntries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
