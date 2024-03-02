"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _events = /*#__PURE__*/ _interop_require_default(require("events"));
let Template = /*#__PURE__*/ function() {
    "use strict";
    function Template() {
        _class_call_check(this, Template);
    }
    _create_class(Template, [
        {
            key: "events",
            value: function events() {
                return _events.default;
            }
        }
    ]);
    return Template;
}();
console.log(new Template().events());
