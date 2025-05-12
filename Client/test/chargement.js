const water = document.getElementById('loading-water');
const boats = [
  document.getElementById('boat1'),
  document.getElementById('boat2'),
  document.getElementById('boat3')
];

let waterLevel = 0;
const targetLevel = 85;
const duration = 10000;
const interval = 100;
const steps = duration / interval;
const increment = targetLevel / steps;

let boatData = boats.map(() => ({
  x: Math.random() * (window.innerWidth - 60),
  speed: (Math.random() * 1.5 + 0.5) * (Math.random() > 0.5 ? 1 : -1),
  floatOffset: Math.random() * Math.PI * 2 // pour décaler l'oscillation entre bateaux
}));

const waterInterval = setInterval(() => {
  if (waterLevel < targetLevel) {
    waterLevel += increment;
    water.style.height = `${waterLevel}%`;
    updateBoatPositions();
  } else {
    water.style.height = `${targetLevel}%`;
    clearInterval(waterInterval);
  }
}, interval);

// Oscillation douce des bateaux + position liée à l'eau
function updateBoatPositions() {
  const time = Date.now() / 500;
  const screenHeight = window.innerHeight;
  const waterHeightPx = (waterLevel / 100) * screenHeight;

  boats.forEach((boat, index) => {
    let data = boatData[index];
    data.x += data.speed;

    if (data.x <= 0 || data.x >= window.innerWidth - 60) {
      data.speed *= -1;
      boat.style.transform = `scaleX(${data.speed > 0 ? 1 : -1})`;
    }

    const verticalFloat = Math.sin(time + data.floatOffset) * 3;
    const waterLine = waterHeightPx - 30 + verticalFloat;

    boat.style.left = `${data.x}px`;
    boat.style.bottom = `${waterLine}px`; // plus bas = touche l’eau
  });
}

window.addEventListener('click', () => {
  const music = document.getElementById('background-music');
  if (music && music.paused) {
    music.play();
  }
}, { once: true }); // ne se déclenche qu'une seule fois



setInterval(updateBoatPositions, 50);
