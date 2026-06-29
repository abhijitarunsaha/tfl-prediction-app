const PointBreakdownRepository = {

    async saveBreakdown(payload) {

        return RepositoryBase.execute(

            supabaseClient

                .from("point_breakdowns")

                .upsert(

                    payload,

                    {

                        onConflict:

                            "prediction_id"

                    }

                )

                .select()

                .single(),

            "Saving point breakdown"

        );

    },

    async getBreakdown(

        predictionId

    ) {

        return RepositoryBase.execute(

            supabaseClient

                .from("point_breakdowns")

                .select("*")

                .eq(

                    "prediction_id",

                    predictionId

                )

                .single(),

            "Loading point breakdown"

        );

    },

    async getAll() {

        return RepositoryBase.execute(

            supabaseClient

                .from("point_breakdowns")

                .select(`

                total_points,

                prediction_id,

                predictions(

                    contestant_id

                )

            `),

            "Loading point breakdowns"

        );

    }

};

window.PointBreakdownRepository =
    PointBreakdownRepository;