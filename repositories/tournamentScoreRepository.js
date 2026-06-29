const TournamentScoreRepository = {

    async saveTournamentScore(score) {

        return RepositoryBase.execute(

            supabaseClient

                .from("tournament_scores")

                .upsert(

                    score,

                    {

                        onConflict:

                            "contestant_id"

                    }

                )

                .select()

                .single(),

            "Saving tournament score"

        );

    },

    async getLeaderboard() {

        return RepositoryBase.execute(

            supabaseClient

                .from("tournament_scores")

                .select("*")

                .order(

                    "total_points",

                    {

                        ascending: false

                    }

                ),

            "Loading leaderboard"

        );

    },

    async clearLeaderboard() {

        return RepositoryBase.execute(

            supabaseClient

                .from("tournament_scores")

                .delete()

                .neq(

                    "contestant_id",

                    ""

                ),

            "Clearing leaderboard"

        );

    }

};

window.TournamentScoreRepository =
    TournamentScoreRepository;