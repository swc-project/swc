(()=>{
    function check(callback) {}
    module.exports = {
        run: function(value) {
            return {
                value,
                predicateCalls: 0
            };
        },
        runFactory: function() {
            let factoryCalls = 0, predicateCalls = 0;
            return check((factoryCalls++, ()=>predicateCalls++)), {
                factoryCalls,
                predicateCalls
            };
        }
    };
})();
