import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var FetchUser = function(_Component) {
    "use strict";
    _inherits(FetchUser, _Component);
    var _super = _create_super(FetchUser);
    function FetchUser() {
        return _class_call_check(this, FetchUser), _super.apply(this, arguments);
    }
    return FetchUser.prototype.render = function() {
        return this.state ? this.props.children(this.state.result) : null;
    }, FetchUser;
}(require("react").Component);
