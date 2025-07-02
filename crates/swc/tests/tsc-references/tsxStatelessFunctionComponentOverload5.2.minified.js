//// [file.tsx]
define([
    "require",
    "exports"
], function(require, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "MainButton", {
        enumerable: !0,
        get: function() {
            return MainButton;
        }
    });
    var obj3, obj0 = {
        to: "world"
    };
    function MainButton(props) {
        return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
    }
    <MainButton to='/some/path' onClick={function(e) {}}>GO</MainButton>, <MainButton onClick={function(e) {}} {...obj0}>Hello world</MainButton>, <MainButton {...{
        to: "10000"
    }} {...{
        onClick: function() {}
    }}/>, <MainButton {...{
        to: "10000"
    }} {...{
        onClick: function(k) {}
    }}/>, <MainButton {...obj3} to/>, <MainButton {...{
        onClick: function(e) {}
    }} {...obj0}/>, <MainButton {...{
        onClick: function(e) {}
    }} children={10}/>, <MainButton {...{
        onClick: function(e) {}
    }} children="hello" className/>, <MainButton data-format/>;
});
