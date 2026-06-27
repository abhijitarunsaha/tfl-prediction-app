(function () {

    function buildRegressionMatch(config) {

        return {

            stage: config.stage ?? "GROUP",

            actual: {

                homeGoalsFinal: config.actualHome,

                awayGoalsFinal: config.actualAway,

                scorers: config.actualScorers ?? "",

                matchDecision: config.actualDecision ?? ""

            },

            prediction: {

                homeGoals: config.predictedHome,

                awayGoals: config.predictedAway,

                scorers: config.predictedScorers ?? "",

                matchDecision: config.predictedDecision ?? ""

            }

        };

    }

    function assertTotal(score, expected) {

        assertEqual(
            score.total,
            expected,
            "Total Points"
        );

    }

    function assertRulePoints(score, ruleName, expected) {

        const rule = score.breakdown.find(
            r => r.rule === ruleName
        );

        if (!rule) {

            throw new Error(
                `Rule '${ruleName}' not found`
            );

        }

        assertEqual(
            rule.points,
            expected,
            ruleName
        );

    }

    window.buildRegressionMatch = buildRegressionMatch;

    window.assertTotal = assertTotal;

    window.assertRulePoints = assertRulePoints;

})();