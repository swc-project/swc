//// [tsxElementResolution17.tsx]
define([
    "require"
], function(require) {});
//// [file.tsx]
define([
    "require"
], function(require) {});
//// [consumer.tsx]
define([
    "require",
    "elements1"
], function(require, s1) {
    s1.MyElement;
});
