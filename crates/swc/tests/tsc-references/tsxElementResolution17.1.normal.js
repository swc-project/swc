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
    "elements1"
], function(require, s1) {
    "use strict";
    /*#__PURE__*/ React.createElement(s1.MyElement, null);
});
