//// [file.tsx]
define([
    "require",
    "exports",
    "react"
], function(require, exports, _react) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "MainButton", {
        enumerable: !0,
        get: function() {
            return MainButton;
        }
    });
    var obj1, obj = {
        children: "hi",
        to: "boo"
    };
    function MainButton(props) {
        return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
    }
    <MainButton to='/some/path'>GO</MainButton>, <MainButton onClick={function(e) {}}>Hello world</MainButton>, <MainButton {...obj}/>, <MainButton {...{
        to: 10000
    }} {...obj}/>, <MainButton {...obj1}/>, <MainButton {...obj1} to="/to/somewhere"/>, <MainButton {...{
        onClick: function() {}
    }}/>, <MainButton {...{
        onClick: function() {
            console.log("hi");
        }
    }}/>, <MainButton {...{
        onClick: function() {}
    }}/>, <MainButton to='/some/path' extra-prop>GO</MainButton>, <MainButton to='/some/path' children="hi"></MainButton>, <MainButton onClick={function(e) {}} className="hello" data-format>Hello world</MainButton>, <MainButton data-format="Hello world"/>;
});
