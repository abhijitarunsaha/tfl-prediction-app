const LeaderboardRepository = {

    async getContestants() {

        return ContestantRepository.getContestants();

    },

    async getPredictions() {

        const data =
            await RepositoryBase.execute(

                supabaseClient

                    .from("predictions")

                    .select("*"),

                "Loading predictions"

            );

        return data ?? [];

    }

};

window.LeaderboardRepository =
    LeaderboardRepository;