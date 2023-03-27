//// [tsxElementResolution17.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [consumer.tsx]
///<reference path="file.tsx" />
// Should keep s1 and elide s2
define([
    "require",
    "exports",
    "elements1",
    "elements2"
], function(require, exports, _elements_1, _elements_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    /*#__PURE__*/ React.createElement(_elements_1.MyElement, null);
});
