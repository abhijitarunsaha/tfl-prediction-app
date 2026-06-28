const ContestantRepository = {

    async getAll() {

        const { data, error } = await supabaseClient

            .from("contestants")

            .select(`
                id,
                name,
                baseline_scores (
                    starting_points
                )
            `)

            .order("name");

        if (error) {

            console.error(
                "Unable to load contestants",
                error
            );

            return [];

        }

        return data.map(contestant => ({

            id: contestant.id,

            name: contestant.name,

            startingPoints:
                contestant.baseline_scores?.starting_points ?? 0

        }));

    }

};

window.ContestantRepository =
    ContestantRepository;