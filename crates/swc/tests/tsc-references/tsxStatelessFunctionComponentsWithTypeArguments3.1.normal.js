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
    function Baz(arg1, arg2) {
        var a0 = <OverloadComponent {...arg1} a="hello" ignore-prop/>;
        var a1 = <OverloadComponent {...arg2} ignore-pro="hello world"/>;
        var a2 = <OverloadComponent {...arg2}/>;
        var a3 = <OverloadComponent {...arg1} ignore-prop/>;
        var a4 = <OverloadComponent/>;
        var a5 = <OverloadComponent {...arg2} ignore-prop="hello" {...arg1}/>;
        var a6 = <OverloadComponent {...arg2} ignore-prop {...arg1}/>;
    }
    function createLink(func) {
        var o = <Link func={func}/>;
        var o1 = <Link func={function(a, b) {}}/>;
    }
});
