class ScorerRule extends BaseRule {

    constructor() {
        super("Scorers");
    }

    calculate(match, prediction) {

        if (!match?.actual || !prediction) {
            return this.failure(0, {
                reason: "Incomplete data"
            });
        }

        const predictedScorers =
            parseScorerPredictions(
                prediction.scorers || ""
            );

        const actualScorers =
            parseActualScorers(
                match.actual.scorers || ""
            );

        let points = 0;

        const breakdown = [];

        predictedScorers.forEach(predicted => {

            actualScorers.forEach(actual => {

                if (predicted.player !== actual.player)
                    return;

                // Normal goal predicted and scored
                if (!predicted.ownGoal && !actual.ownGoal) {

                    points += 10;

                    breakdown.push({
                        player: predicted.player,
                        ownGoal: false,
                        points: 10
                    });

                    return;
                }

                // Own goal predicted and occurred
                if (predicted.ownGoal && actual.ownGoal) {

                    points += 10;

                    breakdown.push({
                        player: predicted.player,
                        ownGoal: true,
                        points: 10
                    });

                    return;
                }

                // Predicted goal, scored own goal
                if (!predicted.ownGoal && actual.ownGoal) {

                    points -= 10;

                    breakdown.push({
                        player: predicted.player,
                        ownGoal: true,
                        points: -10
                    });

                    return;
                }

                // Predicted OG, scored normal goal
                // 0 points
            });

        });

        if (points > 0) {

            return this.success(points, {
                breakdown
            });

        }

        return this.failure(points, {
            breakdown
        });

    }

}

const scorerRule = new ScorerRule();

ScoreEngine.register(scorerRule);

window.ScorerRule = scorerRule;