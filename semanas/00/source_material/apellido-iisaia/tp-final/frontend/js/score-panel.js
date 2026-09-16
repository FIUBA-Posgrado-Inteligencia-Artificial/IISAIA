import { getScores, postScore } from "./api.js";

const el = (id) => document.getElementById(id);

function setStatus(node, message, isError = false) {
  node.textContent = message;
  node.className = isError ? "status error" : "status";
  node.hidden = message === "";
}

function renderEntry(score) {
  const item = document.createElement("li");
  const player = document.createElement("span");
  player.className = "player";
  player.textContent = score.player;
  const points = document.createElement("span");
  points.className = "points";
  points.textContent = String(score.points);
  item.append(player, points);
  return item;
}

export function createScorePanel(slug) {
  let finalScore = 0;
  const saveButton = el("save");
  const saveStatus = el("save-status");

  async function loadRanking() {
    const status = el("ranking-status");
    const list = el("ranking");
    setStatus(status, "Cargando ranking...");
    el("ranking-retry").hidden = true;
    try {
      const scores = await getScores(slug);
      list.replaceChildren(...scores.map(renderEntry));
      setStatus(status, scores.length === 0 ? "Todavía no hay puntajes. El primero que guardes queda arriba." : "");
    } catch (error) {
      list.replaceChildren();
      setStatus(status, `No se pudo cargar el ranking. ${error.message}`, true);
      el("ranking-retry").hidden = false;
    }
  }

  async function save(event) {
    event.preventDefault();
    const player = el("player").value.trim();
    if (player === "") {
      setStatus(saveStatus, "Escribí un nombre para guardar el puntaje.", true);
      return;
    }
    saveButton.disabled = true;
    saveButton.textContent = "Guardando...";
    setStatus(saveStatus, "");
    try {
      await postScore(slug, player, finalScore);
      saveButton.hidden = true;
      setStatus(saveStatus, "Puntaje guardado.");
      loadRanking();
    } catch (error) {
      setStatus(saveStatus, `No se pudo guardar. ${error.message}`, true);
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = "Guardar puntaje";
    }
  }

  el("score-form").addEventListener("submit", save);
  el("ranking-retry").addEventListener("click", loadRanking);
  loadRanking();

  return {
    showResult(score) {
      finalScore = score;
      el("final-score").textContent = String(score);
      setStatus(saveStatus, "");
      saveButton.hidden = false;
      el("playing").hidden = true;
      el("finished").hidden = false;
      el("player").focus();
    },
    hideResult() {
      el("playing").hidden = false;
      el("finished").hidden = true;
    },
  };
}
