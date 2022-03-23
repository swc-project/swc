import * as swcHelpers from "@swc/helpers";
//@filename: file2.tsx
// Should not elide React import
import * as React from "react";
export var MyClass = function MyClass() {
    "use strict";
    swcHelpers.classCallCheck(this, MyClass);
};
/*#__PURE__*/ React.createElement(MyClass, null);
