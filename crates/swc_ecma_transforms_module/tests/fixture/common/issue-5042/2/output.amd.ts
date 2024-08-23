define([
    "require"
], function(require) {
    "use strict";
    const foo = require("foo");
    foo.bar = 1;
    foo.bar = 2;
    module.exports = foo;
});
