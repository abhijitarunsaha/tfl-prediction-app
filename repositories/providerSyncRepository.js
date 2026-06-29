const ProviderSyncRepository = {

    async get() {

        const data =
            await RepositoryBase.execute(

                supabaseClient

                    .from("provider_sync")

                    .select("*")

                    .eq("provider", "OpenFootball")

                    .single(),

                "Loading provider sync"

            );

        return data;

    },

    async update(syncInfo) {

        const payload = {

            last_sync:
                syncInfo.lastSync,

            version:
                syncInfo.version,

            updated_matches:
                syncInfo.updatedMatches,

            last_status:
                syncInfo.lastStatus,

            last_error:
                syncInfo.lastError

        };

        const result =
            await RepositoryBase.execute(

                supabaseClient

                    .from("provider_sync")

                    .update(payload)

                    .eq("provider", "OpenFootball")

                    .select(),

                "Updating provider sync"

            );

        return RepositoryBase.success(result);

    }

};

window.ProviderSyncRepository =
    ProviderSyncRepository;