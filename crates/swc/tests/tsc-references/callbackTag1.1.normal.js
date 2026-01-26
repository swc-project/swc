//// [cb.js]
/** @callback Sid
 * @param {string} s
 * @returns {string} What were you expecting
 */ var x = 1;
/** @type {Sid} smallId */ var sid = function sid(s) {
    return s + "!";
};
/** @type {NoReturn} */ var noreturn = function noreturn(obj) {
    return void obj.title /**
 * @callback NoReturn
 * @param {{ e: number, m: number, title: string }} s - Knee deep, shores, etc
 */ ;
};
