async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, options);
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(describeError(response.status, body));
  }
  return body;
}

function describeError(status, body) {
  if (status === 422) {
    return "Revisá los datos: el nombre debe tener entre 1 y 20 caracteres.";
  }
  if (body && typeof body.detail === "string") {
    return body.detail;
  }
  return `El servidor respondió con un error (${status}).`;
}

export function getGames() {
  return request("/games");
}

export function getScores(slug, limit = 10) {
  return request(`/games/${encodeURIComponent(slug)}/scores?limit=${limit}`);
}

export function postScore(slug, player, points) {
  return request(`/games/${encodeURIComponent(slug)}/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, points }),
  });
}
