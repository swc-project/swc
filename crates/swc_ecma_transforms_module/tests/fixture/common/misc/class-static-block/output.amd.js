define([
    "require"
], function(require) {
    "use strict";
    class foo {
        static{
            this; // should not be replaced by undefined
        }
    }
});
