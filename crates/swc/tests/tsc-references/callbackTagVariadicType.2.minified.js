//// [callbackTagVariadicType.js]
/**
 * @callback Foo
 * @param {...string} args
 * @returns {number}
 */ /** @type {Foo} */ export var x = function() {
    return 1;
};
x("a", "b");
