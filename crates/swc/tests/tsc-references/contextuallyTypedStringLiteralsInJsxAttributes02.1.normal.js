//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_extends.mjs",
    "react"
], function(require, exports, _extends, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        MainButton: function() {
            return MainButton;
        },
        NoOverload: function() {
            return NoOverload;
        },
        NoOverload1: function() {
            return NoOverload1;
        }
    });
    _extends = _extends.default;
    function MainButton(props) {
        var linkProps = props;
        if (linkProps.goTo) {
            return this._buildMainLink(props);
        }
        return this._buildMainButton(props);
    }
    var b0 = /*#__PURE__*/ _react.createElement(MainButton, _extends({}, {
        onClick: function(k) {
            console.log(k);
        }
    }, {
        extra: true
    })); // k has type "left" | "right"
    var b2 = /*#__PURE__*/ _react.createElement(MainButton, {
        onClick: function(k) {
            console.log(k);
        },
        extra: true
    }); // k has type "left" | "right"
    var b3 = /*#__PURE__*/ _react.createElement(MainButton, _extends({}, {
        goTo: "home"
    }, {
        extra: true
    })); // goTo has type"home" | "contact"
    var b4 = /*#__PURE__*/ _react.createElement(MainButton, {
        goTo: "home",
        extra: true
    }); // goTo has type "home" | "contact"
    function NoOverload(buttonProps) {
        return undefined;
    }
    var c1 = /*#__PURE__*/ _react.createElement(NoOverload, _extends({}, {
        onClick: function(k) {
            console.log(k);
        }
    }, {
        extra: true
    })); // k has type any
    function NoOverload1(linkProps) {
        return undefined;
    }
    var d1 = /*#__PURE__*/ _react.createElement(NoOverload1, _extends({}, {
        goTo: "home"
    }, {
        extra: true
    })); // goTo has type "home" | "contact"
});
