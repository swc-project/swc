//// [checkJsdocSatisfiesTag5.ts]
//// [/a.js]
/** @typedef {{ move(distance: number): void }} Movable */ var car = /** @satisfies {Movable & Record<string, unknown>} */ {
    start: function start() {},
    move: function move(d) {
    // d should be number
    },
    stop: function stop() {}
};
