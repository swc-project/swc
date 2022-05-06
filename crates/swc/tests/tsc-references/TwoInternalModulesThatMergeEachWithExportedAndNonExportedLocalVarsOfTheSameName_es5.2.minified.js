import * as swcHelpers from "@swc/helpers";
!function(A1) {
    (A1.Utils || (A1.Utils = {})).mirror = function(p) {
        return {
            x: p.y,
            y: p.x
        };
    }, A1.Origin = {
        x: 0,
        y: 0
    };
}(A || (A = {})), function(A2) {
    var Utils, Plane;
    Utils = A2.Utils || (A2.Utils = {}), Plane = function(tl, br) {
        "use strict";
        swcHelpers.classCallCheck(this, Plane), this.tl = tl, this.br = br;
    }, Utils.Plane = Plane;
}(A || (A = {}));
var A, o, o = (A.Origin, A.Utils.mirror(o));
new A.Utils.Plane(o, {
    x: 1,
    y: 1
});
