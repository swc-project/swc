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
    var obj = {
        children: "hi",
        to: "boo"
    };
    var obj1;
    var obj2 = {
        onClick: function() {}
    };
    function MainButton(props) {
        var linkProps = props;
        if (linkProps.to) {
            return this._buildMainLink(props);
        }
        return this._buildMainButton(props);
    }
    // OK
    var b0 = <MainButton to='/some/path'>GO</MainButton>;
    var b1 = <MainButton onClick={function(e) {}}>Hello world</MainButton>;
    var b2 = <MainButton {...obj}/>;
    var b3 = <MainButton {...{
        to: 10000
    }} {...obj}/>;
    var b4 = <MainButton {...obj1}/>; // any; just pick the first overload
    var b5 = <MainButton {...obj1} to="/to/somewhere"/>; // should pick the second overload
    var b6 = <MainButton {...obj2}/>;
    var b7 = <MainButton {...{
        onClick: function() {
            console.log("hi");
        }
    }}/>;
    var b8 = <MainButton {...{
        onClick: function onClick() {}
    }}/>; // OK; method declaration get retained (See GitHub #13365)
    var b9 = <MainButton to='/some/path' extra-prop>GO</MainButton>;
    var b10 = <MainButton to='/some/path' children="hi"></MainButton>;
    var b11 = <MainButton onClick={function(e) {}} className="hello" data-format>Hello world</MainButton>;
    var b12 = <MainButton data-format="Hello world"/>;
});
