import * as swcHelpers from "@swc/helpers";
var FetchUser = function(_Component) {
    swcHelpers.inherits(FetchUser, _Component);
    var _super = swcHelpers.createSuper(FetchUser);
    function FetchUser() {
        return swcHelpers.classCallCheck(this, FetchUser), _super.apply(this, arguments);
    }
    return FetchUser.prototype.render = function() {
        return this.state ? this.props.children(this.state.result) : null;
    }, FetchUser;
}(require("react").Component);
