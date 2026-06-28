let contestants = [];

const storageKey = "tfl-fifa26-prediction-state-v1";
let state = loadState();
let activeMatchId = null;

initializeApplication();

document

  .getElementById("sync-btn")

  .addEventListener(

    "click",

    async () => {

      const button =

        document.getElementById(
          "sync-btn"
        );

      button.classList.add(
        "syncing"
      );

      button.textContent =
        "Syncing...";

      try {

        await SyncService.sync();

        await SyncService.refreshLastSync();

      }
      finally {

        button.classList.remove(
          "syncing"
        );

        button.textContent = "✔ Synced";

        setTimeout(() => {

          button.textContent = "🔄 Sync";

        }, 2000);

      }

    }

  );

async function initializeApplication() {

  state.matches =
    await SyncService.loadTournament();

  contestants =
    await ContestantRepository.getAll();

  renderMatches();

  renderDashboard();

  await SyncService.sync();

  localStorage.setItem(

    "tfl-last-sync",

    new Date().toISOString()

  );

  await SyncService.refreshLastSync();

  SyncService.start();

  if (

    DeveloperTools.enabled()

  ) {

    document

      .getElementById(

        "developer-panel"

      )

      .hidden = false;

  }

}

function medal(rank) {

  switch (rank) {

    case 0:
      return "🥇";

    case 1:
      return "🥈";

    case 2:
      return "🥉";

    default:
      return `${rank + 1}.`;

  }

}

function loadState() {

  const saved =
    localStorage.getItem(storageKey);

  if (saved)
    return reconcileState(JSON.parse(saved));

  return {

    matches: [],

    tournamentActuals: {
      goldenBoot: "",
      goldenGlove: "",
      goldenBall: "",
      champion: "",
      semiFinalists: "",
      finalists: ""
    },

    tournamentPredictions:
      Object.fromEntries(
        contestants.map(contestant => [
          contestant.name,
          defaultTournamentPrediction()
        ])
      ),

    overrides: {},

    settings: {
      apiEndpoint: "",
      apiKey: ""
    }

  };

}

async function getTeamPlayers(teamName) {

  return await FootballDataProvider.getSquad(teamName);

}

function reconcileState(savedState) {
  savedState.matches =
    savedState.matches || [];
  savedState.tournamentActuals = {
    goldenBoot: "",
    goldenGlove: "",
    goldenBall: "",
    champion: "",
    semiFinalists: "",
    finalists: "",
    ...(savedState.tournamentActuals || {})
  };
  savedState.tournamentPredictions = {
    ...Object.fromEntries(contestants.map((contestant) => [contestant.name, defaultTournamentPrediction()])),
    ...(savedState.tournamentPredictions || {})
  };
  savedState.overrides = savedState.overrides || {};
  savedState.settings = savedState.settings || { apiEndpoint: "", apiKey: "" };
  return savedState;
}

function defaultTournamentPrediction() {
  return {
    goldenBoot: "",
    goldenGlove: "",
    goldenBall: "",
    semiFinalists: "",
    finalists: "",
    champion: "",
    phase: "before-r16"
  };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function byId(id) {
  return document.getElementById(id);
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function splitList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseScorerPredictions(value) {
  return splitList(value).map(item => {
    const ownGoal = item.endsWith(" (OG)");

    return {
      player: ownGoal
        ? item.replace(/\s+\(OG\)$/, "")
        : item,
      ownGoal
    };
  });
}

function parseActualScorers(value) {
  return splitList(value).map(item => {
    const ownGoal = item.endsWith(" (OG)");

    return {
      player: ownGoal
        ? item.replace(/\s+\(OG\)$/, "")
        : item,
      ownGoal
    };
  });
}

function outcome(home, away) {
  if (home === away) return "draw";
  return home > away ? "home" : "away";
}

function scoreMatch(match, name) {

  const prediction = match.predictions?.[name];

  if (!prediction) {
    return {
      total: 0,
      breakdown: []
    };
  }

  if (
    prediction.homeGoals === "" ||
    prediction.awayGoals === "" ||
    prediction.homeGoals === undefined ||
    prediction.awayGoals === undefined
  ) {
    return {
      total: 0,
      breakdown: []
    };
  }

  if (
    match.actual.homeGoals === "" ||
    match.actual.awayGoals === "" ||
    match.actual.homeGoals === undefined ||
    match.actual.awayGoals === undefined
  ) {
    return {
      total: 0,
      breakdown: []
    };
  }

  return ScoreEngine.calculate(match, prediction);

}

function scoreTournament(name) {
  const pred = state.tournamentPredictions[name] || defaultTournamentPrediction();
  const actual = state.tournamentActuals;
  let total = 0;
  ["goldenBoot", "goldenGlove", "goldenBall"].forEach((key) => {
    if (normalize(actual[key]) && splitList(pred[key]).map(normalize).includes(normalize(actual[key]))) total += 75;
  });

  const phase = pred.phase || "before-r16";
  const table = {
    "before-r16": { semi: [50, -25], finalist: [75, -40], champion: [100, -50] },
    "before-qf": { semi: [25, -15], finalist: [50, -25], champion: [70, -35] },
    "before-sf": { semi: [0, 0], finalist: [30, -15], champion: [50, -25] }
  }[phase];

  const actualSemi = splitList(actual.semiFinalists).map(normalize);
  const actualFinalists = splitList(actual.finalists).map(normalize);
  splitList(pred.semiFinalists).forEach((team) => {
    const [win, lose] = table.semi;
    total += actualSemi.length ? (actualSemi.includes(normalize(team)) ? win : lose) : 0;
  });
  splitList(pred.finalists).forEach((team) => {
    const [win, lose] = table.finalist;
    total += actualFinalists.length ? (actualFinalists.includes(normalize(team)) ? win : lose) : 0;
  });
  if (normalize(pred.champion) && normalize(actual.champion)) {
    const [win, lose] = table.champion;
    total += normalize(pred.champion) === normalize(actual.champion) ? win : lose;
  }
  return total;
}

function totals() {
  return contestants.map((contestant) => {
    const matchPoints = state.matches.reduce((sum, match) => sum + scoreMatch(match, contestant.name).total, 0);
    const tournamentPoints = scoreTournament(contestant.name);
    const currentWeek = state.matches
      .filter((match) => new Date(match.kickoff) >= new Date("2026-06-26") && new Date(match.kickoff) < new Date("2026-07-03"))
      .reduce((sum, match) => sum + scoreMatch(match, contestant.name).total, 0);
    return {
      name: contestant.name,
      base: contestant.startingPoints ?? 0,
      matchPoints,
      tournamentPoints,
      weekly: currentWeek,
      total: (contestant.startingPoints) + matchPoints + tournamentPoints
    };
  }).sort((a, b) => b.total - a.total);
}

function renderDashboard() {
  const rows = totals();
  byId("metricLeader").textContent = rows[0] ? rows[0].name : "-";
  const weeklyTopper = [...rows].sort((a, b) => b.weekly - a.weekly)[0];
  byId("metricTopper").textContent = weeklyTopper ? `${weeklyTopper.name} +${weeklyTopper.weekly}` : "-";

  byId("leaderboard").innerHTML = rows.map((row, index) => `
    <div class="leader-row">
      <div class="rank">${medal(index)}</div>
      <div>
        <p class="player-name">${row.name}</p>
        <!-- <p class="subtext">Base ${row.base} | Match ${signed(row.matchPoints)} | Futures ${signed(row.tournamentPoints)}</p> -->
      </div>
      <div class="points">${row.total}</div>
    </div>
  `).join("");

  byId("weeklyGrid").innerHTML = [...rows].sort((a, b) => b.weekly - a.weekly).map((row) => `
    <div class="weekly-row">
      <strong>${row.name}</strong>
      <span class="points">${signed(row.weekly)}</span>
    </div>
  `).join("");
}

function signed(value) {
  return value > 0 ? `+${value}` : String(value);
}

function filterMatches(matches, filter) {

  switch (filter) {

    case "UPCOMING":

      return matches.filter(match =>
        !isCompleted(match)
      );

    case "PAST":

      return matches.filter(match =>
        isCompleted(match)
      );

    case "GROUP":

      return matches.filter(match =>
        match.stage === "GROUP"
      );

    case "ROUND_OF_32":

      return matches.filter(match =>
        match.stage === "ROUND_OF_32"
      );

    case "ROUND_OF_16":

      return matches.filter(match =>
        match.stage === "ROUND_OF_16"
      );

    case "QUARTER_FINAL":

      return matches.filter(match =>
        match.stage === "QUARTER_FINAL"
      );

    case "SEMI_FINAL":

      return matches.filter(match =>
        match.stage === "SEMI_FINAL"
      );

    case "FINAL":

      return matches.filter(match =>
        match.stage === "FINAL"
      );

    default:

      return matches;

  }

}

function isCompleted(match) {

  return (

    match.actual &&
    match.actual.homeGoalsFinal !== null &&
    match.actual.homeGoalsFinal !== undefined &&
    match.actual.awayGoalsFinal !== ""

  );

}

function renderMatches() {
  const rounds = ["All", "UPCOMING", "PAST", ...new Set(state.matches.map((match) => match.stage))];
  const current = byId("roundFilter").value || "UPCOMING";
  byId("roundFilter").innerHTML = rounds.map((round) => `<option ${round === current ? "selected" : ""}>${round}</option>`).join("");
  const filtered = current === "All" ? state.matches : filterMatches(state.matches, current);
  byId("matchList").innerHTML = filtered.map((match) => {
    const hasResult =

      match.actual?.homeGoalsFinal !== "" &&

      match.actual?.awayGoalsFinal !== "";
    return `
      <article class="match-card ${hasResult ? "complete" : ""}">
        <div>
          <div class="teams"><span>${match.home}</span><span class="badge">${hasResult ? `${match.actual.homeGoalsFinal} - ${match.actual.awayGoalsFinal}` : "vs"}</span><span>${match.away}</span></div>
          <p class="subtext">${match.round} | ${formatDate(match.kickoff)} | ${submittedCount(match)} predictions</p>
        </div>
        <button class="primary-button" data-edit-match="${match.id}">Open</button>
      </article>
    `;
  }).join("");
}

function submittedCount(match) {
  return contestants.filter((contestant) => {
    const prediction = match.predictions[contestant.name] || {};
    return prediction.homeGoals !== "" && prediction.homeGoals !== undefined && prediction.awayGoals !== "" && prediction.awayGoals !== undefined;
  }).length;
}

function formatDate(value) {

  if (!value)
    return "-";

  return new Intl.DateTimeFormat(
    "en-IN",
    {

      dateStyle: "medium",

      timeStyle: "short"

    }

  ).format(new Date(value));

}

async function openMatchDialog(matchId) {
  activeMatchId = matchId;
  await renderMatchDialog();
  byId("matchDialog").showModal();
}

async function renderMatchDialog() {
  const knockoutRounds = [
    "Round of 32",
    "Round of 16",
    "Quarter Final",
    "Semi Final",
    "Final"
  ];
  const match = state.matches.find((item) => item.id === activeMatchId);
  const showMatchDecision =
    knockoutRounds.includes(match.round);
  byId("dialogRound").textContent = `${match.round} | ${formatDate(match.kickoff)}`;
  byId("dialogTitle").textContent = `${match.home} vs ${match.away}`;

  const homePlayers =
    await getTeamPlayers(match.home);

  const awayPlayers =
    await getTeamPlayers(match.away);

  const homeScorerOptions = [

    ...homePlayers.map(
      p => p.name
    ),

    ...awayPlayers.map(
      p => `${p.name} (OG)`
    )

  ];

  const awayScorerOptions = [

    ...awayPlayers.map(
      p => p.name
    ),

    ...homePlayers.map(
      p => `${p.name} (OG)`
    )

  ];
  byId("dialogContent").innerHTML = `
    <section class="panel">
      <div class="section-title">
        <div>
          <p class="eyebrow">Actual result</p>
          <h2>Match Result</h2>
        </div>
        <button class="text-button" type="button" data-calc-match="${match.id}">Calculate Match</button>
      </div>
      <div class="result-grid">
        <label>${match.home} goals<input class="input" data-result="homeGoals" type="number" min="0" value="${match.actual.homeGoalsFinal}"></label>
        <label>${match.away} goals<input class="input" data-result="awayGoals" type="number" min="0" value="${match.actual.awayGoalsFinal}"></label>
        ${showMatchDecision ? `<label>

Match Decision

<select
class="input"
data-result="matchDecision">

<option value="">Select</option>

<option value="90">90 Minutes</option>

<option value="ET">Extra Time</option>

<option value="PEN">Penalties</option>

</select>

</label>
` : ""}
        <label class="full-span">Actual scorers<textarea class="input" data-result="scorers" rows="2" placeholder="Comma separated">${match.actual.scorers}</textarea></label>
        <label class="full-span">Own goals<textarea class="input" data-result="ownGoals" rows="2" placeholder="Comma separated">${match.actual.ownGoals}</textarea></label>
      </div>
    </section>
    ${contestants.map((contestant) => predictionCard(

    match,

    contestant.name,

    homeScorerOptions,

    awayScorerOptions

  )).join("")}
  `;
}

function predictionCard(match, name, homeScorerOptions, awayScorerOptions) {
  const prediction = match.predictions[name] || { homeGoals: "", awayGoals: "", scorers: "" };
  const override = state.overrides[`${match.id}:${name}`] ?? "";
  const knockoutRounds = [
    "Round of 32",
    "Round of 16",
    "Quarter Final",
    "Semi Final",
    "Final"
  ];

  const showMatchDecision =
    knockoutRounds.includes(match.round);
  return `
    <section class="contestant-card">
      <h3>${name}</h3>
      <label>
Copy Prediction

<select
class="input"
data-copy="${name}">

<option value="">None</option>

${contestants
      .filter(c => c !== name)
      .map(c => `<option>${c}</option>`)
      .join("")}

</select>

</label>
      <div class="prediction-grid">
        <label>${match.home} goals<input class="input" data-player="${name}" data-field="homeGoals" type="number" min="0" value="${prediction.homeGoals}"></label>
        <label>${match.away} goals<input class="input" data-player="${name}" data-field="awayGoals" type="number" min="0" value="${prediction.awayGoals}"></label>
        ${showMatchDecision ? `
<label>
    Match Decision
    <select class="input"
            data-player="${name}"
            data-field="matchDecision">
        <option value="">Select</option>
        <option value="90">90 Minutes</option>
        <option value="ET">Extra Time</option>
        <option value="PEN">Penalties</option>
    </select>
</label>
` : ""}
        <label>Manual points<input class="input" data-override="${name}" type="number" value="${override}" placeholder="Auto"></label>
        <label class="full-span">${match.home} Scorers
          <select class="input"data-home-scorer-select="${name}">
            <option value="">Add scorer</option>
            ${homeScorerOptions
      .map(player =>
        `<option>${player}</option>`
      )
      .join("")}
          </select>
        </label>
        <label class="full-span">${match.away} Scorers
          <select class="input" data-away-scorer-select="${name}">
            <option value="">Add scorer</option>
            ${awayScorerOptions
      .map(player =>
        `<option>${player}</option>`
      )
      .join("")}
          </select>
        </label>
        <label class="full-span">Selected scorers<textarea class="input" data-player="${name}" data-field="scorers" rows="2">${prediction.scorers || ""}</textarea></label>
      </div>
      ${(() => {

      const score = scoreMatch(match, name);

      return `

        <div class="prediction-score">

            <p class="subtext">

                Current match points:
                <strong>${score.total}</strong>

            </p>

            <details class="score-breakdown">

                <summary>View Score Breakdown</summary>

                ${renderScoreBreakdown(score.breakdown)}

            </details>

        </div>

    `;

    })()}
    </section>
  `;
}

function renderScoreBreakdown(breakdown = []) {

  const RULE_LABELS = {

    "Match Result": "🏆 Match Result",

    "Exact Score": "🎯 Exact Score",

    "Goal Difference": "📏 Goal Difference",

    "Scorers": "⚽ Scorers",

    "Match Decision": "⏱ Match Decision"

  };

  return `

        <div class="score-breakdown-body">

            ${breakdown.map(item => {

    const label =
      RULE_LABELS[item.rule] ??
      item.rule;

    const sign =
      item.points > 0 ? "+" : "";

    const icon =
      item.matched
        ? "✅"
        : "❌";

    return `

                    <div class="score-breakdown-row">

                        <span>

                            ${icon} ${label}

                        </span>

                        <strong>

                            ${sign}${item.points}

                        </strong>

                    </div>

                `;

  }).join("")}

        </div>

    `;

}

function saveActiveMatch() {
  const match = state.matches.find((item) => item.id === activeMatchId);
  document.querySelectorAll("[data-result]").forEach((field) => {
    match.actual[field.dataset.result] = field.value;
  });
  contestants.forEach((contestant) => {
    const name = contestant.name;
    const next = match.predictions[name] || {};
    document.querySelectorAll(`[data-player="${name}"]`).forEach((field) => {
      next[field.dataset.field] = field.value;
    });
    match.predictions[name] = next;
    const override = document.querySelector(`[data-override="${name}"]`).value;
    state.overrides[`${match.id}:${name}`] = override;
  });
  saveState();
  renderAll();
  showSnack("Match saved and table refreshed");
}

function renderTournament() {
  byId("actualGoldenBoot").value = state.tournamentActuals.goldenBoot || "";
  byId("actualGoldenGlove").value = state.tournamentActuals.goldenGlove || "";
  byId("actualGoldenBall").value = state.tournamentActuals.goldenBall || "";
  byId("actualChampion").value = state.tournamentActuals.champion || "";
  byId("actualSemiFinalists").value = state.tournamentActuals.semiFinalists || "";
  byId("actualFinalists").value = state.tournamentActuals.finalists || "";

  byId("tournamentGrid").innerHTML = contestants.map((contestant) => {
    const name = contestant.name;
    const pred = state.tournamentPredictions[name] || defaultTournamentPrediction();
    return `
      <section class="contestant-card">
        <h3>${name}</h3>
        <div class="prediction-grid">
          <label>Phase
            <select class="input" data-tournament="${name}" data-field="phase">
              <option value="before-r16" ${pred.phase === "before-r16" ? "selected" : ""}>Before R16</option>
              <option value="before-qf" ${pred.phase === "before-qf" ? "selected" : ""}>Before quarters</option>
              <option value="before-sf" ${pred.phase === "before-sf" ? "selected" : ""}>Before semis</option>
            </select>
          </label>
          <label>Golden Boot<input class="input" data-tournament="${name}" data-field="goldenBoot" value="${pred.goldenBoot || ""}" placeholder="Max 3, comma separated"></label>
          <label>Golden Glove<input class="input" data-tournament="${name}" data-field="goldenGlove" value="${pred.goldenGlove || ""}" placeholder="Max 3"></label>
          <label>Golden Ball<input class="input" data-tournament="${name}" data-field="goldenBall" value="${pred.goldenBall || ""}" placeholder="Max 3"></label>
          <label class="full-span">Semi-finalists<input class="input" data-tournament="${name}" data-field="semiFinalists" value="${pred.semiFinalists || ""}" placeholder="4 teams"></label>
          <label>Finalists<input class="input" data-tournament="${name}" data-field="finalists" value="${pred.finalists || ""}" placeholder="2 teams"></label>
          <label>Champion<input class="input" data-tournament="${name}" data-field="champion" value="${pred.champion || ""}"></label>
        </div>
        <p class="subtext">Current tournament points: ${scoreTournament(name)}</p>
      </section>
    `;
  }).join("");
}

function saveTournament() {
  state.tournamentActuals.goldenBoot = byId("actualGoldenBoot").value;
  state.tournamentActuals.goldenGlove = byId("actualGoldenGlove").value;
  state.tournamentActuals.goldenBall = byId("actualGoldenBall").value;
  state.tournamentActuals.champion = byId("actualChampion").value;
  state.tournamentActuals.semiFinalists = byId("actualSemiFinalists").value;
  state.tournamentActuals.finalists = byId("actualFinalists").value;
  document.querySelectorAll("[data-tournament]").forEach((field) => {
    const name = field.dataset.tournament;
    state.tournamentPredictions[name] = state.tournamentPredictions[name] || defaultTournamentPrediction();
    state.tournamentPredictions[name][field.dataset.field] = field.value;
  });
  saveState();
  renderAll();
  showSnack("Tournament predictions saved");
}

async function syncResults() {
  state.settings.apiEndpoint = byId("apiEndpoint").value;
  state.settings.apiKey = byId("apiKey").value;
  saveState();
  if (!state.settings.apiEndpoint) {
    byId("syncStatus").textContent = "Add a CORS-enabled endpoint first, or enter results manually inside each match.";
    return;
  }
  try {
    const response = await fetch(state.settings.apiEndpoint, {
      headers: state.settings.apiKey ? { Authorization: `Bearer ${state.settings.apiKey}` } : {}
    });
    const data = await response.json();
    applyExternalResults(data);
    saveState();
    renderAll();
    byId("syncStatus").textContent = "Results synced. Check matches before calculating.";
  } catch (error) {
    byId("syncStatus").textContent = "Sync failed. Most sports APIs require a server proxy or API key restrictions.";
  }
}

function applyExternalResults(data) {
  const externalMatches = Array.isArray(data) ? data : data.matches || [];
  externalMatches.forEach((external) => {
    const match = state.matches.find((item) => item.id === external.id || (normalize(item.home) === normalize(external.home) && normalize(item.away) === normalize(external.away)));
    if (!match) return;
    match.actual.homeGoals = external.homeGoals ?? match.actual.homeGoals;
    match.actual.awayGoals = external.awayGoals ?? match.actual.awayGoals;
    match.actual.scorers = Array.isArray(external.scorers) ? external.scorers.join(", ") : match.actual.scorers;
  });
}

function renderSettings() {
  byId("apiEndpoint").value = state.settings.apiEndpoint || "";
  byId("apiKey").value = state.settings.apiKey || "";
}

function showSnack(message) {
  const snackbar = byId("snackbar");
  snackbar.textContent = message;
  snackbar.classList.add("show");
  window.setTimeout(() => snackbar.classList.remove("show"), 2200);
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tfl-fifa26-data.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function renderAll() {
  renderDashboard();
  renderMatches();
  renderTournament();
}

document.addEventListener("click", async (event) => {
  const tab = event.target.closest(".tab");
  if (tab) {
    document.querySelectorAll(".tab").forEach((item) => item.classList.toggle("active", item === tab));
    document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === `${tab.dataset.view}View`));
  }
  const editButton = event.target.closest("[data-edit-match]");
  if (editButton) await openMatchDialog(editButton.dataset.editMatch);
  if (event.target.closest("#recalculateAllButton")) {
    renderAll();
    showSnack("Leaderboard recalculated");
  }
  if (event.target.closest("#calculateTournamentButton")) saveTournament();
  if (event.target.closest("#exportButton")) exportData();
  if (event.target.closest("[data-calc-match]")) {
    saveActiveMatch();
    renderMatchDialog();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "roundFilter") renderMatches();
  // Home team scorer dropdown
  const homeScorer = event.target.closest("[data-home-scorer-select]");
  if (homeScorer && homeScorer.value) {

    const player = homeScorer.dataset.homeScorerSelect;

    const textarea = document.querySelector(
      `textarea[data-player="${player}"][data-field="scorers"]`
    );

    const current = splitList(textarea.value);

    current.push(homeScorer.value);

    textarea.value = current.join(", ");

    homeScorer.value = "";

    return;
  }

  // Away team scorer dropdown
  const awayScorer = event.target.closest("[data-away-scorer-select]");
  if (awayScorer && awayScorer.value) {

    const player = awayScorer.dataset.awayScorerSelect;

    const textarea = document.querySelector(
      `textarea[data-player="${player}"][data-field="scorers"]`
    );

    const current = splitList(textarea.value);

    current.push(awayScorer.value);

    textarea.value = current.join(", ");

    awayScorer.value = "";

    return;
  }
  const copySelect =
    event.target.closest("[data-copy]");

  if (copySelect && copySelect.value) {

    const target =
      copySelect.dataset.copy;

    const source =
      copySelect.value;

    const match =
      state.matches.find(
        m => m.id === activeMatchId
      );

    const prediction =
      structuredClone(
        match.predictions[source] || {}
      );

    match.predictions[target] = prediction;

    renderMatchDialog();

  }
});

byId("saveMatchButton").addEventListener("click", saveActiveMatch);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => { });
}

renderAll();

document.addEventListener("DOMContentLoaded", async () => {

  await testSupabaseConnection();

});

window.App = {

  refresh() {

    saveState();

    renderAll();

  },

  loadState,

  renderDashboard,

  renderMatches,

  openMatchDialog

};
