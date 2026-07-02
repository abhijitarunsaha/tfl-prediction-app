class OpenFootballProvider {

    constructor() {

        this.fixturesUrl =
            "https://raw.githubusercontent.com/openfootball/worldcup.json/refs/heads/master/2026/worldcup.json";

        this.squadsUrl =
            "https://raw.githubusercontent.com/openfootball/worldcup.json/refs/heads/master/2026/worldcup.squads.json";

    }

    getInfo() {

        return {

            name: "OpenFootball",

            supportsSync: true,

            supportsLiveScores: false

        };

    }

    async getFixtures() {

        const tournament =
            await this.getTournament();

        return tournament.matches;

    }

    async getSquad(teamName) {

        const response =
            await HttpClient.get(this.squadsUrl);

        if (!response.success) {

            console.error(
                "Unable to download squads",
                response.error
            );

            return [];

        }

        const squads = response.data;

        let team = squads.find(
            t => t.name === teamName
        );

        if (!team) {

            if(teamName === "USA") {
                team = squads.find(t => t.name === "United States");
            } else if(teamName === "Bosnia & Herzegovina") {
                team = squads.find(t => t.name === "Bosnia and Herzegovina");
            }else {
                return [];
            }
        }

        return OpenFootballMapper.mapSquad(
            team.players
        );

    }

    async syncTournament() {

        return {

            success: true,

            updatedMatches: 0,

            updatedSquads: 0,

            lastSync: Date.now()

        };

    }

    async getTournament() {

        const response =
            await HttpClient.get(this.fixturesUrl);

        if (!response.success) {

            console.error(
                "Unable to download tournament",
                response.error
            );

            return {

                name: "World Cup 2026",

                matches: []

            };

        }

        const fixtures =
            OpenFootballMapper.mapFixtures(
                response.data.matches
            );

        fixtures.forEach((match, index) => {

            match.matchNumber = index + 1;

        });

        return {

            name: response.data.name,

            matches: fixtures.map(match =>
                MatchFactory.create(match)
            )

        };

    }

}

window.OpenFootballProvider =
    OpenFootballProvider;