/**
 * Increment a number by 1.
 *
 * @param {number} n - The number to increment.
 */
var increment = n => n + 1;

/**
 * Print a value to the console.
 */
var print = (/** @type {*} */ val) => console.log(val);

/**
 * Create a class with a `name` property.
 */
var createClass = () => class {
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
}
