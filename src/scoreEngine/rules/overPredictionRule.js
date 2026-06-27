class OverPredictionRule extends BaseRule {

    constructor() {
        super("Over Prediction");
    }

    calculate(match, prediction) {

        if (!match?.actual || !prediction) {
            return this.failure(0, {
                reason: "Incomplete data"
            });
        }

        const predicted = ScoreEngine.getPredictedScore(prediction);
        const actual = ScoreEngine.getActualScore(match);

        const predictedTotal = ScoreEngine.getTotalGoals(
            predicted.home,
            predicted.away
        );

        const actualTotal = ScoreEngine.getTotalGoals(
            actual.home,
            actual.away
        );

        const difference = predictedTotal - actualTotal;

        if (difference >= 5) {

            return this.penalty(20, {
                predictedTotal,
                actualTotal,
                difference
            });

        }

        if (difference >= 3) {

            return this.penalty(10, {
                predictedTotal,
                actualTotal,
                difference
            });

        }

        return this.success(0, {
            predictedTotal,
            actualTotal,
            difference
        });

    }

}

const overPredictionRule = new OverPredictionRule();

ScoreEngine.register(overPredictionRule);

window.OverPredictionRule = overPredictionRule;