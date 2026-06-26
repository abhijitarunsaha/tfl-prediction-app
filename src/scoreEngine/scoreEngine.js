const ScoreEngine = {

    rules: [],

    register(rule) {

        this.rules.push(rule);

    },

    calculate(match, prediction) {

        const breakdown = [];

        this.rules.forEach(rule => {

            breakdown.push(
                rule.calculate(match, prediction)
            );

        });

        return {

            breakdown,

            total: breakdown.reduce(
                (sum, item) => sum + item.points,
                0
            )

        };

    }

};

window.ScoreEngine = ScoreEngine;