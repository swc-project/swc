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
    // OK
    function Baz(key1, value) {
        var a0 = <ComponentWithTwoAttributes key1={key1} value={value}/>;
        var a1 = <ComponentWithTwoAttributes {...{
            key1: key1,
            value: value
        }} key="Component"/>;
    }
    // OK
    function createLink(func) {
        var o = <Link func={func}/>;
    }
    function createLink1(func) {
        var o = <Link func={func}/>;
    }
    // OK
    var i = <InferParamComponent values={[
        1,
        2,
        3,
        4
    ]} selectHandler={function(val) {}}/>;
});
