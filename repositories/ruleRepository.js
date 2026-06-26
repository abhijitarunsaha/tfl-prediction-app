const ruleRepository = {

    cache: {},

    async load() {

        const { data, error } =
            await window.supabaseClient
                .from("v_rule_configuration")
                .select("*");

        if (error)
            throw error;

        this.cache = {};

        data.forEach(r => {

            this.cache[r.rule_name] = r.rule_value;

        });

    },

    get(ruleName) {

        return this.cache[ruleName];

    }

};

window.ruleRepository = ruleRepository;