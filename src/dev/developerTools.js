const DeveloperTools = {

    enabled() {

        return Config.developerMode;

    },

    cloneMatch(matchId) {

        const source =

            state.matches.find(

                match =>

                    match.id === matchId

            );

        if (!source) {

            console.error(

                "Match not found."

            );

            return null;

        }

        const copy =

            structuredClone(source);

        copy.id = `TEST-${crypto.randomUUID()}`;
        copy.round = "🧪 TEST MATCH";

        copy.status =

            "SCHEDULED";

        copy.actual = {

            homeGoals: "",

            awayGoals: "",

            homeGoalsFinal: "",

            awayGoalsFinal: "",

            homePenalties: "",

            awayPenalties: "",

            scorers: [],

            matchDecision: ""

        };

        copy.predictions = Object.fromEntries(

            Object.keys(state.tournamentPredictions).map(name => [

                name,

                {

                    homeGoals: "",

                    awayGoals: "",

                    scorers: "",

                    matchDecision: "",

                    submitted: false

                }

            ])

        );

        state.matches.unshift(copy);

        App.refresh();

        console.log(

            "Created",

            copy.id

        );

        return copy;

    },

    applyActualResult(sourceId, targetId) {

        const source =
            state.matches.find(m => m.id === sourceId);

        const target =
            state.matches.find(m => m.id === targetId);

        if (!source || !target)
            return;

        console.log("Source actual", source.actual);

        //target.actual = structuredClone(source.actual);
        target.actual =
    JSON.parse(JSON.stringify(source.actual));

        console.log("Target actual after copy", target.actual);

        App.refresh();

        console.log("Target actual after refresh", target.actual);

    },

    deleteMatch(id) {

        state.matches =

            state.matches.filter(

                match =>

                    match.id !== id

            );

        App.refresh();

    },

    clearCaches() {

        CacheService.clear();

        localStorage.removeItem(

            "tfl-last-sync"

        );

        console.log(

            "Caches cleared."

        );

    },

    runRegression() {

        window.runRegressionTests();

    }

};

window.DeveloperTools =
    DeveloperTools;