define([
    "foo"
], function(_foo) {
    "use strict";
    for (const elm of _foo.array){
        console.log(elm);
    }
});
