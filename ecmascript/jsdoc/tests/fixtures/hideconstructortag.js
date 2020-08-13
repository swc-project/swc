/**
 * @classdesc Toaster singleton.
 * @class
 * @hideconstructor
 */
var Toaster = (function() {
    var instance = null;

    function Toaster() {}

    /**
     * Toast an item.
     *
     * @alias toast
     * @memberof Toaster
     * @instance
     * @param {BreadyThing} item - The item to toast.
     * @return {Toast} A toasted bready thing.
     */
    Toaster.prototype.toast = function(item) {};

    return {
        /**
         * Get the Toaster instance.
         *
         * @alias Toaster.getInstance
         * @returns {Toaster} The Toaster instance.
         */
        getInstance: function() {
            if (instance === null) {
                instance = new Toaster();
                delete instance.constructor;
            }

            return instance;
        }
    };
})();

/**
 * Waffle iron singleton.
 */
class WaffleIron {
    #instance = null;

    /**
     * Create the waffle iron.
     *
     * @hideconstructor
     */
    constructor() {
        if (this.#instance) {
            return this.#instance;
        }

        /**
         * Cook a waffle.
         *
         * @param {Batter} batter - The waffle batter.
         * @return {Waffle} The cooked waffle.
         */
        this.cook = function(batter) {};

        this.#instance = this;
    }

    /**
     * Get the WaffleIron instance.
     *
     * @return {WaffleIron} The WaffleIron instance.
     */
    getInstance() {
        return new WaffleIron();
    }
}
