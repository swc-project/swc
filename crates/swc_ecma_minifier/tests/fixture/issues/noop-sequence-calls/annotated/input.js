(() => {
    /*#__NO_SIDE_EFFECTS__*/
    function annotatedLeaf(callback) {
        /*#__PURE__*/ callback();
    }

    function check(callback) {
        annotatedLeaf(() => callback());
    }

    function run(value) {
        let predicateCalls = 0;
        check(() => {
            predicateCalls++;
            throw new Error("ANNOTATED_CALLBACK_BODY");
        });
        return { value, predicateCalls };
    }

    function runFactory() {
        let factoryCalls = 0;
        let predicateCalls = 0;
        function makeCallback() {
            factoryCalls++;
            return () => predicateCalls++;
        }
        check(makeCallback());
        return { factoryCalls, predicateCalls };
    }

    module.exports = { run, runFactory };
})();
