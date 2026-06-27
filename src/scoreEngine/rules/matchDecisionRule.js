class MatchDecisionRule extends BaseRule {

    constructor() {
        super("Match Decision");
    }

    calculate(match, prediction) {

        const knockoutStages = [
            "ROUND_OF_32",
            "ROUND_OF_16",
            "QUARTER_FINAL",
            "SEMI_FINAL",
            "FINAL"
        ];

        // Rule does not apply to group stage
        if (!knockoutStages.includes(match.stage)) {
            return this.failure(0, {
                reason: "Group stage"
            });
        }

        if (!match.actual || !prediction) {
            return this.failure(0, {
                reason: "Incomplete data"
            });
        }

        const predictedDecision = prediction.matchDecision || "";
        const actualDecision = match.actual.matchDecision || "";

        if (predictedDecision === actualDecision) {

            return this.success(10, {
                predictedDecision,
                actualDecision
            });

        }

        return this.failure(0, {
            predictedDecision,
            actualDecision
        });

    }

}

const matchDecisionRule = new MatchDecisionRule();

ScoreEngine.register(matchDecisionRule);

window.MatchDecisionRule = matchDecisionRule;