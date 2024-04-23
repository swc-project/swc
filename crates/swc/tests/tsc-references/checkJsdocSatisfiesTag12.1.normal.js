//// [checkJsdocSatisfiesTag12.ts]
//// [/a.js]
/**
 * @typedef {Object} T1
 * @property {number} a
 */ /**
 * @typedef {Object} T2
 * @property {string} a
 */ /**
 * @typedef {Object} T3
 * @property {"a" | "b"} a
 */ /**
 * @satisfies {T1}
 */ var t1 = {
    a: 1
};
/**
 * @satisfies {T1}
 */ var t2 = {
    a: 1,
    b: 1
};
/**
 * @satisfies {T1}
 */ var t3 = {};
/**
 * @satisfies {Array.<number, number>}
 */ var t4 = [
    1,
    2
];
/**
 * @satisfies {T2}
 */ var t5 = {
    a: 'test'
};
/**
 * @satisfies {T2}
 */ var t6 = {
    a: 'test',
    b: 'test'
};
/**
 * @satisfies {T3}
 */ var t7 = {
    a: "a"
};
/** @satisfies {string} */ var t8 = 1;
