function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// N and M have the same name, same accessibility, same optionality, and N is a subtype of M
// foo properties are valid, bar properties cause errors in the derived class declarations
var NotOptional;
(function(NotOptional) {
    var B = function B() {
        "use strict";
        _classCallCheck(this, B);
    };
    var B2 = function B2() {
        "use strict";
        _classCallCheck(this, B2);
    };
    var B3 = function B3() {
        "use strict";
        _classCallCheck(this, B3);
    };
})(NotOptional || (NotOptional = {
}));
// same cases as above but with optional
var Optional;
(function(Optional) {
    var B = function B() {
        "use strict";
        _classCallCheck(this, B);
    };
    var B2 = function B2() {
        "use strict";
        _classCallCheck(this, B2);
    };
    var B3 = function B3() {
        "use strict";
        _classCallCheck(this, B3);
    };
})(Optional || (Optional = {
}));
