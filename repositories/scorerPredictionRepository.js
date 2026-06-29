const ScorerPredictionRepository = {

    async saveScorers(predictionId, scorers) {

        console.log("Entered saveScorers", {
            predictionId,
            scorers
        });

        if (!predictionId)
            return;

        await RepositoryBase.execute(

            supabaseClient
                .from("prediction_scorers")
                .delete()
                .eq("prediction_id", predictionId),

            "Deleting scorer predictions failed"

        );

        const rows = scorers
            .filter(Boolean)
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .map(name => ({

                prediction_id: predictionId,

                player_name: name.trim()

            }));

        if (!rows.length)
            return;

        await RepositoryBase.execute(

            supabaseClient
                .from("prediction_scorers")
                .insert(rows),

            "Saving scorer predictions failed"

        );

    },

    async getAllPredictionScorers() {

        return RepositoryBase.execute(

            supabaseClient
                .from("prediction_scorers")
                .select("*"),

            "Loading scorer predictions failed"

        );

    }

};

window.ScorerPredictionRepository =
    ScorerPredictionRepository;