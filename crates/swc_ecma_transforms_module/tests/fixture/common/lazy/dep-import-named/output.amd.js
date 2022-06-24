define([
    "foo"
], function(_foo) {
    "use strict";
    function use() {
        console.log(_foo.foo);
    }
});
