import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
import { action, observable } from "mobx";
var Counter = /*#__PURE__*/ function() {
    "use strict";
    function Counter() {
        _class_call_check(this, Counter);
        this.state = 0;
    }
    var _proto = Counter.prototype;
    _proto.add = function add() {
        throw new Error("Not implemented");
    };
    _proto.sub = function sub() {
        throw new Error("Not implemented");
    };
    return Counter;
}();
_ts_decorate([
    observable
], Counter.prototype, "state", void 0);
_ts_decorate([
    action
], Counter.prototype, "add");
_ts_decorate([
    action.bound
], Counter.prototype, "sub");
export var TwoCounter = /*#__PURE__*/ function(Counter) {
    "use strict";
    _inherits(TwoCounter, Counter);
    var _super = _create_super(TwoCounter);
    function TwoCounter() {
        _class_call_check(this, TwoCounter);
        return _super.apply(this, arguments);
    }
    var _proto = TwoCounter.prototype;
    _proto.add = function add() {
        this.state += 2;
    };
    _proto.sub = function sub() {
        this.state -= 2;
    };
    return TwoCounter;
}(Counter);
_ts_decorate([
    action
], TwoCounter.prototype, "add");
_ts_decorate([
    action.bound
], TwoCounter.prototype, "sub");
