const predictionRepository = {

    async getPrediction(matchId, contestantId) {
        const { data } =
            await window.supabaseClient
                .from("predictions")
                .select("*")
                .eq("match_id", matchId)
                .eq("contestant_id", contestantId)
                .single();
    },

    async getPredictions(matchId) { },

    async savePrediction(prediction) {
        await window.supabaseClient
            .from("predictions")
            .upsert(prediction, {
                onConflict: "match_id,contestant_id"
            });
    },


    async copyPrediction(matchId, fromId, toId) {

        const prediction =
            await this.getPrediction(matchId, fromId);

        prediction.contestant_id = toId;

        prediction.copied_from = fromId;

        delete prediction.id;

        return this.savePrediction(prediction);

    }


};

window.predictionRepository = predictionRepository;