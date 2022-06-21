define([
    "require",
    "foo"
], function(require, _foo) {
    "use strict";
    for (const elm of _foo.array){
        console.log(elm);
    }
});
