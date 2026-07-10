// Simulate accessing a .js file in a third party package that shouldn't be edited
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
            function(_something_ns) {
                something = _something_ns.default;
            }
        ],
        execute: function() {}
    };
});
