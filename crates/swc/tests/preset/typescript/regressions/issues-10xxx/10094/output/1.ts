import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_metadata } from "@swc/helpers/_/_ts_metadata";
var NegativeStatus = /*#__PURE__*/ function(NegativeStatus) {
    NegativeStatus[NegativeStatus["open"] = -1] = "open";
    NegativeStatus[NegativeStatus["close"] = 3] = "close";
    return NegativeStatus;
}(NegativeStatus || {});
var Status = /*#__PURE__*/ function(Status) {
    Status[Status["open"] = 1] = "open";
    Status[Status["close"] = 2] = "close";
    return Status;
}(Status || {});
function prop() {}
class A {
    negativeStatus;
    status;
}
_ts_decorate([
    prop(),
    _ts_metadata("design:type", Number)
], A.prototype, "negativeStatus", void 0);
_ts_decorate([
    prop(),
    _ts_metadata("design:type", Number)
], A.prototype, "status", void 0);
