import * as swcHelpers from "@swc/helpers";
var Base = function Base(a) {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Generic = function Generic() {
    "use strict";
    swcHelpers.classCallCheck(this, Generic);
};
var Derived = function Derived(host) {
    "use strict";
    swcHelpers.classCallCheck(this, Derived);
    this.host = host;
    var self = this;
    this.n = 12;
};
