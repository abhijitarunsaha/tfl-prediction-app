const MatchScoreRepository = {

    async saveMatchScore(score) {

        return RepositoryBase.execute(

            supabaseClient

                .from("match_scores")

                .upsert(

                    score,

                    {

                        onConflict:

                            "contestant_id,match_id"

                    }

                )

                .select()

                .single(),

            "Saving match score"

        );

    },

    async getMatchScores(matchId) {

        return RepositoryBase.execute(

            supabaseClient

                .from("match_scores")

                .select("*")

                .eq(

                    "match_id",

                    matchId

                ),

            "Loading match scores"

        );

    },

    async deleteMatchScores(matchId) {

        return RepositoryBase.execute(

            supabaseClient

                .from("match_scores")

                .delete()

                .eq(

                    "match_id",

                    matchId

                ),

            "Deleting match scores"

        );

    }

};

window.MatchScoreRepository =
    MatchScoreRepository;