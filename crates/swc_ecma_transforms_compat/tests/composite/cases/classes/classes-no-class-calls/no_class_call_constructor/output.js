let A = function A() {
    "use strict";
    console.log('a');
};
let B = /*#__PURE__*/ function() {
    "use strict";
    function B() {}
    _create_class(B, [
        {
            key: "b",
            value: function b() {
                console.log('b');
            }
        }
    ]);
    return B;
}();
