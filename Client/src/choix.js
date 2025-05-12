// === Récupération des éléments DOM ===
const citySections = document.querySelectorAll('.city-section');
const nameDisplay = document.getElementById('city-name-display');
const headerBanner = document.getElementById('header-banner');

const hoverSound = document.getElementById('hover-sound');
const clickSound = document.getElementById('click-sound');

// === Cités déjà prises (à modifier dynamiquement si besoin) ===
const takenCities = ['sparta']; // Ex: 'athens', 'sparta', 'thebes'

// === Initialisation des états ===
citySections.forEach(section => {
  const cityId = section.id;

  // Désactivation si cité déjà prise
  if (takenCities.includes(cityId)) {
    section.classList.add('disabled');
  }

  // Survol
  section.addEventListener('mouseenter', () => {
    if (section.classList.contains('disabled')) return;

    const cityName = section.dataset.city;
    nameDisplay.textContent = cityName;
    headerBanner.classList.add('active');

    hoverSound.currentTime = 0;
    hoverSound.play();
  });

  // Sortie de survol
  section.addEventListener('mouseleave', () => {
    if (section.classList.contains('disabled')) return;

    nameDisplay.textContent = "Choisis ta cité";
    headerBanner.classList.remove('active');
  });

  // Clic
  section.addEventListener('click', () => {
    if (section.classList.contains('disabled')) return;

    clickSound.currentTime = 0;
    clickSound.play();

    alert(`Tu as choisi ${section.dataset.city} !`);
    // Redirection possible ici, par exemple :
    // window.location.href = `game.html?city=${cityId}`;
  });
});

// === Auto-play de la musique après interaction utilisateur (certain navigateurs bloquent l'autoplay) ===
window.addEventListener('click', () => {
  const bgMusic = document.getElementById('background-music');
  if (bgMusic.paused) {
    bgMusic.play().catch(e => console.warn("Autoplay bloqué : interaction requise."));
  }
}, { once: true });
