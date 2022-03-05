var A;
import * as swcHelpers from "@swc/helpers";
!function(A1) {
    var Point = function(x, y) {
        "use strict";
        swcHelpers.classCallCheck(this, Point), this.x = x, this.y = y;
    };
    A1.Origin = {
        x: 0,
        y: 0
    }, A1.Unity = {
        start: new Point(0, 0),
        end: new Point(1, 0)
    };
}(A || (A = {}));
