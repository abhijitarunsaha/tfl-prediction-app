const ProviderFactory = {

    create() {

        const provider = Config.provider.name;

        switch (provider) {

            case "openFootball":
                return new OpenFootballProvider();

            case "mock":
                return new MockProvider();

            default:
                throw new Error(
                    `Unknown provider: ${provider}`
                );

        }

    }

};

window.ProviderFactory = ProviderFactory;