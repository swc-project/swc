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
    var Foo = function(props) {
        return <div/>;
    };
    // Should be OK
    var foo = <Foo/>;
    // Should be OK
    var MainMenu = function(props) {
        return <div>
    <h3>Main Menu</h3>
</div>;
    };
    var App = function(param) {
        var children = param.children;
        return <div>
        <MainMenu/>
	</div>;
    };
});
