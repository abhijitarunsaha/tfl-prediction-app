(function () {

    const tests = [];

    function registerTest(name, fn) {
        tests.push({ name, fn });
    }

    function assertEqual(actual, expected, message = "") {

        if (actual !== expected) {

            throw new Error(
                `${message}
Expected : ${expected}
Actual   : ${actual}`
            );

        }

    }

    function runRegressionTests() {

        console.clear();

        console.log(
            "%c========================================",
            "color:#0d6efd;font-weight:bold;"
        );

        console.log(
            "%cTFL Prediction Regression Suite v1.0",
            "color:#198754;font-size:16px;font-weight:bold;"
        );

        console.log(
            "%c========================================",
            "color:#0d6efd;font-weight:bold;"
        );

        let passed = 0;

        tests.forEach(test => {

            try {

                test.fn();

                console.log(
                    `%c✔ ${test.name}`,
                    "color:green;font-weight:bold;"
                );

                passed++;

            }

            catch (err) {

                console.group(
                    `%c✖ ${test.name}`,
                    "color:red;font-weight:bold;"
                );

                console.error(err.message);

                console.groupEnd();

            }

        });

        console.log("");

        console.log(
            "%c========================================",
            "color:#0d6efd;font-weight:bold;"
        );

        console.log(
            `%c${passed} / ${tests.length} PASSED`,
            `color:${passed===tests.length?"green":"red"};
             font-size:16px;
             font-weight:bold;`
        );

        console.log(
            "%c========================================",
            "color:#0d6efd;font-weight:bold;"
        );

    }

    window.registerRegressionTest = registerTest;

    window.assertEqual = assertEqual;

    window.runRegressionTests = runRegressionTests;

})();