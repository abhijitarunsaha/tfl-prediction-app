const RuleRepository = {

    async getRules() {

        const data =
            await RepositoryBase.execute(

                supabaseClient

                    .from("rule_configuration")

                    .select("*")

                    .order("rule_name"),

                "Loading rules"

            );

        return data ?? [];

    },

    async getRule(name) {

        const data =
            await RepositoryBase.execute(

                supabaseClient

                    .from("rule_configuration")

                    .select("*")

                    .eq("rule_name", name)

                    .single(),

                "Loading rule"

            );

        return data;

    }

};

window.RuleRepository =
    RuleRepository;