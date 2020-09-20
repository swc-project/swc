/** @protected {number} */
var uidCounter = 1;

/**
 * Unique ID generator.
 * @constructor
 */
function UidGenerator() {}

/** Generate a unique ID. */
UidGenerator.prototype.generate = function generate() {
    return uidCounter++;
};
