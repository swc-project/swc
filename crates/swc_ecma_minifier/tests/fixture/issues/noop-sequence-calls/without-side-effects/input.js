(() => {
    function check(callback) {}
    function run() {
        return (
            check(() => {
                throw new Error("RETAINED_CALLBACK_BODY");
            }),
            check(),
            42
        );
    }
    module.exports = run;
})();
