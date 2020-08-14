function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 2000);
    });
}

/**
 * Add a number.
 * @param {number} x - The number to add.
 */
async function add(x) {
    var a = resolveAfter2Seconds(20);
    var b = resolveAfter2Seconds(30);
    return x + await a + await b;
}

/**
 * Subtract a number.
 * @param {number} x - The number to subtract.
 */
var subtract = async function subtract(x) {
    var a = resolveAfter2Seconds(20);
    var b = resolveAfter2Seconds(30);
    return await a + await b - x;
}

/**
 * Adder class.
 */
class Adder {
    /**
     * Construct an Adder instance.
     */
    constructor() {}

    /**
     * Add a number.
     * @param {number} x - The number to add.
     */
    async add(x) {}
}
