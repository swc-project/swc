System.register([
    "lodash/dist/something.js"
], function(_export, _context) {
    "use strict";
    var something;
    function displayC() {
        something();
        return 'Display C';
    }
    _export("displayC", displayC);
    return {
        setters: [
            function(_something) {
                something = _something.default;
            }
        ],
        execute: function() {}
    };
});
