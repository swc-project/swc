(()=>{
    function check(callback) {}
    function run() {
        return check(()=>{
            throw Error("RETAINED_CALLBACK_BODY");
        }), check(), 42;
    }
    module.exports = run;
})();
