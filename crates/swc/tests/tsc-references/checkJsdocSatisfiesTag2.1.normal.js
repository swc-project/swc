//// [checkJsdocSatisfiesTag2.ts]
//// [/a.js]
/** @typedef {Object.<string, (n: number) => boolean>} Predicates */ var p = /** @satisfies {Predicates} */ {
    isEven: function(n) {
        return n % 2 === 0;
    },
    isOdd: function(n) {
        return n % 2 === 1;
    }
};
