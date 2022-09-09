//// [assertionTypePredicates2.js]
/**
 * @typedef {{ x: number }} A
 */ /**
 * @typedef { A & { y: number } } B
 */ /**
 * @param {A} a
 * @returns { asserts a is B }
 */ var foo = function(a) {
    if (/** @type { B } */ a.y !== 0) throw TypeError();
    return undefined;
};
export var main = function() {
    /** @type { A } */ var a = {
        x: 1
    };
    foo(a);
};
