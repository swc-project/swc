// @allowJs: true
// @checkJs: true
// @outDir: ./out
// @filename: assertionTypePredicates2.js
/**
 * @param {A} a
 * @returns { asserts a is B }
 */ /**
 * @typedef { A & { y: number } } B
 */ /**
 * @param {A} a
 * @returns { asserts a is B }
 */ /**
 * @typedef {{ x: number }} A
 */ /**
 * @param {A} a
 * @returns { asserts a is B }
 */ /**
 * @typedef { A & { y: number } } B
 */ /**
 * @param {A} a
 * @returns { asserts a is B }
 */ const foo = (a)=>{
    if (/** @type { B } */ (a).y !== 0) throw TypeError();
    return undefined;
};
export const main = ()=>{
    /** @type { A } */ const a = {
        x: 1
    };
    foo(a);
};
