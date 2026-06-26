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

        const predictedResult =
            ScoreEngine.getResult(
                predicted.home,
                predicted.away
            );

        const actualResult =
            ScoreEngine.getResult(
                actual.home,
                actual.away
            );

        if (predictedResult === actualResult) {

            return this.success(
                20,
                {
                    predictedResult,
                    actualResult
                }
            );

        }

        return this.failure(
            -10,
            {
                predictedResult,
                actualResult
            }
        );

    }

}

const resultRule = new ResultRule();

ScoreEngine.register(resultRule);

window.ResultRule = resultRule;