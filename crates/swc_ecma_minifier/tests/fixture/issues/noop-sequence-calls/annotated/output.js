module.exports = {
    run: function(value) {
        let predicateCalls = 0;
        return ()=>{
            throw predicateCalls++, Error("ANNOTATED_CALLBACK_BODY");
        }, {
            value,
            predicateCalls: 0
        };
    },
    runFactory: function() {
        var callback;
        let factoryCalls = 0, predicateCalls = 0;
        return factoryCalls++, callback = ()=>predicateCalls++, {
            factoryCalls,
            predicateCalls
        };
    }
};
