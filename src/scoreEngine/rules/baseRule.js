class BaseRule {

    constructor(ruleName) {
        this.ruleName = ruleName;
    }

    success(points, details = {}) {

        return {

            rule: this.ruleName,
            matched: true,
            points,
            details

        };

    }

    failure(points = 0, details = {}) {

        return {

            rule: this.ruleName,
            matched: false,
            points,
            details

        };

    }

}

window.BaseRule = BaseRule;