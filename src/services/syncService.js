const SyncService = {

    intervalId: null,

    async sync() {

        try {

            console.log("Syncing tournament...");

            const fixtures =
                await FootballDataProvider.getFixtures();

            await MatchRepository.upsertFixtures(fixtures);

            await MatchRepository.mapDatabaseIds(fixtures);

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

            await ProviderSyncRepository.update({

                lastSync:
                    new Date().toISOString(),

                version:
                    FootballDataProvider.getProviderInfo
                        ? await FootballDataProvider.getProviderInfo()
                        : "OpenFootball",

                updatedMatches:
                    fixtures.length,

                lastStatus:
                    "SUCCESS",

                lastError:
                    null

            });

            return true;

        }

        catch (error) {

            console.error(error);

            await ProviderSyncRepository.update({

                lastSync:
                    null,

                version:
                    "OpenFootball",

                updatedMatches:
                    0,

                lastStatus:
                    "FAILED",

                lastError:
                    error.message

            });

            return false;

        }

    },

    async refreshLastSync() {

        const value =

            localStorage.getItem(
                "tfl-last-sync"
            );

        document
            .getElementById("last-sync")
            .textContent =

            value
                ? formatDate(value)
                : "Never";

    },

    start() {

        if (this.intervalId)
            return;

        this.intervalId = setInterval(

            () => this.sync(),

            180000

        );

    },

    async refreshLastSync() {

        const lastSync =

            localStorage.getItem(
                "tfl-last-sync"
            );

        document
            .querySelector("#last-sync")
            .textContent =

            lastSync
                ? formatDate(lastSync)
                : "Never";

    },

    async loadTournament() {

        const cached =
            localStorage.getItem("tfl-fixtures");

        if (cached) {
            const fixtures =
                JSON.parse(cached);

            await MatchRepository.mapDatabaseIds(fixtures);

            return fixtures;
        }


        const fixtures =
            await FootballDataProvider.getFixtures();

        await MatchRepository.upsertFixtures(fixtures);

        await MatchRepository.mapDatabaseIds(fixtures);

        localStorage.setItem(

            "tfl-fixtures",

            JSON.stringify(fixtures)

        );

        return fixtures;

    }

};

window.SyncService = SyncService;