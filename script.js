let map;
let markers = [];

// Load resort data
fetch("resorts.json")
  .then(response => response.json())
  .then(resorts => {
    initializeMap();
    renderResorts(resorts);
    renderMarkers(resorts);
    setupFilters(resorts);

    const count = document.getElementById("resort-count");
    if (count) {
      count.textContent = resorts.length;
    }
  })
  .catch(error => {
    console.error("Error loading resorts:", error);
  });

// Create the map
function initializeMap() {
  map = L.map("map").setView([39.5, -98.35], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);
}

// Draw map markers
function renderMarkers(resorts) {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  resorts.forEach(resort => {
    const marker = L.marker([resort.lat, resort.lng])
      .addTo(map)
      .bindPopup(`
        <strong>${resort.name}</strong><br>
        ${resort.state}<br><br>

        <strong>Pass:</strong> ${resort.pass}<br>
        <strong>Day Ticket:</strong> $${resort.dayTicket}<br>
        <strong>Vertical:</strong> ${resort.vertical.toLocaleString()} ft<br>
        <strong>Trails:</strong> ${resort.trails}
      `);

    markers.push(marker);
  });
}

// Build resort cards
function renderResorts(resorts) {

  const list = document.getElementById("resort-list");

  list.innerHTML = "";

  resorts.forEach(resort => {

    const card = document.createElement("div");

    card.className = "resort-card";

    card.innerHTML = `
      <h3>${resort.name}</h3>

      <p><strong>${resort.state}</strong></p>

      <p>🎿 ${resort.pass}</p>

      <p>💲 $${resort.dayTicket}</p>

      <p>⬇️ ${resort.vertical.toLocaleString()} ft</p>

      <p>${resort.trails} trails</p>
    `;

    card.addEventListener("click", () => {

      map.flyTo([resort.lat, resort.lng], 9);

    });

    list.appendChild(card);

  });

}

// Search + filters
function setupFilters(allResorts) {

  const search = document.getElementById("search");
  const region = document.getElementById("region-filter");
  const pass = document.getElementById("pass-filter");
  const price = document.getElementById("price-filter");

  function applyFilters() {

    const filtered = allResorts.filter(resort => {

      const searchText = search.value.toLowerCase();

      const matchesSearch =
        resort.name.toLowerCase().includes(searchText) ||
        resort.state.toLowerCase().includes(searchText);

      const matchesRegion =
        !region.value ||
        resort.region === region.value;

      const matchesPass =
        !pass.value ||
        resort.pass === pass.value;

      const matchesPrice =
        resort.dayTicket <= Number(price.value);

      return (
        matchesSearch &&
        matchesRegion &&
        matchesPass &&
        matchesPrice
      );

    });

    renderResorts(filtered);

    renderMarkers(filtered);

    const count = document.getElementById("resort-count");

    if (count) {
      count.textContent = filtered.length;
    }

  }

  search.addEventListener("input", applyFilters);
  region.addEventListener("change", applyFilters);
  pass.addEventListener("change", applyFilters);
  price.addEventListener("change", applyFilters);

}
