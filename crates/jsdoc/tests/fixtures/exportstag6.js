define(function(
/**
 * A module representing a shirt.
 * @exports my/shirt
 * @version 1.0
 */
shirtModule) {
    /** A property of the module. */
    shirtModule.color = 'black';

    /** @constructor */
    shirtModule.Turtleneck = function(size) {
        /** A property of the class. */
        this.size = size;
    };

    return shirtModule;
});
