//// [file.tsx]
define([
    "require",
    "exports",
    "react"
], function(require, exports, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    // Error
    function Bar(arg) {
        var a1 = <ComponentSpecific1 {...arg} ignore-prop={10}/>;
    }
    // Error
    function Baz(arg) {
        var a0 = <ComponentSpecific1 {...arg}/>;
    }
    // Error
    function createLink(func) {
        var o = <Link func={func}/>;
    }
    // Error
    var i = <InferParamComponent values={[
        1,
        2,
        3,
        4
    ]} selectHandler={function(val) {}}/>;
});
