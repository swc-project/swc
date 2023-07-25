"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "PositionRender", {
    enumerable: !0,
    get: function() {
        return PositionRender;
    }
});
var positions = {
    top: 1,
    left: 2,
    right: 3,
    bottom: 4
}, rtlPositions = {
    top: 1,
    right: 2,
    left: 3,
    bottom: 4
};
function PositionRender(param) {
    var display = ("fe-fe-fe" === param.isRtl ? rtlPositions : positions)[param.position];
    return React.createElement("h1", null, "PositionRender: ", display);
}
