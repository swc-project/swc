define(function() {
    'use strict';
    var bar = function() {};
    /** @exports Foo */
    var Foo = Object.create(
        /** @lends module:Foo.prototype */
        {
            /** This should be in the Foo module doc. */
            bar : function() {}
        }
    );
    return Foo;
});
