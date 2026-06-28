const FootballDataProvider = {

    provider: ProviderFactory.create(),

    getProviderInfo() {

        return this.provider.getInfo();

    },

    async getTournament() {

        return this.provider.getTournament();

    },

    async getFixtures() {

        return this.provider.getFixtures();

    },

    async getMatch(matchId) {

        return this.provider.getMatch(matchId);

    },

    async getSquad(teamName) {

       const cacheKey = CacheKeys.squad(teamName);

        const cached = CacheService.get(cacheKey);

        if (cached)
            return cached;

        const squad =
            await this.provider.getSquad(teamName);

        CacheService.set(cacheKey, squad);

        return squad;

    },

    async getTournamentAwards() {

        return this.provider.getTournamentAwards();

    },

    async syncTournament() {

        return await this.provider.syncTournament();

    }

};

window.FootballDataProvider = FootballDataProvider;