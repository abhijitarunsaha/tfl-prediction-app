const MatchFactory = {

    create(baseMatch) {

        return {

            ...baseMatch,

            predictions: this.createPredictions(),

            actual: {

                homeGoals: "",

                awayGoals: "",

                homeGoalsFinal:
                    baseMatch.actual.homeGoalsFinal,

                awayGoalsFinal:
                    baseMatch.actual.awayGoalsFinal,

                scorers:
                    baseMatch.actual.scorers,

                matchDecision:
                    baseMatch.actual.matchDecision || ""

            },

            calculated: false,

            locked: false

        };

    },

    createPredictions() {

        return Object.fromEntries(

            contestants.map(contestants => [

                contestants.name,

                {

                    homeGoals: "",

                    awayGoals: "",

                    scorers: "",

                    matchDecision: ""

                }

            ])

        );

    },

    merge(existingMatch, downloadedMatch) {

        return {

            ...downloadedMatch,

            predictions:
                existingMatch?.predictions ||
                this.createPredictions(),

            locked:
                existingMatch?.locked ?? false,

            calculated:
                existingMatch?.calculated ?? false

        };

    }

};

window.MatchFactory = MatchFactory;