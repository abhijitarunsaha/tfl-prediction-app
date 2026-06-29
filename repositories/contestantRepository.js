const ContestantRepository = {

    async getContestants() {

        const data =
            await RepositoryBase.execute(

                supabaseClient

                    .from("contestants")

                    .select(`
                id,
                name,
                baseline_scores (
                    starting_points
                )
            `)

                    .order("name"),

                "Loading contestants"

            );

        if (!data)
            return [];

        return data.map(contestant => ({

            id:
                contestant.id,

            name:
                contestant.name,

            baselineScore:

                Array.isArray(contestant.baseline_scores)

                    ? contestant.baseline_scores[0]?.starting_points ?? 0

                    : contestant.baseline_scores?.starting_points ?? 0

        }));

    },

    async getContestantByName(name) {

        const contestants =
            await this.getContestants();

        return contestants.find(

            contestant =>
                contestant.name === name

        );

    }

};

window.ContestantRepository =
    ContestantRepository;