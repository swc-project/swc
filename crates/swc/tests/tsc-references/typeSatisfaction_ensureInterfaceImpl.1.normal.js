//// [typeSatisfaction_ensureInterfaceImpl.ts]
var car = {
    start: function start() {},
    move: function move(d) {
    // d should be number
    },
    stop: function stop() {}
};
