//// [file.tsx]
define([
    "require",
    "exports"
], function(require, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var all = {
        get MainButton () {
            return MainButton;
        },
        get NoOverload () {
            return NoOverload;
        },
        get NoOverload1 () {
            return NoOverload1;
        }
    };
    for(var name in all)Object.defineProperty(exports, name, {
        enumerable: !0,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
    function MainButton(props) {
        return props.goTo ? this._buildMainLink(props) : this._buildMainButton(props);
    }
    function NoOverload(buttonProps) {}
    function NoOverload1(linkProps) {}
    <MainButton {...{
        onClick: function(k) {
            console.log(k);
        }
    }} extra/>, <MainButton onClick={function(k) {
        console.log(k);
    }} extra/>, <MainButton {...{
        goTo: "home"
    }} extra/>, <MainButton goTo="home" extra/>, <NoOverload {...{
        onClick: function(k) {
            console.log(k);
        }
    }} extra/>, <NoOverload1 {...{
        goTo: "home"
    }} extra/>;
});
