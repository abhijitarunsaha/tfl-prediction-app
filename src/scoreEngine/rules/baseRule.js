class BaseRule {

    constructor(name) {
        this.name = name;
    }

    success(points, details = {}) {

        return {
            rule: this.name,
            matched: true,
            points,
            details
        };

    }

    failure(points = 0, details = {}) {

        return {
            rule: this.name,
            matched: false,
            points,
            details
        };

    }

    /*
     * Convenience wrapper for rules that deduct points.
     */
    penalty(points, details = {}) {

        return {
            rule: this.name,
            matched: false,
            points: -Math.abs(points),
            details
        };

    }

}

window.BaseRule = BaseRule;