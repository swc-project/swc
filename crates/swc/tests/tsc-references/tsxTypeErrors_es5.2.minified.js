import * as swcHelpers from "@swc/helpers";
React.createElement("div", {
    id: "foo"
}), React.createElement("img", {
    srce: "foo.jpg"
}), React.createElement("div", {
    id: {
        oops: 100
    }
}), React.createElement("imag", {
    src: "bar.jpg"
});
var MyClass = function() {
    "use strict";
    swcHelpers.classCallCheck(this, MyClass);
};
React.createElement(MyClass, {
    reqd: !0
}), React.createElement(MyClass, {
    pt: {
        x: 4,
        y: "oops"
    }
});
