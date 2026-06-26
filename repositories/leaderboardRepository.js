const leaderboardRepository = {

    async getLeaderboard() {

        const contestants =
            await contestantRepository.getAll();

        return contestants.map(c => ({

            id: c.id,

            name: c.name,

            points:
                c.startingPoints

        }))
        .sort((a,b)=>b.points-a.points);

    }

};

window.leaderboardRepository =
    leaderboardRepository;