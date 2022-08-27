//// [folder/mod1.js]
define([
    "require"
], function(require) {
    "use strict";
    module.exports = {
        x: 12
    };
});
//// [index.js]
define([
    "require"
], function(require) {
    "use strict";
    module.exports = [
        {
            x: 12
        }
    ];
});
