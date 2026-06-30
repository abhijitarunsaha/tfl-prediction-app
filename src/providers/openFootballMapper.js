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

            predictions: {},

            actual: {

                homeGoalsFinal:
                    this.calculateFinalHomeGoals(match),

                awayGoalsFinal:
                    this.calculateFinalAwayGoals(match),

                scorers:
                    this.mapScorers(match),

                matchOutcome:
                    this.calculateMatchOutcome(match),

                matchDecision:
                    this.mapMatchDecision(match)
            }

        };

    },

    calculateFinalHomeGoals(match) {
        if (!match.score || match.score === undefined || match.score === null || match.score === "")
            return "";

        if (match.score.et)
            return match.score?.et?.[0] ?? "";

        return match.score?.ft?.[0] ?? "";
    },

    calculateFinalAwayGoals(match) {
        if (!match.score || match.score === undefined || match.score === null || match.score === "")
            return "";

        if (match.score.et)
            return match.score?.et?.[1] ?? "";

        return match.score?.ft?.[1] ?? "";
    },

    calculateMatchOutcome(match) {
        const home = this.calculateFinalHomeGoals(match);
        const away = this.calculateFinalAwayGoals(match);
        if (home === "" || away === "" || home === undefined || away === undefined) {
            return "TBD";
        }
        if (match.score.p) {
            const homePenalties = Number(match.score?.p?.[0]) ?? 0;
            const awayPenalties = Number(match.score?.p?.[1]) ?? 0;
            if (homePenalties > awayPenalties) return "HOME";
            if (awayPenalties > homePenalties) return "AWAY";
        }
        const homeGoals = Number(home);
        const awayGoals = Number(away);
        if (homeGoals > awayGoals) return "HOME";
        if (awayGoals > homeGoals) return "AWAY";
        return "DRAW";
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

            case "Quarter-final":
                return "QUARTER_FINAL";

            case "Semi-final":
                return "SEMI_FINAL";

            case "Match for third place":
                return "FINAL";

            case "Final":
                return "FINAL";

            default:
                return "GROUP";

        }

    },

    mapMatchDecision(match) {

        if (!match.score)
            return "";

        if (match.score.p)
            return "PEN";

        if (match.score.et)
            return "ET";

        return "90";

    }

};

window.OpenFootballMapper = OpenFootballMapper;