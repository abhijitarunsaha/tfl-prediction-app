const ScoreEngine = {

    rules: [],

    register(rule) {
        this.rules.push(rule);
    },

    getPredictedScore(prediction) {

        return {
            home: Number(prediction?.homeGoals ?? 0),
            away: Number(prediction?.awayGoals ?? 0)
        };

    },

    getActualScore(match) {

        return {
            home: Number(match?.actual?.homeGoalsFinal ?? 0),
            away: Number(match?.actual?.awayGoalsFinal ?? 0)
        };

    },

    getGoalDifference(homeGoals, awayGoals) {
        return homeGoals - awayGoals;
    },

    getTotalGoals(homeGoals, awayGoals) {
        return homeGoals + awayGoals;
    },

    getResult(homeGoals, awayGoals) {

        if (homeGoals > awayGoals)
            return "HOME";

        if (awayGoals > homeGoals)
            return "AWAY";

        return "DRAW";

    },

    calculate(match, prediction) {

        const breakdown = [];

        this.rules.forEach(rule => {

            breakdown.push(
                rule.calculate(match, prediction)
            );

        });

        return {

            breakdown,

            total: breakdown.reduce(
                (sum, item) => sum + item.points,
                0
            )

        };

    }

};

window.ScoreEngine = ScoreEngine;