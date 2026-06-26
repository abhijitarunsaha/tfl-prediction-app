const RuleEngine = {

    async initialize() {

        await ruleRepository.load();

    }

};

window.RuleEngine = RuleEngine;