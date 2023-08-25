//// [assertionTypePredicates2.js]
/**
 * @typedef {{ x: number }} A
 */ /**
 * @typedef { A & { y: number } } B
 */ /**
 * @param {A} a
 * @returns { asserts a is B }
 */ var foo = function(a) {
    if (0 !== /** @type { B } */ a.y) throw TypeError();
};
export var main = function() {
    foo({
        x: 1
    });
};
