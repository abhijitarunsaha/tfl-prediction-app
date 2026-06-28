const OpenFootballMapper = {

    mapPlayer(player) {

        return {

            number: player.number,

            name: player.name,

            position: player.pos,

            club: player.club,

            dateOfBirth: player.date_of_birth

        };

    },

    mapSquad(players = []) {

        return players.map(
            player => this.mapPlayer(player)
        );

    },

    mapFixtures(matches = []) {

        return matches.map(
            match => this.mapFixture(match)
        );

    },

    mapFixture(match) {

        return {

            id:
                `${match.date}-${match.team1}-${match.team2}`,

            stage:
                this.mapStage(match),

            round:
                match.round,

            group:
                match.group || "",

            kickoff: this.mapKickoff(match),

            home:
                match.team1,

            away:
                match.team2,

            predictions:

                Object.fromEntries(

                    contestants.map(name => [

                        name,

                        {

                            homeGoals: "",

                            awayGoals: "",

                            scorers: "",

                            matchDecision: ""

                        }

                    ])

                ),

            actual: {

                homeGoalsFinal:
                    match.score?.ft?.[0] ?? "",

                awayGoalsFinal:
                    match.score?.ft?.[1] ?? "",

                scorers:
                    this.mapScorers(match)

            }

        };

    },

    mapKickoff(match) {

        if (!match.date || !match.time)
            return "";

        const [time, utcOffset] =
            match.time.split(" ");

        const offset =
            utcOffset.replace("UTC", "");

        let normalizedOffset;

        if (offset.includes(":")) {

            normalizedOffset = offset;

        } else {

            const sign =
                offset.startsWith("-") ? "-" : "+";

            const hour =
                offset.replace(/[+-]/, "").padStart(2, "0");

            normalizedOffset =
                `${sign}${hour}:00`;

        }

        return `${match.date}T${time}:00${normalizedOffset}`;

    },

    mapScorers(match) {

        const scorers = [];

        (match.goals1 || []).forEach(goal => {

            scorers.push(

                goal.owngoal
                    ? `${goal.name} (OG)`
                    : goal.name

            );

        });

        (match.goals2 || []).forEach(goal => {

            scorers.push(

                goal.owngoal
                    ? `${goal.name} (OG)`
                    : goal.name

            );

        });

        return scorers.join(", ");

    },

    mapStage(match) {

        if (match.group)
            return "GROUP";

        switch (match.round) {

            case "Round of 32":
                return "ROUND_OF_32";

            case "Round of 16":
                return "ROUND_OF_16";

            case "Quarter-finals":
                return "QUARTER_FINAL";

            case "Semi-finals":
                return "SEMI_FINAL";

            case "Third-place match":
                return "THIRD_PLACE";

            case "Final":
                return "FINAL";

            default:
                return "GROUP";

        }

    }

};

window.OpenFootballMapper = OpenFootballMapper;