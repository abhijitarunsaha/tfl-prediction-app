registerRegressionTest(

    "Perfect Prediction",

    () => {

        const data = buildRegressionMatch({

            actualHome:3,
            actualAway:1,

            predictedHome:3,
            predictedAway:1,

            actualScorers:
                "Musiala,Havertz,Havertz,Rudiger (OG)",

            predictedScorers:
                "Musiala,Havertz,Rudiger (OG)"

        });

        const score =
            ScoreEngine.calculate(
                data,
                data.prediction
            );

        assertRulePoints(
            score,
            "Match Result",
            20
        );

        assertRulePoints(
            score,
            "Exact Score",
            20
        );

        assertRulePoints(
            score,
            "Goal Difference",
            0
        );

        assertRulePoints(
            score,
            "Scorers",
            40
        );

        assertRulePoints(
            score,
            "Over Prediction",
            0
        );

        assertTotal(
            score,
            80
        );

    }

);

registerRegressionTest(

    "Goal Difference Only",

    () => {

        const data = buildRegressionMatch({

            actualHome: 3,
            actualAway: 1,

            predictedHome: 2,
            predictedAway: 0,

            actualScorers: "Musiala,Havertz,Havertz,Rudiger (OG)",
            predictedScorers: "Musiala,Havertz"

        });

        const score = ScoreEngine.calculate(data, data.prediction);

        assertRulePoints(score, "Match Result", 20);
        assertRulePoints(score, "Exact Score", 0);
        assertRulePoints(score, "Goal Difference", 10);
        assertRulePoints(score, "Scorers", 30);
        assertRulePoints(score, "Over Prediction", 0);

        assertTotal(score, 60);

    }

);

registerRegressionTest(

    "Own Goal Penalty",

    () => {

        const data = buildRegressionMatch({

            actualHome: 3,
            actualAway: 1,

            predictedHome: 3,
            predictedAway: 1,

            actualScorers: "Musiala,Havertz,Havertz,Rudiger (OG)",
            predictedScorers: "Musiala,Havertz,Rudiger"

        });

        const score = ScoreEngine.calculate(data, data.prediction);

        assertRulePoints(score, "Scorers", 20);

        assertTotal(score, 60);

    }

);

registerRegressionTest(

    "Over Prediction -10",

    () => {

        const data = buildRegressionMatch({

            actualHome: 2,
            actualAway: 1,

            predictedHome: 4,
            predictedAway: 2

        });

        const score = ScoreEngine.calculate(data, data.prediction);

        assertRulePoints(score, "Over Prediction", -10);

        assertTotal(score, 10);

    }

);

registerRegressionTest(

    "Over Prediction -20",

    () => {

        const data = buildRegressionMatch({

            actualHome: 1,
            actualAway: 0,

            predictedHome: 4,
            predictedAway: 2

        });

        const score = ScoreEngine.calculate(data, data.prediction);

        assertRulePoints(score, "Over Prediction", -20);

        assertTotal(score, 0);

    }

);

registerRegressionTest(

    "Under Prediction",

    () => {

        const data = buildRegressionMatch({

            actualHome: 4,
            actualAway: 0,

            predictedHome: 1,
            predictedAway: 0

        });

        const score = ScoreEngine.calculate(data, data.prediction);

        assertRulePoints(score, "Over Prediction", 0);

        assertTotal(score, 20);

    }

);

registerRegressionTest(

    "Knockout Correct Decision",

    () => {

        const data = buildRegressionMatch({

            stage: "QUARTER_FINAL",

            actualHome: 1,
            actualAway: 1,

            predictedHome: 1,
            predictedAway: 1,

            actualDecision: "PENALTIES_HOME",
            predictedDecision: "PENALTIES_HOME"

        });

        const score = ScoreEngine.calculate(data, data.prediction);

        assertRulePoints(score, "Match Decision", 10);

        assertTotal(score, 50);

    }

);

registerRegressionTest(

    "Knockout Wrong Decision",

    () => {

        const data = buildRegressionMatch({

            stage: "QUARTER_FINAL",

            actualHome: 1,
            actualAway: 1,

            predictedHome: 1,
            predictedAway: 1,

            actualDecision: "PENALTIES_HOME",
            predictedDecision: "EXTRA_TIME_HOME"

        });

        const score = ScoreEngine.calculate(data, data.prediction);

        assertRulePoints(score, "Match Decision", 0);

        assertTotal(score, 40);

    }

);

registerRegressionTest(

    "Combined Rules",

    () => {

        const data = buildRegressionMatch({

            actualHome: 3,
            actualAway: 2,

            predictedHome: 4,
            predictedAway: 2,

            actualScorers: "Musiala,Havertz,Havertz,Enciso,Rudiger (OG)",

            predictedScorers: "Musiala,Havertz,Rudiger (OG)"

        });

        const score = ScoreEngine.calculate(data, data.prediction);

        assertRulePoints(score, "Match Result", 20);
        assertRulePoints(score, "Goal Difference", 0);
        assertRulePoints(score, "Scorers", 40);
        assertRulePoints(score, "Over Prediction", 0);

        assertTotal(score, 60);

    }

);

registerRegressionTest(

    "Scorer Stress Test",

    () => {

        const data = buildRegressionMatch({

            actualHome: 5,
            actualAway: 2,

            predictedHome: 5,
            predictedAway: 2,

            actualScorers:
                "Musiala,Musiala,Musiala,Havertz,Rudiger (OG),Enciso,Enciso",

            predictedScorers:
                "Musiala,Havertz,Rudiger (OG)"

        });

        const score = ScoreEngine.calculate(data, data.prediction);

        assertRulePoints(score, "Scorers", 50);

        assertTotal(score, 90);

    }

);

registerRegressionTest(

    "Draw Scenario With Own Goals",

    () => {

        const data = buildRegressionMatch({

            actualHome: 2,
            actualAway: 2,

            predictedHome: 2,
            predictedAway: 2,

            actualScorers: "Musiala,Havertz,Enciso,Havertz (OG)",

            predictedScorers: "Musiala,Havertz,Enciso,Mauricio"

        });

        const score = ScoreEngine.calculate(data, data.prediction);

        assertRulePoints(score, "Match Result", 20);
        assertRulePoints(score, "Exact Score", 20);
        assertRulePoints(score, "Goal Difference", 0);
        assertRulePoints(score, "Scorers", 20);
        assertRulePoints(score, "Over Prediction", 0);

        assertTotal(score, 60);

    }

);

registerRegressionTest(

    "Actual Score Field Mapping",

    () => {

        const data = buildRegressionMatch({

            actualHome: 1,
            actualAway: 0,

            predictedHome: 4,
            predictedAway: 2

        });

        // Explicitly verify the builder populated the new fields.
        assertEqual(
            data.actual.homeGoalsFinal,
            1,
            "homeGoalsFinal mapping"
        );

        assertEqual(
            data.actual.awayGoalsFinal,
            0,
            "awayGoalsFinal mapping"
        );

        const score = ScoreEngine.calculate(
            data,
            data.prediction
        );

        assertRulePoints(
            score,
            "Over Prediction",
            -20
        );

        assertTotal(
            score,
            0
        );

    }

);