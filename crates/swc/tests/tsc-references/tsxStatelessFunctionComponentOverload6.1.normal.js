//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/_/_object_spread",
    "@swc/helpers/_/_object_spread_props",
    "react"
], function(require, exports, _object_spread, _object_spread_props, _react) {
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
        onClick: function onClick() {}
    };
    function MainButton(props) {
        var linkProps = props;
        if (linkProps.to) {
            return this._buildMainLink(props);
        }
        return this._buildMainButton(props);
    }
    // OK
    var b0 = /*#__PURE__*/ _react.createElement(MainButton, {
        to: "/some/path"
    }, "GO");
    var b1 = /*#__PURE__*/ _react.createElement(MainButton, {
        onClick: function onClick(e) {}
    }, "Hello world");
    var b2 = /*#__PURE__*/ _react.createElement(MainButton, obj);
    var b3 = /*#__PURE__*/ _react.createElement(MainButton, _object_spread._({
        to: 10000
    }, obj));
    var b4 = /*#__PURE__*/ _react.createElement(MainButton, obj1); // any; just pick the first overload
    var b5 = /*#__PURE__*/ _react.createElement(MainButton, _object_spread_props._(_object_spread._({}, obj1), {
        to: "/to/somewhere"
    })); // should pick the second overload
    var b6 = /*#__PURE__*/ _react.createElement(MainButton, obj2);
    var b7 = /*#__PURE__*/ _react.createElement(MainButton, {
        onClick: function onClick() {
            console.log("hi");
        }
    });
    var b8 = /*#__PURE__*/ _react.createElement(MainButton, {
        onClick: function onClick() {}
    }); // OK; method declaration get retained (See GitHub #13365)
    var b9 = /*#__PURE__*/ _react.createElement(MainButton, {
        to: "/some/path",
        "extra-prop": true
    }, "GO");
    var b10 = /*#__PURE__*/ _react.createElement(MainButton, {
        to: "/some/path",
        children: "hi"
    });
    var b11 = /*#__PURE__*/ _react.createElement(MainButton, {
        onClick: function onClick(e) {},
        className: "hello",
        "data-format": true
    }, "Hello world");
    var b12 = /*#__PURE__*/ _react.createElement(MainButton, {
        "data-format": "Hello world"
    });
});
