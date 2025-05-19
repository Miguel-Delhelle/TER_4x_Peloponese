function updateResource(id, newValue) {
  const element = document.querySelector(`#${id} .value`);
  if (element) element.textContent = newValue;
}

// Exemple de mise à jour
updateResource("gold", 120);
updateResource("wood", 230);
