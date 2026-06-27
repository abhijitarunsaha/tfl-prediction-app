const contestants = ["Kaustav", "Durbar", "Jeet", "Sayantan", "Santanu", "Abhijit"];

const baseScores = {
  Kaustav: 1290,
  Durbar: 1220,
  Santanu: 1140,
  Abhijit: 1010,
  Sayantan: 830,
  Jeet: 680
};

const squads = {
  Argentina: ["Lionel Messi", "Julian Alvarez", "Lautaro Martinez", "Enzo Fernandez", "Alexis Mac Allister", "Angel Di Maria"],
  Brazil: ["Vinicius Junior", "Rodrygo", "Neymar", "Raphinha", "Endrick", "Lucas Paqueta"],
  France: ["Kylian Mbappe", "Antoine Griezmann", "Olivier Giroud", "Ousmane Dembele", "Aurelien Tchouameni", "Marcus Thuram"],
  England: ["Harry Kane", "Jude Bellingham", "Bukayo Saka", "Phil Foden", "Cole Palmer", "Declan Rice"],
  Spain: ["Alvaro Morata", "Lamine Yamal", "Pedri", "Nico Williams", "Dani Olmo", "Ferran Torres"],
  Germany: ["Kai Havertz", "Jamal Musiala", "Florian Wirtz", "Niclas Fullkrug", "Leroy Sane", "Ilkay Gundogan"],
  Portugal: ["Cristiano Ronaldo", "Bruno Fernandes", "Bernardo Silva", "Rafael Leao", "Goncalo Ramos", "Joao Felix"],
  Netherlands: ["Memphis Depay", "Cody Gakpo", "Xavi Simons", "Wout Weghorst", "Donyell Malen", "Frenkie de Jong"],
  USA: ["Christian Pulisic", "Folarin Balogun", "Gio Reyna", "Tim Weah", "Weston McKennie", "Yunus Musah"],
  Turkey: ["Arda Guler", "Kenan Yildiz", "Hakan Calhanoglu", "Kerem Akturkoglu", "Baris Alper Yilmaz", "Orkun Kokcu"],
  Paraguay: ["Miguel Almiron", "Julio Enciso", "Ramon Sosa", "Matias Rojas", "Adam Bareiro", "Diego Gomez"],
  Australia: ["Mathew Leckie", "Mitchell Duke", "Craig Goodwin", "Riley McGree", "Jackson Irvine", "Martin Boyle"],
  Iraq: ["Aymen Hussein", "Ali Jasim", "Ibrahim Bayesh", "Mohannad Ali", "Bashar Resan", "Amir Al-Ammari"],
  Norway: ["Erling Haaland", "Martin Odegaard", "Alexander Sorloth", "Oscar Bobb", "Antonio Nusa", "Fredrik Aursnes"],
  Mexico: ["Santiago Gimenez", "Hirving Lozano", "Uriel Antuna", "Edson Alvarez", "Luis Chavez", "Henry Martin"],
  Canada: ["Jonathan David", "Alphonso Davies", "Cyle Larin", "Tajon Buchanan", "Stephen Eustaquio", "Ismael Kone"],
  Japan: ["Kaoru Mitoma", "Takefusa Kubo", "Daichi Kamada", "Takumi Minamino", "Ritsu Doan", "Ayase Ueda"],
  Uruguay: ["Darwin Nunez", "Federico Valverde", "Luis Suarez", "Facundo Pellistri", "Giorgian de Arrascaeta", "Manuel Ugarte"],
  Croatia: ["Luka Modric", "Andrej Kramaric", "Bruno Petkovic", "Ivan Perisic", "Mateo Kovacic", "Marcelo Brozovic"],
  Morocco: ["Achraf Hakimi", "Hakim Ziyech", "Youssef En-Nesyri", "Sofiane Boufal", "Amine Harit", "Azzedine Ounahi"],
  Senegal: ["Sadio Mane", "Nicolas Jackson", "Ismaila Sarr", "Iliman Ndiaye", "Pape Matar Sarr", "Idrissa Gueye"],
  "TBD A": ["TBD Player 1", "TBD Player 2", "TBD Player 3"],
  "TBD B": ["TBD Player 1", "TBD Player 2", "TBD Player 3"]
};

const seedMatches = [
  ["GS-1", "Group Stage", "2026-06-26T21:30:00+05:30", "Turkey", "USA"],
  ["GS-2", "Group Stage", "2026-06-26T21:30:00+05:30", "Paraguay", "Australia"],
  ["GS-3", "Group Stage", "2026-06-27T00:30:00+05:30", "Senegal", "Iraq"],
  ["GS-4", "Group Stage", "2026-06-27T00:30:00+05:30", "Norway", "France"],
  ["R32-1", "Round of 32", "2026-06-28T21:30:00+05:30", "Argentina", "Mexico"],
  ["R32-2", "Round of 32", "2026-06-29T00:30:00+05:30", "France", "USA"],
  ["R32-3", "Round of 32", "2026-06-29T21:30:00+05:30", "Brazil", "Canada"],
  ["R32-4", "Round of 32", "2026-06-30T00:30:00+05:30", "England", "Japan"],
  ["R32-5", "Round of 32", "2026-06-30T21:30:00+05:30", "Spain", "Senegal"],
  ["R32-6", "Round of 32", "2026-07-01T00:30:00+05:30", "Germany", "Morocco"],
  ["R32-7", "Round of 32", "2026-07-01T21:30:00+05:30", "Portugal", "Croatia"],
  ["R32-8", "Round of 32", "2026-07-02T00:30:00+05:30", "Netherlands", "Uruguay"],
  ["R32-9", "Round of 32", "2026-07-02T21:30:00+05:30", "TBD A", "TBD B"],
  ["R32-10", "Round of 32", "2026-07-03T00:30:00+05:30", "TBD A", "TBD B"],
  ["R32-11", "Round of 32", "2026-07-03T21:30:00+05:30", "TBD A", "TBD B"],
  ["R32-12", "Round of 32", "2026-07-04T00:30:00+05:30", "TBD A", "TBD B"],
  ["R32-13", "Round of 32", "2026-07-04T21:30:00+05:30", "TBD A", "TBD B"],
  ["R32-14", "Round of 32", "2026-07-05T00:30:00+05:30", "TBD A", "TBD B"],
  ["R32-15", "Round of 32", "2026-07-05T21:30:00+05:30", "TBD A", "TBD B"],
  ["R32-16", "Round of 32", "2026-07-06T00:30:00+05:30", "TBD A", "TBD B"],
  ["R16-1", "Round of 16", "2026-07-07T21:30:00+05:30", "TBD A", "TBD B"],
  ["R16-2", "Round of 16", "2026-07-08T00:30:00+05:30", "TBD A", "TBD B"],
  ["R16-3", "Round of 16", "2026-07-08T21:30:00+05:30", "TBD A", "TBD B"],
  ["R16-4", "Round of 16", "2026-07-09T00:30:00+05:30", "TBD A", "TBD B"],
  ["R16-5", "Round of 16", "2026-07-09T21:30:00+05:30", "TBD A", "TBD B"],
  ["R16-6", "Round of 16", "2026-07-10T00:30:00+05:30", "TBD A", "TBD B"],
  ["R16-7", "Round of 16", "2026-07-10T21:30:00+05:30", "TBD A", "TBD B"],
  ["R16-8", "Round of 16", "2026-07-11T00:30:00+05:30", "TBD A", "TBD B"],
  ["QF-1", "Quarter-final", "2026-07-12T00:30:00+05:30", "TBD A", "TBD B"],
  ["QF-2", "Quarter-final", "2026-07-12T21:30:00+05:30", "TBD A", "TBD B"],
  ["QF-3", "Quarter-final", "2026-07-13T00:30:00+05:30", "TBD A", "TBD B"],
  ["QF-4", "Quarter-final", "2026-07-13T21:30:00+05:30", "TBD A", "TBD B"],
  ["SF-1", "Semi-final", "2026-07-15T00:30:00+05:30", "TBD A", "TBD B"],
  ["SF-2", "Semi-final", "2026-07-16T00:30:00+05:30", "TBD A", "TBD B"],
  ["F-1", "Final", "2026-07-20T00:30:00+05:30", "TBD A", "TBD B"]
].map(([id, round, kickoff, home, away]) => ({
  id,
  round,
  kickoff,
  home,
  away,
  actual: { homeGoals: "", awayGoals: "", scorers: "", ownGoals: "" },
  predictions: {}
}));

const storageKey = "tfl-fifa26-prediction-state-v1";
let state = loadState();
let activeMatchId = null;

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (saved) return reconcileState(JSON.parse(saved));
  return {
    matches: seedMatches,
    tournamentActuals: { goldenBoot: "", goldenGlove: "", goldenBall: "", champion: "", semiFinalists: "", finalists: "" },
    tournamentPredictions: Object.fromEntries(contestants.map((name) => [name, defaultTournamentPrediction()])),
    overrides: {},
    settings: { apiEndpoint: "", apiKey: "" }
  };
}

function reconcileState(savedState) {
  const matchesById = new Map((savedState.matches || []).map((match) => [match.id, match]));
  savedState.matches = seedMatches.map((seedMatch) => matchesById.get(seedMatch.id) || seedMatch);
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
  return contestants.map((name) => {
    const matchPoints = state.matches.reduce((sum, match) => sum + scoreMatch(match, name).total, 0);
    const tournamentPoints = scoreTournament(name);
    const currentWeek = state.matches
      .filter((match) => new Date(match.kickoff) >= new Date("2026-06-26") && new Date(match.kickoff) < new Date("2026-07-03"))
      .reduce((sum, match) => sum + scoreMatch(match, name).total, 0);
    return {
      name,
      base: baseScores[name],
      matchPoints,
      tournamentPoints,
      weekly: currentWeek,
      total: baseScores[name] + matchPoints + tournamentPoints
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
      <div class="rank">${index + 1}</div>
      <div>
        <p class="player-name">${row.name}</p>
        <p class="subtext">Base ${row.base} | Match ${signed(row.matchPoints)} | Futures ${signed(row.tournamentPoints)}</p>
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

function renderMatches() {
  const rounds = ["All", ...new Set(state.matches.map((match) => match.round))];
  const current = byId("roundFilter").value || "All";
  byId("roundFilter").innerHTML = rounds.map((round) => `<option ${round === current ? "selected" : ""}>${round}</option>`).join("");
  const filtered = current === "All" ? state.matches : state.matches.filter((match) => match.round === current);
  byId("matchList").innerHTML = filtered.map((match) => {
    const hasResult = match.actual.homeGoals !== "" && match.actual.awayGoals !== "";
    return `
      <article class="match-card ${hasResult ? "complete" : ""}">
        <div>
          <div class="teams"><span>${match.home}</span><span class="badge">${hasResult ? `${match.actual.homeGoals}-${match.actual.awayGoals}` : "vs"}</span><span>${match.away}</span></div>
          <p class="subtext">${match.round} | ${formatDate(match.kickoff)} | ${submittedCount(match)} predictions</p>
        </div>
        <button class="primary-button" data-edit-match="${match.id}">Open</button>
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
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function openMatchDialog(matchId) {
  activeMatchId = matchId;
  renderMatchDialog();
  byId("matchDialog").showModal();
}

function renderMatchDialog() {
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
    squads[match.home] || [];

  const awayPlayers =
    squads[match.away] || [];

  const homeScorerOptions = [

    ...homePlayers,

    ...awayPlayers.map(
      p => `${p} (OG)`
    )

  ];

  const awayScorerOptions = [

    ...awayPlayers,

    ...homePlayers.map(
      p => `${p} (OG)`
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
        <label>${match.home} goals<input class="input" data-result="homeGoals" type="number" min="0" value="${match.actual.homeGoals}"></label>
        <label>${match.away} goals<input class="input" data-result="awayGoals" type="number" min="0" value="${match.actual.awayGoals}"></label>
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
    ${contestants.map((name) => predictionCard(

    match,

    name,

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
  contestants.forEach((name) => {
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

document.addEventListener("click", (event) => {
  const tab = event.target.closest(".tab");
  if (tab) {
    document.querySelectorAll(".tab").forEach((item) => item.classList.toggle("active", item === tab));
    document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === `${tab.dataset.view}View`));
  }
  const editButton = event.target.closest("[data-edit-match]");
  if (editButton) openMatchDialog(editButton.dataset.editMatch);
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

  /*const leaderboard =
    await leaderboardRepository.getLeaderboard();

  console.table(leaderboard);*/

});
