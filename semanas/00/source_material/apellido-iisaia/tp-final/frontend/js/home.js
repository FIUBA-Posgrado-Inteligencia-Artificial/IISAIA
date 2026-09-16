import { getGames } from "./api.js";

const statusEl = document.getElementById("status");
const retryEl = document.getElementById("retry");
const listEl = document.getElementById("games");

function renderCard(game) {
  const item = document.createElement("li");
  item.className = "game-card";

  const title = document.createElement("h2");
  title.textContent = game.name;

  const description = document.createElement("p");
  description.textContent = game.description;

  const link = document.createElement("a");
  link.className = "button";
  link.href = `game.html?game=${encodeURIComponent(game.slug)}`;
  link.textContent = `Jugar ${game.name}`;

  item.append(title, description, link);
  return item;
}

async function loadGames() {
  statusEl.textContent = "Cargando juegos...";
  statusEl.className = "status";
  statusEl.hidden = false;
  retryEl.hidden = true;
  listEl.replaceChildren();

  try {
    const games = await getGames();
    if (games.length === 0) {
      statusEl.textContent = "No hay juegos cargados en el servidor.";
      return;
    }
    statusEl.hidden = true;
    listEl.replaceChildren(...games.map(renderCard));
  } catch (error) {
    statusEl.textContent = `No se pudieron cargar los juegos. ${error.message}`;
    statusEl.className = "status error";
    retryEl.hidden = false;
  }
}

retryEl.addEventListener("click", loadGames);
loadGames();
