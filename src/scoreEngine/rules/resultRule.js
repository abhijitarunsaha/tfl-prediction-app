const ResultRule = {

    calculate(predicted, actual) {

        if (predicted === actual)

            return ruleRepository.get("MATCH_RESULT_CORRECT");

        return ruleRepository.get("MATCH_RESULT_WRONG");

    }

};

window.ResultRule = ResultRule;