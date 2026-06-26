const contestantRepository = {

    async getAll() {

        const { data, error } =
            await window.supabaseClient
                .from("contestants")
                .select(`
                    id,
                    name,
                    baseline_scores(starting_points)
                `)
                .order("name");

        if (error)
            throw error;

        return data.map(c => ({

            id: c.id,

            name: c.name,

            startingPoints:
                c.baseline_scores?.starting_points ?? 0

        }));
    }

};

window.contestantRepository =
    contestantRepository;