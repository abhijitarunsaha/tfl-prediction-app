function isUuid(value) {

    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        .test(value);

}

const PredictionRepository = {

    async getPrediction(

        contestantId,

        matchId

    ) {
        if (

            !isUuid(contestantId) ||

            !isUuid(matchId)

        ) {

            return null;

        }

        const data =
            await RepositoryBase.execute(

                supabaseClient

                    .from("predictions")

                    .select("*")

                    .eq("contestant_id", contestantId)

                    .eq("match_id", matchId)

                    .single(),

                "Loading prediction"

            );

        return data;

    },

    async saveMatchPrediction(

        contestantName,

        match,

        prediction

    ) {

        if (!match.databaseId) {

            console.error(

                "Match databaseId missing",

                match

            );

            return null;

        }

        const contestants =

            await ContestantRepository.getContestants();

        const contestant =

            contestants.find(

                c =>

                    c.name === contestantName

            );

        if (!contestant) {

            console.error(

                "Contestant not found",

                contestantName

            );

            return null;

        }

        const payload = {

            contestant_id:
                contestant.id,

            match_id:
                match.databaseId,

            predicted_home_goals:

                prediction.homeGoals === ""

                    ? null

                    : Number(prediction.homeGoals),

            predicted_away_goals:

                prediction.awayGoals === ""

                    ? null

                    : Number(prediction.awayGoals),

            predicted_match_decision:

                this.mapMatchDecision(

                    prediction.matchDecision

                )

        };

        const savedPrediction =

            await RepositoryBase.execute(

                supabaseClient

                    .from("predictions")

                    .upsert(

                        payload,

                        {

                            onConflict:

                                "contestant_id,match_id"

                        }

                    )

                    .select()

                    .single(),

                "Saving prediction"

            );

        if (!savedPrediction) {

            return null;

        }

        console.log("Saving scorers", {
            predictionId: savedPrediction.id,
            scorers: prediction.scorers
        });

        await ScorerPredictionRepository.saveScorers(

            savedPrediction.id,

            prediction.scorers
                .split(",")
                .map(name => name.trim())
                .filter(name => name !== "")

        );

        return savedPrediction;

    },

    async getAllPredictions() {

        return await RepositoryBase.execute(

            supabaseClient

                .from("predictions")

                .select("*"),

            "Loading predictions"

        ) || [];

    },

    async deletePrediction(id) {

        const result =
            await RepositoryBase.execute(

                supabaseClient

                    .from("predictions")

                    .delete()

                    .eq("id", id),

                "Deleting prediction"

            );

        return RepositoryBase.success(result);

    },

    mapMatchDecision(value) {

        switch (value) {

            case "90":

                return "NINETY_MINUTES";

            case "ET":

                return "EXTRA_TIME";

            case "PEN":

                return "PENALTY_SHOOTOUT";

            case "":
                return "NINETY_MINUTES";

            case null:
                return "NINETY_MINUTES";

            case undefined:

                return null;

            default:

                return "NINETY_MINUTES";

        }

    }

};

window.PredictionRepository =
    PredictionRepository;