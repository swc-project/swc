//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
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
