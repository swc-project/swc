import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
