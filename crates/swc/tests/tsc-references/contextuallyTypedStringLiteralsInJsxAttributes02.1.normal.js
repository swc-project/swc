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
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get MainButton () {
            return MainButton;
        },
        get NoOverload () {
            return NoOverload;
        },
        get NoOverload1 () {
            return NoOverload1;
        }
    });
    function MainButton(props) {
        var linkProps = props;
        if (linkProps.goTo) {
            return this._buildMainLink(props);
        }
        return this._buildMainButton(props);
    }
    var b0 = <MainButton {...{
        onClick: function(k) {
            console.log(k);
        }
    }} extra/>; // k has type "left" | "right"
    var b2 = <MainButton onClick={function(k) {
        console.log(k);
    }} extra/>; // k has type "left" | "right"
    var b3 = <MainButton {...{
        goTo: "home"
    }} extra/>; // goTo has type"home" | "contact"
    var b4 = <MainButton goTo="home" extra/>; // goTo has type "home" | "contact"
    function NoOverload(buttonProps) {
        return undefined;
    }
    var c1 = <NoOverload {...{
        onClick: function(k) {
            console.log(k);
        }
    }} extra/>; // k has type any
    function NoOverload1(linkProps) {
        return undefined;
    }
    var d1 = <NoOverload1 {...{
        goTo: "home"
    }} extra/>; // goTo has type "home" | "contact"
});
