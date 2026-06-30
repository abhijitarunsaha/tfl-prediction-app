class ResultRule extends BaseRule {

    constructor() {
        super("Match Result");
    }

    calculate(match, prediction) {

        // Defensive check

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

        /*const predictedResult =
            ScoreEngine.getResult(
                predicted.home,
                predicted.away
            );

        const actualResult =
            ScoreEngine.getResult(
                actual.home,
                actual.away
            );*/

        const predictedOutcome = ScoreEngine.getPredictedOutcome(prediction);
        const actualOutcome = ScoreEngine.getActualOutcome(match);

        if (predictedOutcome === actualOutcome) {

            return this.success(
                20,
                {
                    predictedOutcome,
                    actualOutcome
                }
            );

        }

        return this.failure(
            -10,
            {
                predictedOutcome,
                actualOutcome
            }
        );

    }

}

const resultRule = new ResultRule();

ScoreEngine.register(resultRule);

window.ResultRule = resultRule;