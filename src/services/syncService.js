const SyncService = {

    intervalId: null,

    async sync() {

        console.log("Syncing tournament...");

        const fixtures =
            await FootballDataProvider.getFixtures();

        if (!fixtures.length)
            return false;

        localStorage.setItem(

            "tfl-fixtures",

            JSON.stringify(fixtures)

        );

        localStorage.setItem(

            "tfl-last-sync",

            new Date().toISOString()

        );

        return true;

    },

    start() {

        if (this.intervalId)
            return;

        this.intervalId = setInterval(

            () => this.sync(),

            180000

        );

    },

    async loadTournament() {

    const cached =
        localStorage.getItem("tfl-fixtures");

    if (cached)
        return JSON.parse(cached);

    const fixtures =
        await FootballDataProvider.getFixtures();

    localStorage.setItem(

        "tfl-fixtures",

        JSON.stringify(fixtures)

    );

    return fixtures;

}

};

window.SyncService = SyncService;