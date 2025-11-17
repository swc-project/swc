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
define([
    "require",
    "exports",
    "elements1"
], function(require, exports, _elements1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    /*#__PURE__*/ React.createElement(_elements1.MyElement, null);
});
