//// [checkJsdocSatisfiesTag6.ts]
//// [/a.js]
/**
 * @typedef {Object} Point2d
 * @property {number} x
 * @property {number} y
 */ // Undesirable behavior today with type annotation
var a = /** @satisfies {Partial<Point2d>} */ {
    x: 10
};
// Should OK
console.log(a.x.toFixed());
// Should error
var p = a.y;
