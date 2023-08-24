//// [decls.d.ts]
//// [a.js]
/**
 * @param {string} first
 */ !/**
 * @param {...string} strings
 */ function() {
    arguments;
}(1, 2, 3) // oh no
;
