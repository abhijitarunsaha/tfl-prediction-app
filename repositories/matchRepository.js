const MatchRepository = {

    async getMatches() {

        const data =
            await RepositoryBase.execute(

                supabaseClient

                    .from("matches")

                    .select("*")

                    .order("match_number"),

                "Loading matches"

            );

        return data ?? [];

    },

    async getMatch(id) {

        const data =
            await RepositoryBase.execute(

                supabaseClient

                    .from("matches")

                    .select("*")

                    .eq("id", id)

                    .single(),

                "Loading match"

            );

        return data;

    },

    async replaceMatches(matches) {

        const result =
            await RepositoryBase.execute(

                supabaseClient

                    .from("matches")

                    .upsert(matches),

                "Replacing matches"

            );

        return RepositoryBase.success(result);

    },

    async upsertFixtures(fixtures) {

        const payload = fixtures.map(match => ({

            match_number:
                match.matchNumber,

            stage:
                this.mapStage(match.stage),

            kickoff:
                match.kickoff,

            home_team:
                match.home,

            away_team:
                match.away,

            status:
                "SCHEDULED"

        }));

        const result =

            await RepositoryBase.execute(

                supabaseClient

                    .from("matches")

                    .upsert(

                        payload,

                        {

                            onConflict:

                                "match_number"

                        }

                    )

                    .select(),

                "Upserting fixtures"

            );

        return RepositoryBase.success(result);

    },

    mapStage(stage) {

        switch (stage) {

            case "GROUP":

                return "GROUP";

            case "ROUND_OF_32":

                return "ROUND_OF_32";

            case "ROUND_OF_16":

                return "ROUND_OF_16";

            case "QUARTER_FINAL":

                return "QUARTER_FINAL";

            case "SEMI_FINAL":

                return "SEMI_FINAL";

            case "FINAL":

                return "FINAL";

            default:

                return "GROUP";

        }

    },

    async updateMatch(id, values) {

        const result =
            await RepositoryBase.execute(

                supabaseClient

                    .from("matches")

                    .update(values)

                    .eq("id", id),

                "Updating match"

            );

        return RepositoryBase.success(result);

    },

    async mapDatabaseIds(matches) {

        const dbMatches =

            await RepositoryBase.execute(

                supabaseClient

                    .from("matches")

                    .select("id, match_number"),

                "Loading match ids"

            );

        if (!dbMatches)
            return matches;

        const byNumber =

            new Map(

                dbMatches.map(match => [

                    match.match_number,

                    match.id

                ])

            );

        matches.forEach(match => {

            match.databaseId =

                byNumber.get(

                    match.matchNumber

                ) ?? null;

        });

        return matches;

    }

};

window.MatchRepository =
    MatchRepository;