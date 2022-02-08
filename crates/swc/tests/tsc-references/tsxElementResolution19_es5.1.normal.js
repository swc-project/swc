function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
//@filename: file2.tsx
// Should not elide React import
import * as React from 'react';
export var MyClass = function MyClass() {
    "use strict";
    _classCallCheck(this, MyClass);
};
/*#__PURE__*/ React.createElement(MyClass, null);
