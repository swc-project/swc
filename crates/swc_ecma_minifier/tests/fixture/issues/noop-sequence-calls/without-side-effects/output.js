(()=>{
    function check(callback) {}
    module.exports = function() {
        return check(()=>{
            throw Error("RETAINED_CALLBACK_BODY");
        }), check(), 42;
    };
})();
