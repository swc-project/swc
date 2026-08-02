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
    "elements1"
], function(require, s1) {
    "use strict";
    s1.MyElement;
});
