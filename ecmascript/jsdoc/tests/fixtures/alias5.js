/**
 * Toaster singleton.
 *
 * @class
 */
var Toaster = (function() {
    var instance = null;

    function Toaster() {}

    /**
     * Toast an item.
     *
     * @alias Toaster#toast
     * @param {BreadyThing} item - The item to toast.
     */
    Toaster.prototype.toast = function(item) {};

    /**
     * Clean the toaster.
     *
     * @alias clean
     * @memberof Toaster
     * @instance
     */
    Toaster.prototype.clean = function() {};

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
