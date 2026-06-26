class GoalDifferenceRule extends BaseRule {

    constructor() {
        super("Goal Difference");
    }

    calculate(match, prediction) {

        if (!match?.actual || !prediction) {

            return this.failure(
                0,
                {
                    reason: "Incomplete data"
                }
            );

        }

        const predicted =
            ScoreEngine.getPredictedScore(prediction);

        const actual =
            ScoreEngine.getActualScore(match);

        // Exact score already matched?
        if (
            predicted.home === actual.home &&
            predicted.away === actual.away
        ) {

            return this.failure(
                0,
                {
                    reason: "Exact score already awarded"
                }
            );

        }

        const predictedGD =
            ScoreEngine.getGoalDifference(
                predicted.home,
                predicted.away
            );

        const actualGD =
            ScoreEngine.getGoalDifference(
                actual.home,
                actual.away
            );

        if (predictedGD === actualGD) {

            return this.success(
                10,
                {
                    predictedGD,
                    actualGD
                }
            );

        }

        return this.failure(
            0,
            {
                predictedGD,
                actualGD
            }
        );

    }

}

const goalDifferenceRule = new GoalDifferenceRule();

ScoreEngine.register(goalDifferenceRule);

window.GoalDifferenceRule = goalDifferenceRule;