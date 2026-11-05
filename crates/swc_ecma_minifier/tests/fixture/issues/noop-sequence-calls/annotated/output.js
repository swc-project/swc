(()=>{
    module.exports = {
        run: function(value) {
            return {
                value,
                predicateCalls: 0
            };
        },
        runFactory: function() {
            let factoryCalls = 0, predicateCalls = 0;
            return factoryCalls++, {
                factoryCalls,
                predicateCalls
            };
        }
    };
})();
