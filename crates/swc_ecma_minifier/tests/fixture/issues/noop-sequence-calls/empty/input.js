(() => {
    function check(callback) {}

    function run() {
        return (
            check(() => {
                throw new Error("UNUSED_CALLBACK_BODY");
            }),
            check(makeCallback()),
            42
        );
    }

    module.exports = run;
})();
