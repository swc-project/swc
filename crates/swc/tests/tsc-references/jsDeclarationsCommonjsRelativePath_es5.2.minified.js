"use strict";
"use strict";
var Thing = function() {
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Thing);
};
module.exports = {
    Thing: Thing
};
var Thing = require("./thing").Thing;
module.exports = {
    Thing: Thing
};
