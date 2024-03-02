"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Login;
    }
});
var _store = require("./store");
let Login = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(Login, _React_Component);
    var _super = _create_super(Login);
    function Login() {
        _class_call_check(this, Login);
        return _super.apply(this, arguments);
    }
    _create_class(Login, [
        {
            key: "getForm",
            value: function getForm() {
                return (0, _store.getForm)().toJS();
            }
        }
    ]);
    return Login;
}(React.Component);
