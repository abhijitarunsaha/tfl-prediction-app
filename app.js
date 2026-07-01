let contestants = [];

const storageKey = "tfl-fifa26-prediction-state-v1";
let state = loadState();
let activeMatchId = null;

initializeApplication();

function ensureSyncButtonIcon() {
  const button = document.getElementById("sync-btn");
  if (!button) return;
  if (!button.querySelector(".material-icon")) {
    button.innerHTML = `<span class="material-icon" data-icon="↻">sync</span>`;
  }
}

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

      button.setAttribute("aria-label", "Syncing…");

      try {

        await SyncService.sync();

        await SyncService.refreshLastSync();

      }
      finally {

        button.classList.remove(
          "syncing"
        );

        button.setAttribute("aria-label", "Sync");

        ensureSyncButtonIcon();

      }

    }

  );

async function loadContestants() {

  const loadedContestants =
    await ContestantRepository.getContestants();

  contestants =
    loadedContestants.map(

      contestant => contestant.name

    );

  baseScores =

    Object.fromEntries(

      loadedContestants.map(

        contestant => [

          contestant.name,

          contestant.baselineScore

        ]

      )

    );

}

function initialisePredictionContainers() {

  state.matches.forEach(match => {

    if (!match.predictions) {

      match.predictions = {};

    }

    contestants.forEach(contestant => {

      if (!match.predictions[contestant.name]) {

        match.predictions[contestant.name] = {

          homeGoals: "",

          awayGoals: "",

          scorers: "",

          matchDecision: "",

          matchOutcome: "",

          submitted: false

        };

      }

    });

  });

}

async function initializeApplication() {

  await loadContestants();

  await SyncService.sync();

  state.matches =
    await SyncService.loadTournament();

  initialisePredictionContainers();

  await loadPredictionsFromDatabase();

  await loadPointBreakdowns();

  renderMatches();

  renderDashboard();

  localStorage.setItem(

    "tfl-last-sync",

    new Date().toISOString()

  );

  await SyncService.refreshLastSync();

  ensureSyncButtonIcon();

  renderAll();

  SyncService.start();

  setInterval(ensureSyncButtonIcon, 3000);

  if (
    DeveloperTools.enabled()
  ) {
    document
      .getElementById("developer-panel")
      ?.removeAttribute("hidden");
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
        contestants.map(name => [
          name,
          defaultTournamentPrediction()
        ])
      ),

    overrides: {},

    pointBreakdowns: [],

    calculatedTotals: {},

    settings: {
      apiEndpoint: "",
      apiKey: ""
    }

  };

}

async function loadPointBreakdowns() {

  state.pointBreakdowns =

    await PointBreakdownRepository

      .getAll()

    ?? [];

  const contestants =

    await ContestantRepository

      .getContestants();

  const contestantMap =

    Object.fromEntries(

      contestants.map(

        contestant => [

          contestant.id,

          contestant.name

        ]

      )

    );

  state.calculatedTotals = {};

  Object.values(

    contestantMap

  ).forEach(

    name =>

      state.calculatedTotals[name] = 0

  );

  state.pointBreakdowns.forEach(

    row => {

      const contestant =

        contestantMap[

        row.predictions

          .contestant_id

        ];

      if (!contestant)

        return;

      state.calculatedTotals[

        contestant

      ] +=

        row.total_points ?? 0;

    }

  );

}

async function loadPredictionsFromDatabase() {

  const predictions =

    await PredictionRepository.getAllPredictions();

  const scorerPredictions =
    await ScorerPredictionRepository.getAllPredictionScorers();

  const contestants =

    await ContestantRepository.getContestants();

  const contestantMap =

    new Map(

      contestants.map(c => [

        c.id,

        c.name

      ])

    );

  const matchMap =

    new Map(

      state.matches.map(match => [

        match.databaseId,

        match

      ])

    );

  const scorerMap = new Map();

  scorerPredictions?.forEach(row => {

    if (

      !scorerMap.has(

        row.prediction_id

      )

    ) {

      scorerMap.set(

        row.prediction_id,

        []

      );

    }

    scorerMap
      .get(row.prediction_id)
      .push(row.player_name);

  });

  predictions.forEach(prediction => {

    const contestant =

      contestantMap.get(

        prediction.contestant_id

      );

    const match =

      matchMap.get(

        prediction.match_id

      );

    if (

      !contestant ||

      !match

    ) {

      return;

    }

    match.predictions[contestant] = {

      ...match.predictions[contestant],

      databaseId:
        prediction.id,

      matchOutcome:
        prediction.predicted_result ?? "",

      homeGoals:
        prediction.predicted_home_goals ?? "",

      awayGoals:
        prediction.predicted_away_goals ?? "",

      matchDecision:
        mapDatabaseDecision(

          prediction.predicted_match_decision

        ),

      scorers:

        (

          scorerMap.get(

            prediction.id

          ) ??

          []

        ).join(","),

      submitted: true

    };

  });

}

function mapDatabaseDecision(value) {

  switch (value) {

    case "NINETY_MINUTES":

      return "90";

    case "EXTRA_TIME":

      return "ET";

    case "PENALTY_SHOOTOUT":

      return "PEN";

    default:

      return "";

  }

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
    ...Object.fromEntries(contestants.map((name) => [name, defaultTournamentPrediction()])),
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
    match.actual.homeGoalsFinal === "" ||
    match.actual.awayGoalsFinal === "" ||
    match.actual.homeGoalsFinal === undefined ||
    match.actual.awayGoalsFinal === undefined
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
  return contestants.map((name) => {
    const matchPoints =

      state.calculatedTotals[name]

      ?? 0;
    const tournamentPoints = scoreTournament(name);
    const currentWeek = state.matches
      .filter((match) => new Date(match.kickoff) >= new Date("2026-06-26") && new Date(match.kickoff) < new Date("2026-07-03"))
      .reduce((sum, match) => sum + scoreMatch(match, name).total, 0);
    return {
      name: name,
      base: baseScores[name] ?? 0,
      matchPoints,
      tournamentPoints,
      weekly: currentWeek,
      total: (baseScores[name]) + matchPoints + tournamentPoints
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

  renderUpcomingPreview();
}

function signed(value) {
  return value > 0 ? `+${value}` : String(value);
}

/* ── Upcoming-preview section ─────────────── */
function renderUpcomingPreview() {
  const now = new Date();
  const horizon = new Date(now.getTime() + 12 * 60 * 60 * 1000);
  const upcoming = state.matches
    .filter(m => {
      if (isCompleted(m)) return false;
      const k = new Date(m.kickoff);
      return k >= now && k <= horizon;
    })
    .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));

  const section = byId("upcomingPreviewSection");
  const list    = byId("upcomingPreviewList");
  if (!upcoming.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  list.innerHTML = upcoming.map(match => {
    const kickoffTime = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true
    }).format(new Date(match.kickoff));
    const preds = submittedCount(match);
    return `
      <div class="preview-match-card" role="button" tabindex="0"
           data-preview-match="${match.id}"
           aria-label="View predictions for ${match.home} vs ${match.away}">
        <div class="preview-match-teams">
          <span>${match.home}</span>
          <span class="preview-vs">vs</span>
          <span>${match.away}</span>
        </div>
        <div class="preview-match-meta">
          <span class="preview-match-time">${kickoffTime}</span>
          <span class="preview-match-preds">${preds} / ${contestants.length} predicted</span>
        </div>
      </div>`;
  }).join("");
}

/* ── Prediction summary dialog ────────────── */
function formatDuration(code) {
  if (code === "90")  return "90 min";
  if (code === "ET")  return "Extra Time";
  if (code === "PEN") return "Penalties";
  return "";
}

function formatPredictionSummary(match, name) {
  const prediction = match.predictions[name];
  const hasGoals = prediction &&
    prediction.homeGoals !== "" && prediction.homeGoals !== undefined &&
    prediction.awayGoals !== "" && prediction.awayGoals !== undefined;

  if (!hasGoals) return null;

  const home = Number(prediction.homeGoals);
  const away = Number(prediction.awayGoals);
  const outcome = prediction.matchOutcome;
  const duration = formatDuration(prediction.matchDecision);

  // Outcome phrase
  let outcomePhrase;
  if (home > away) {
    outcomePhrase = `${match.home} wins ${home}-${away}`;
  } else if (away > home) {
    outcomePhrase = `${match.away} wins ${away}-${home}`;
  } else {
    // It's a draw / decided by tiebreaker
    if (outcome === "HOME") outcomePhrase = `${home}-${away} — ${match.home} wins tiebreaker`;
    else if (outcome === "AWAY") outcomePhrase = `${home}-${away} — ${match.away} wins tiebreaker`;
    else outcomePhrase = `${home}-${away} draw`;
  }
  if (duration) outcomePhrase += ` (${duration})`;

  // Scorers
  const allScorers = parseScorerPredictions(prediction.scorers || "");
  const scorerNames = allScorers.map(s => s.ownGoal ? `${s.player} (OG)` : s.player);

  let scorerPhrase = "";
  if (scorerNames.length === 1) {
    scorerPhrase = `. ${scorerNames[0]} scores.`;
  } else if (scorerNames.length === 2) {
    scorerPhrase = `. ${scorerNames[0]} and ${scorerNames[1]} score.`;
  } else if (scorerNames.length > 2) {
    const last = scorerNames.at(-1);
    const rest = scorerNames.slice(0, -1).join(", ");
    scorerPhrase = `. ${rest} and ${last} score.`;
  }

  return outcomePhrase + scorerPhrase;
}

function openPreviewDialog(matchId) {
  const match = state.matches.find(m => m.id === matchId);
  if (!match) return;

  byId("previewDialogEyebrow").textContent = match.round || "Predictions";
  byId("previewDialogTitle").textContent = `${match.home} vs ${match.away}`;

  const rows = contestants.map(name => {
    const summary = formatPredictionSummary(match, name);
    return `
      <div class="prediction-summary-row">
        <span class="prediction-summary-name">${name}</span>
        ${summary
          ? `<span class="prediction-summary-text">${summary}</span>`
          : `<span class="prediction-summary-no-pred">No prediction submitted yet</span>`
        }
      </div>`;
  }).join("");

  byId("previewDialogContent").innerHTML = rows ||
    `<p class="preview-no-preds">No predictions submitted yet.</p>`;

  byId("previewDialog").showModal();
  pushNavState({ type: "previewDialog", matchId });
}

// Close preview dialog via button
byId("previewDialogClose").addEventListener("click", () => {
  byId("previewDialog").close();
});

// Close preview dialog by clicking the backdrop
byId("previewDialog").addEventListener("click", (event) => {
  if (event.target === byId("previewDialog")) {
    byId("previewDialog").close();
  }
});

// Sync history when preview dialog closes (Esc / backdrop / button)
byId("previewDialog").addEventListener("close", () => {
  if (suppressHistoryPush) return;
  if (history.state?.tfl?.type === "previewDialog") {
    // Quietly rewrite the stale previewDialog entry back to root
    // without calling history.back() — that would trigger popstate
    // which would show the exit-confirmation prompt incorrectly.
    history.replaceState({ tfl: { type: "root" } }, "");
  }
});



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
  const filtered = current === "All" ? [...state.matches] : filterMatches(state.matches, current);
  const sorted = [...filtered].sort((a, b) => {
    const diff = new Date(a.kickoff) - new Date(b.kickoff);
    return current === "PAST" ? -diff : diff;
  });
  byId("matchList").innerHTML = sorted.map((match) => {
    const hasResult =

      match.actual?.homeGoalsFinal !== "" &&

      match.actual?.awayGoalsFinal !== "";
    return `
      <article class="match-card ${hasResult ? "complete" : ""}" data-edit-match="${match.id}" role="button" tabindex="0">
        <div>
          <div class="teams"><span>${match.home}</span><span class="badge">${hasResult ? `${match.actual.homeGoalsFinal} - ${match.actual.awayGoalsFinal}` : "vs"}</span><span>${match.away}</span></div>
          <p class="subtext">${match.round} | ${formatDate(match.kickoff)} | ${submittedCount(match)} predictions</p>
        </div>
        <span class="material-icon match-card-chevron" data-icon="›" aria-hidden="true">open</span>
      </article>
    `;
  }).join("");
}

function submittedCount(match) {
  return contestants.filter((name) => {
    const prediction = match.predictions[name] || {};
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
  pushNavState({ type: "dialog", matchId });
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
        <label class="full-span">Match Outcome<input class="input" disabled value="${'HOME' === match.actual.matchOutcome ? match.home + ' won' : 'AWAY' === match.actual.matchOutcome ? match.away + ' won' : "TBD" === match.actual.matchOutcome ? "TBD" : "DRAW"}"></label>
        <label>${match.home} goals<input class="input" disabled data-result="homeGoals" type="number" min="0" value="${match.actual.homeGoalsFinal}"></label>
        <label>${match.away} goals<input class="input" disabled data-result="awayGoals" type="number" min="0" value="${match.actual.awayGoalsFinal}"></label>
        ${showMatchDecision ? `<label>

Match Duration

<select
class="input" disabled
data-result="matchDecision">

<option value=""
    ${match.actual.matchDecision === "" ? "selected" : ""}>
    Select
</option>

<option value="90"
    ${match.actual.matchDecision === "90" ? "selected" : ""}>
    90 Minutes
</option>

<option value="ET"
    ${match.actual.matchDecision === "ET" ? "selected" : ""}>
    Extra Time
</option>

<option value="PEN"
    ${match.actual.matchDecision === "PEN" ? "selected" : ""}>
    Penalties
</option>

</select>

</label>
` : ""}
        <label class="full-span">Actual scorers<textarea disabled class="input" data-result="scorers" rows="2" placeholder="No goals scored">${match.actual.scorers ? match.actual.scorers : ""}</textarea></label>
        <label class="full-span">Own goals<textarea disabled class="input" data-result="ownGoals" rows="2" placeholder="No own goals">${match.actual.ownGoals ? match.actual.ownGoals : ""}</textarea></label>
      </div>
    </section>
    ${contestants.map((name) => predictionCard(

    match,

    name,

    homeScorerOptions,

    awayScorerOptions

  )).join("")}
  `;

  contestants.forEach((name) => refreshScorerOptions(name));
}

function escapeHtmlAttr(value) {
  return String(value).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
}

function predictionCard(match, name, homeScorerOptions, awayScorerOptions) {
  const prediction = match.predictions[name] || { homeGoals: "", awayGoals: "", scorers: "", matchOutcome: "" };
  const knockoutRounds = [
    "Round of 32",
    "Round of 16",
    "Quarter Final",
    "Semi Final",
    "Final"
  ];

  const showMatchDecision =
    knockoutRounds.includes(match.round);

  const homeScorers = parseScorerPredictions(prediction.scorers).filter(
    item => homeScorerOptions.includes(item.ownGoal ? `${item.player} (OG)` : item.player)
  );
  const awayScorers = parseScorerPredictions(prediction.scorers).filter(
    item => awayScorerOptions.includes(item.ownGoal ? `${item.player} (OG)` : item.player)
  );

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
        <label class="full-span">Match Outcome
          <select class="input" data-player="${name}" data-field="matchOutcome">
            <option value="" ${!prediction.matchOutcome ? "selected" : ""}>Select outcome</option>
            <option value="HOME" ${prediction.matchOutcome === `HOME` ? "selected" : ""}>${match.home} win</option>
            <option value="AWAY" ${prediction.matchOutcome === `AWAY` ? "selected" : ""}>${match.away} win</option>
            <option value="DRAW" ${prediction.matchOutcome === "DRAW" ? "selected" : ""}>Draw</option>
          </select>
        </label>
        <label>${match.home} goals<input class="input" data-player="${name}" data-field="homeGoals" data-goals-team="home" type="number" min="0" value="${prediction.homeGoals}"></label>
        <label>${match.away} goals<input class="input" data-player="${name}" data-field="awayGoals" data-goals-team="away" type="number" min="0" value="${prediction.awayGoals}"></label>
        ${showMatchDecision ? `
<label>
    Match Duration
    <select class="input"
            data-player="${name}"
            data-field="matchDecision">
        <option value=""
    ${prediction.matchDecision === "" ? "selected" : ""}>
    Select
</option>

<option value="90"
    ${prediction.matchDecision === "90" ? "selected" : ""}>
    90 Minutes
</option>

<option value="ET"
    ${prediction.matchDecision === "ET" ? "selected" : ""}>
    Extra Time
</option>

<option value="PEN"
    ${prediction.matchDecision === "PEN" ? "selected" : ""}>
    Penalties
</option>
    </select>
</label>
` : ""}
        <label class="full-span">${match.home} Scorers
          <input
            class="input scorer-typeahead-input"
            type="text"
            list="homeScorers-${name}-${match.id}"
            placeholder="Type to search ${match.home} players"
            data-scorer-typeahead="${name}"
            data-scorer-team="home"
            data-placeholder-default="Type to search ${match.home} players"
            data-scorer-options='${escapeHtmlAttr(JSON.stringify(homeScorerOptions))}'>
          <datalist id="homeScorers-${name}-${match.id}">
            ${homeScorerOptions.map(player => `<option value="${player}"></option>`).join("")}
          </datalist>
          <div class="scorer-chips" data-scorer-chips="${name}" data-chips-team="home">
            ${homeScorers.map((item, index) => scorerChip(name, "home", item, index)).join("")}
          </div>
        </label>
        <label class="full-span">${match.away} Scorers
          <input
            class="input scorer-typeahead-input"
            type="text"
            list="awayScorers-${name}-${match.id}"
            placeholder="Type to search ${match.away} players"
            data-scorer-typeahead="${name}"
            data-scorer-team="away"
            data-placeholder-default="Type to search ${match.away} players"
            data-scorer-options='${escapeHtmlAttr(JSON.stringify(awayScorerOptions))}'>
          <datalist id="awayScorers-${name}-${match.id}">
            ${awayScorerOptions.map(player => `<option value="${player}"></option>`).join("")}
          </datalist>
          <div class="scorer-chips" data-scorer-chips="${name}" data-chips-team="away">
            ${awayScorers.map((item, index) => scorerChip(name, "away", item, index)).join("")}
          </div>
        </label>
        <textarea hidden data-player="${name}" data-field="scorers">${prediction.scorers || ""}</textarea>
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
      <div class="contestant-card-actions">
        <button class="primary-button" type="button" data-save-player="${name}">Save ${name}'s Prediction</button>
      </div>
    </section>
  `;
}

function scorerChip(name, team, item, index) {
  const label = item.ownGoal ? `${item.player} (OG)` : item.player;
  return `
    <span class="scorer-chip">
      ${label}
      <button type="button" class="scorer-chip-remove" data-remove-scorer data-player="${name}" data-team="${team}" data-index="${index}" aria-label="Remove ${label}">×</button>
    </span>
  `;
}

function renderScoreBreakdown(breakdown = []) {

  const RULE_LABELS = {

    "Match Result": "🏆 Match Result",

    "Exact Score": "🎯 Exact Score",

    "Goal Difference": "📏 Goal Difference",

    "Scorers": "⚽ Scorers",

    "Match Decision": "⏱ Match Duration"

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

async function saveActualResult() {
  const match = state.matches.find((item) => item.id === activeMatchId);
  if (!match) return;
  document.querySelectorAll("[data-result]").forEach((field) => {
    match.actual[field.dataset.result] = field.value;
  });
  saveState();
  await CalculationService.calculateTournament();
  await loadPointBreakdowns();
  renderAll();
  await renderMatchDialog();
  showSnack("Match result saved and table refreshed");
}

async function savePlayerPrediction(name) {
  const match = state.matches.find((item) => item.id === activeMatchId);
  if (!match) return;

  const next = match.predictions[name] || {};
  document.querySelectorAll(`[data-player="${name}"]`).forEach((field) => {
    next[field.dataset.field] = field.value;
  });
  match.predictions[name] = next;

  const overrideField = document.querySelector(`[data-override="${name}"]`);
  const override = overrideField ? overrideField.value : "";
  state.overrides[`${match.id}:${name}`] = override;

  const savedPrediction =
    await PredictionRepository.saveMatchPrediction(
      name,
      match,
      match.predictions[name]
    );

  if (savedPrediction) {
    match.predictions[name].databaseId = savedPrediction.id;
  }

  saveState();
  await CalculationService.calculateTournament();
  await loadPointBreakdowns();
  renderAll();
  await renderMatchDialog();
  showSnack(`${name}'s prediction saved`);
}

function renderTournament() {
  byId("actualGoldenBoot").value = state.tournamentActuals.goldenBoot || "";
  byId("actualGoldenGlove").value = state.tournamentActuals.goldenGlove || "";
  byId("actualGoldenBall").value = state.tournamentActuals.goldenBall || "";
  byId("actualChampion").value = state.tournamentActuals.champion || "";
  byId("actualSemiFinalists").value = state.tournamentActuals.semiFinalists || "";
  byId("actualFinalists").value = state.tournamentActuals.finalists || "";

  byId("tournamentGrid").innerHTML = contestants.map((name) => {
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

async function saveTournament() {
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
  await CalculationService.calculateTournament();
  await loadPointBreakdowns();
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
    await CalculationService.calculateTournament();
    await loadPointBreakdowns();
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
  const dialog = document.getElementById("matchDialog");
  const snackbar = (dialog && dialog.open) ? byId("dialogSnackbar") : byId("snackbar");
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

document.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const matchCard = event.target.closest("[data-edit-match]");
  if (matchCard && matchCard.tagName === "ARTICLE") {
    event.preventDefault();
    await openMatchDialog(matchCard.dataset.editMatch);
  }
  const previewCard = event.target.closest("[data-preview-match]");
  if (previewCard) {
    event.preventDefault();
    openPreviewDialog(previewCard.dataset.previewMatch);
  }
});

document.addEventListener("click", async (event) => {
  const tab = event.target.closest(".tab");
  if (tab) {
    switchToView(tab.dataset.view);
    closeSideMenuUI();
  }
  if (event.target.closest("#menu-toggle")) {
    openSideMenu();
  }
  if (event.target.closest("#menu-close") || event.target === byId("menuOverlay")) {
    closeSideMenu();
  }
  const homeLink = event.target.closest("[data-go-home]");
  if (homeLink) {
    switchToView("dashboard");
  }
  const gotoButton = event.target.closest("[data-goto-view]");
  if (gotoButton) {
    switchToView(gotoButton.dataset.gotoView);
    if (gotoButton.dataset.roundFilter) {
      const filterField = byId("roundFilter");
      filterField.value = gotoButton.dataset.roundFilter;
      renderMatches();
    }
  }
  const previewCard = event.target.closest("[data-preview-match]");
  if (previewCard) { openPreviewDialog(previewCard.dataset.previewMatch); return; }
  const matchCard = event.target.closest("[data-edit-match]");
  if (matchCard) await openMatchDialog(matchCard.dataset.editMatch);
  if (event.target.closest("#recalculateAllButton")) {
    const refreshBtn = byId("recalculateAllButton");
    refreshBtn.classList.add("syncing");
    try {
    await CalculationService.calculateTournament();
    await loadPointBreakdowns();
    renderAll();
    showSnack("Leaderboard recalculated");
    } finally {
      byId("recalculateAllButton")?.classList.remove("syncing");
    }
  }
  if (event.target.closest("#calculateTournamentButton")) await saveTournament();
  if (event.target.closest("#exportButton")) exportData();
  if (event.target.closest("[data-calc-match]")) {
    await saveActualResult();
  }
  const savePlayerButton = event.target.closest("[data-save-player]");
  if (savePlayerButton) {
    await savePlayerPrediction(savePlayerButton.dataset.savePlayer);
  }
  const removeScorerChip = event.target.closest("[data-remove-scorer]");
  if (removeScorerChip) {
    const player = removeScorerChip.dataset.player;
    const team = removeScorerChip.dataset.team;
    const index = Number(removeScorerChip.dataset.index);
    removeScorerAt(player, team, index);
  }
});

/* ══════════════════════════════════════════════
   MOBILE BACK-BUTTON NAVIGATION
   Treat dashboard (no dialog, no menu) as the root
   state. Every other UI state (a non-dashboard view,
   the side menu, or the match dialog) gets its own
   history entry, so the hardware/gesture back button
   steps back one UI state at a time instead of
   immediately exiting the app. Pressing back again
   once at the root asks for exit confirmation.
   ══════════════════════════════════════════════ */
let suppressHistoryPush = false;
let pendingExitConfirm = false;

function currentNavState() {
  const dialog = byId("matchDialog");
  if (dialog && dialog.open) {
    return { type: "dialog", matchId: activeMatchId };
  }
  const sideMenu = byId("sideMenu");
  if (sideMenu && sideMenu.classList.contains("open")) {
    return { type: "menu" };
  }
  const activeView = document.querySelector(".view.active");
  const viewName = activeView ? activeView.id.replace(/View$/, "") : "dashboard";
  if (viewName !== "dashboard") {
    return { type: "view", view: viewName };
  }
  return { type: "root" };
}

function pushNavState(navState) {
  if (suppressHistoryPush) return;
  history.pushState({ tfl: navState }, "");
}

function applyNavState(navState) {
  if (!navState || navState.type === "root") {
    closeSideMenuUI();
    closeMatchDialogUI();
    closePreviewDialogUI();
    applyViewUI("dashboard");
    return;
  }
  if (navState.type === "view") {
    closeSideMenuUI();
    closeMatchDialogUI();
    closePreviewDialogUI();
    applyViewUI(navState.view);
    return;
  }
  if (navState.type === "menu") {
    closeMatchDialogUI();
    closePreviewDialogUI();
    openSideMenuUI();
    return;
  }
  if (navState.type === "dialog") {
    closeSideMenuUI();
    closePreviewDialogUI();
    if (navState.matchId) {
      activeMatchId = navState.matchId;
      suppressHistoryPush = true;
      renderMatchDialog().then(() => {
        const dialog = byId("matchDialog");
        if (dialog && !dialog.open) dialog.showModal();
        suppressHistoryPush = false;
      });
    }
    return;
  }
  if (navState.type === "previewDialog") {
    closeSideMenuUI();
    closeMatchDialogUI();
    if (navState.matchId) {
      suppressHistoryPush = true;
      openPreviewDialog(navState.matchId);
      suppressHistoryPush = false;
    }
  }
}

function closePreviewDialogUI() {
  const d = byId("previewDialog");
  if (d && d.open) d.close();
}

window.addEventListener("popstate", (event) => {
  const navState = event.state && event.state.tfl;

  if (!navState || navState.type === "root") {
    if (pendingExitConfirm) {
      // User confirmed exit and pressed back again — let it proceed.
      return;
    }
    pendingExitConfirm = true;
    suppressHistoryPush = true;
    history.pushState({ tfl: { type: "root" } }, "");
    suppressHistoryPush = false;

    const wantsToExit = window.confirm("Press back again to exit TFPL. Tap Cancel to stay.");
    if (wantsToExit) {
      pendingExitConfirm = false;
      history.back();
    } else {
      pendingExitConfirm = false;
    }
    return;
  }

  pendingExitConfirm = false;
  applyNavState(navState);
});

// Establish the root entry on load so the very first back press
// from the dashboard triggers the exit-confirmation flow above
// rather than leaving the app immediately.
if (!history.state || !history.state.tfl) {
  history.replaceState({ tfl: { type: "root" } }, "");
}

function switchToView(viewName) {
  applyViewUI(viewName);
  if (viewName === "dashboard") {
    pushNavState({ type: "root" });
  } else {
    pushNavState({ type: "view", view: viewName });
  }
}

function applyViewUI(viewName) {
  document.querySelectorAll(".tab").forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === `${viewName}View`));
}

function openSideMenu() {
  openSideMenuUI();
  pushNavState({ type: "menu" });
}

function openSideMenuUI() {
  byId("sideMenu").classList.add("open");
  const overlay = byId("menuOverlay");
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("show"));
  byId("menu-toggle").setAttribute("aria-expanded", "true");
}

function closeSideMenu() {
  closeSideMenuUI();
  if (history.state?.tfl?.type === "menu") {
    // Quietly rewrite the menu entry back to root — don't use
    // history.back() which would fire popstate and exit-confirmation.
    history.replaceState({ tfl: { type: "root" } }, "");
  }
}

function closeSideMenuUI() {
  byId("sideMenu").classList.remove("open");
  const overlay = byId("menuOverlay");
  overlay.classList.remove("show");
  byId("menu-toggle").setAttribute("aria-expanded", "false");
  setTimeout(() => { overlay.hidden = true; }, 250);
}

function closeMatchDialogUI() {
  const dialog = byId("matchDialog");
  if (dialog && dialog.open) dialog.close();
}

document.addEventListener("change", async (event) => {
  if (event.target.id === "roundFilter") renderMatches();

  // Goals field changed: trim scorers if now over the cap, refresh option availability either way
  const goalsField = event.target.closest("[data-goals-team]");
  if (goalsField) {
    const player = goalsField.dataset.player;
    const team = goalsField.dataset.goalsTeam;
    const cap = getGoalsCap(player, team);
    if (cap !== null) trimScorersToCap(player, team, cap);
    refreshScorerOptions(player);
    return;
  }

  // Scorer typeahead: selecting a value (from datalist or typed exact match) adds a chip
  const typeahead = event.target.closest("[data-scorer-typeahead]");
  if (typeahead) {
    const value = typeahead.value.trim();
    const team = typeahead.dataset.scorerTeam;
    const validOptions = Array.from(
      document.getElementById(typeahead.getAttribute("list"))?.options || []
    ).map(option => option.value);

    if (value && validOptions.includes(value)) {
      addScorer(typeahead.dataset.scorerTypeahead, team, value);
    }
    typeahead.value = "";
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

function getTeamOptionValues(player, team) {
  const input = document.querySelector(`[data-scorer-typeahead="${player}"][data-scorer-team="${team}"]`);
  if (!input) return [];
  try {
    return JSON.parse(input.dataset.scorerOptions || "[]");
  } catch {
    return [];
  }
}

function refreshScorerOptions(player) {
  const match = state.matches.find((item) => item.id === activeMatchId);
  if (!match) return;
  const textarea = document.querySelector(`textarea[data-player="${player}"][data-field="scorers"]`);
  const allEntries = parseScorerPredictions(textarea ? textarea.value : "");
  const selectedLabels = new Set(allEntries.map(e => e.ownGoal ? `${e.player} (OG)` : e.player));

  ["home", "away"].forEach((team) => {
    const input = document.querySelector(`[data-scorer-typeahead="${player}"][data-scorer-team="${team}"]`);
    if (!input) return;
    const fullOptions = getTeamOptionValues(player, team);
    const datalist = document.getElementById(input.getAttribute("list"));
    const cap = getGoalsCap(player, team);
    const teamSelectedCount = fullOptions.filter(opt => selectedLabels.has(opt)).length;
    const capReached = cap !== null && teamSelectedCount >= cap;

    const available = capReached
      ? []
      : fullOptions.filter(opt => !selectedLabels.has(opt));

    if (datalist) {
      datalist.innerHTML = available.map(opt => `<option value="${opt}"></option>`).join("");
    }

    input.disabled = capReached;
    input.placeholder = capReached
      ? "Goal limit reached for this team"
      : input.dataset.placeholderDefault;
  });
}

function trimScorersToCap(player, team, cap) {
  const textarea = document.querySelector(`textarea[data-player="${player}"][data-field="scorers"]`);
  const allEntries = parseScorerPredictions(textarea.value);
  const optionValues = getTeamOptionValues(player, team);

  let kept = 0;
  const filtered = allEntries.filter(entry => {
    const label = entry.ownGoal ? `${entry.player} (OG)` : entry.player;
    const belongsToTeam = optionValues.includes(label);
    if (!belongsToTeam) return true;
    if (kept < cap) {
      kept += 1;
      return true;
    }
    return false;
  });

  if (filtered.length !== allEntries.length) {
    textarea.value = filtered.map(e => e.ownGoal ? `${e.player} (OG)` : e.player).join(", ");
    refreshScorerChips(player);
    showSnack(`Scorer list trimmed to match the predicted goal count`);
  }
}

function getGoalsCap(player, team) {
  const field = document.querySelector(`[data-player="${player}"][data-goals-team="${team}"]`);
  const value = field ? Number(field.value) : NaN;
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function addScorer(player, team, value) {
  const textarea = document.querySelector(`textarea[data-player="${player}"][data-field="scorers"]`);
  const allEntries = parseScorerPredictions(textarea.value);
  const selectedLabels = new Set(allEntries.map(e => e.ownGoal ? `${e.player} (OG)` : e.player));

  if (selectedLabels.has(value)) {
    showSnack(`${value.replace(/\s+\(OG\)$/, "")} has already been selected for this contestant.`);
    return;
  }

  const fullOptions = getTeamOptionValues(player, team);
  const cap = getGoalsCap(player, team);
  const teamSelectedCount = fullOptions.filter(opt => selectedLabels.has(opt)).length;

  if (cap !== null && teamSelectedCount >= cap) {
    showSnack(`You've already selected ${cap} scorer${cap === 1 ? "" : "s"} for this team — increase the predicted goals to add more.`);
    return;
  }

  const ownGoal = value.endsWith(" (OG)");
  const entryLabel = ownGoal ? value.replace(/\s+\(OG\)$/, "") : value;

  allEntries.push({ player: entryLabel, ownGoal });
  textarea.value = allEntries.map(e => e.ownGoal ? `${e.player} (OG)` : e.player).join(", ");

  refreshScorerChips(player);
}

function removeScorerAt(player, team, indexWithinTeam) {
  const textarea = document.querySelector(`textarea[data-player="${player}"][data-field="scorers"]`);
  const allEntries = parseScorerPredictions(textarea.value);
  const teamOptionValues = getTeamOptionValues(player, team);

  let seen = -1;
  const filtered = allEntries.filter(entry => {
    const label = entry.ownGoal ? `${entry.player} (OG)` : entry.player;
    const belongsToTeam = teamOptionValues.includes(label);
    if (!belongsToTeam) return true;
    seen += 1;
    return seen !== indexWithinTeam;
  });

  textarea.value = filtered.map(e => e.ownGoal ? `${e.player} (OG)` : e.player).join(", ");
  refreshScorerChips(player);
}

function refreshScorerChips(player) {
  const match = state.matches.find((item) => item.id === activeMatchId);
  const textarea = document.querySelector(`textarea[data-player="${player}"][data-field="scorers"]`);
  const allEntries = parseScorerPredictions(textarea.value);

  ["home", "away"].forEach((team) => {
    const container = document.querySelector(`[data-scorer-chips="${player}"][data-chips-team="${team}"]`);
    if (!container) return;
    const optionValues = getTeamOptionValues(player, team);
    const teamEntries = allEntries.filter(entry => {
      const label = entry.ownGoal ? `${entry.player} (OG)` : entry.player;
      return optionValues.includes(label);
    });
    container.innerHTML = teamEntries.map((item, index) => scorerChip(player, team, item, index)).join("");
  });

  refreshScorerOptions(player);
}

byId("matchDialog").addEventListener("close", () => {
  if (suppressHistoryPush) return;
  if (history.state?.tfl?.type === "dialog") {
    // Quietly rewrite the stale dialog entry back to root without
    // calling history.back(), which would trigger the exit-confirmation.
    history.replaceState({ tfl: { type: "root" } }, "");
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => { });
}

//await CalculationService.calculateTournament();
renderAll();

document.addEventListener("DOMContentLoaded", async () => {

  await testSupabaseConnection();

});

window.App = {

  refresh() {

    saveState();

    //await CalculationService.calculateTournament();
    renderAll();

  },

  loadState,

  renderDashboard,

  renderMatches,

  openMatchDialog

};
