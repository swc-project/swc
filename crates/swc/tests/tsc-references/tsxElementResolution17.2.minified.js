//// [tsxElementResolution17.tsx]
define([
    "require"
], function(require) {});
//// [file.tsx]
define([
    "require"
], function(require) {});
//// [consumer.tsx]
///<reference path="file.tsx" />
// Should keep s1 and elide s2
define([
    "require",
    "exports",
    "elements1",
    "elements2"
], function(require, exports, _elements1, _elements2) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _elements1.MyElement;
});
