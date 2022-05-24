import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
//@filename: file2.tsx
// Should not elide React import
import * as React from "react";
export var MyClass = function MyClass() {
    "use strict";
    _class_call_check(this, MyClass);
};
/*#__PURE__*/ React.createElement(MyClass, null);
