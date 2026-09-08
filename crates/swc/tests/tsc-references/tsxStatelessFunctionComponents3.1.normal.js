//// [file.tsx]
define([
    "require",
    "react"
], function(require, React) {
    "use strict";
    var Foo = function Foo(props) {
        return /*#__PURE__*/ React.createElement("div", null);
    };
    // Should be OK
    var foo = /*#__PURE__*/ React.createElement(Foo, null);
    // Should be OK
    var MainMenu = function MainMenu(props) {
        return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", null, "Main Menu"));
    };
    var App = function App(param) {
        var children = param.children;
        return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(MainMenu, null));
    };
});
