//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
    function createComponent(arg) {
        var a1 = <Component {...arg}/>;
        var a2 = <Component {...arg} prop1/>;
    }
    function Bar(arg) {
        var a1 = <ComponentSpecific {...arg} ignore-prop="hi"/>; // U is number
        var a2 = <ComponentSpecific1 {...arg} ignore-prop={10}/>; // U is number
        var a3 = <ComponentSpecific {...arg} prop="hello"/>; // U is "hello"
        var a4 = <ComponentSpecific {...arg} prop1="hello"/>; // U is "hello"
    }
});
