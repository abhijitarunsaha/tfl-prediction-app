class ExactScoreRule extends BaseRule {

    constructor() {
        super("Exact Score");
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

        const exactMatch =
            predicted.home === actual.home &&
            predicted.away === actual.away;

        if (exactMatch) {

            return this.success(
                20,
                {
                    predictedHome: predicted.home,
                    predictedAway: predicted.away,
                    actualHome: actual.home,
                    actualAway: actual.away
                }
            );

        }

        return this.failure(
            0,
            {
                predictedHome: predicted.home,
                predictedAway: predicted.away,
                actualHome: actual.home,
                actualAway: actual.away
            }
        );

    }

}

const exactScoreRule = new ExactScoreRule();

ScoreEngine.register(exactScoreRule);

window.ExactScoreRule = exactScoreRule;