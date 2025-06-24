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
    Object.defineProperty(exports, "MainButton", {
        enumerable: true,
        get: function() {
            return MainButton;
        }
    });
    var obj0 = {
        to: "world"
    };
    var obj1 = {
        children: "hi",
        to: "boo"
    };
    var obj2 = {
        onClick: function() {}
    };
    var obj3;
    function MainButton(props) {
        var linkProps = props;
        if (linkProps.to) {
            return this._buildMainLink(props);
        }
        return this._buildMainButton(props);
    }
    // Error
    var b0 = <MainButton to='/some/path' onClick={function(e) {}}>GO</MainButton>; // extra property;
    var b1 = <MainButton onClick={function(e) {}} {...obj0}>Hello world</MainButton>; // extra property;
    var b2 = <MainButton {...{
        to: "10000"
    }} {...obj2}/>; // extra property
    var b3 = <MainButton {...{
        to: "10000"
    }} {...{
        onClick: function(k) {}
    }}/>; // extra property
    var b4 = <MainButton {...obj3} to/>; // Should error because Incorrect type; but attributes are any so everything is allowed
    var b5 = <MainButton {...{
        onClick: function onClick(e) {}
    }} {...obj0}/>; // Spread retain method declaration (see GitHub #13365), so now there is an extra attributes
    var b6 = <MainButton {...{
        onClick: function onClick(e) {}
    }} children={10}/>; // incorrect type for optional attribute
    var b7 = <MainButton {...{
        onClick: function onClick(e) {}
    }} children="hello" className/>; // incorrect type for optional attribute
    var b8 = <MainButton data-format/>; // incorrect type for specified hyphanated name
});
