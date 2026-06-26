const MatchDecisionRule = {

    calculate(match, prediction) {

        const knockoutStages = [

            "ROUND_OF_32",

            "ROUND_OF_16",

            "QUARTER_FINAL",

            "SEMI_FINAL",

            "FINAL"

        ];

        if (!knockoutStages.includes(match.stage))
            return 0;

        if (prediction.matchDecision === match.actualMatchDecision) {

            return ruleRepository.get("MATCH_DECISION");

            return 0;

        }
    }
};

window.MatchDecisionRule = MatchDecisionRule;