const RuleMapping = {

    RESULT:

        "Match Result",

    SCORE:

        "Exact Score",

    GOAL_DIFFERENCE:

        "Goal Difference",

    SCORERS:

        "Scorers",

    OVER_PREDICTION:

        "Over Prediction",

    MATCH_DECISION:

        "Match Decision"

};

const CalculationService = {

    async calculateMatch(match) {

        for (

            const contestant of contestants

        ) {

            const prediction =

                match.predictions[contestant];

            if (

                !prediction ||

                !prediction.databaseId

            ) {

                continue;

            }

            const score =

                scoreMatch(

                    match,

                    contestant

                );

            const breakdownMap =

                Object.fromEntries(

                    score.breakdown.map(

                        item => [

                            item.rule,

                            item.points

                        ]

                    )

                );

            await PointBreakdownRepository

                .saveBreakdown({

                    prediction_id:

                        prediction.databaseId,

                    result_points:

                        breakdownMap[

                        RuleMapping.RESULT

                        ] ?? 0,

                    score_points:

                        breakdownMap[

                        RuleMapping.SCORE

                        ] ?? 0,

                    goal_difference_points:

                        breakdownMap[

                        RuleMapping.GOAL_DIFFERENCE

                        ] ?? 0,

                    scorer_points:

                        breakdownMap[

                        RuleMapping.SCORERS

                        ] ?? 0,

                    match_decision_points:

                        breakdownMap[

                        RuleMapping.MATCH_DECISION

                        ] ?? 0,

                    overprediction_penalty:

                        breakdownMap[

                        RuleMapping.OVER_PREDICTION

                        ] ?? 0,

                    manual_override:

                        0,

                    total_points:

                        score.total,

                    calculated_at:

                        new Date()

                            .toISOString()

                });

        }

    },

    async calculateTournament() {

        for (

            const match of state.matches

        ) {

            await this.calculateMatch(

                match

            );

        }

    }

};

window.CalculationService =
    CalculationService;