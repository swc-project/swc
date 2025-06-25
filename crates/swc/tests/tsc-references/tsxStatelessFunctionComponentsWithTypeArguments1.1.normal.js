//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
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
