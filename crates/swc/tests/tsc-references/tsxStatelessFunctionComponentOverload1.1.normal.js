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
    // OK
    var c1 = /*#__PURE__*/ _react.createElement(OneThing, {
        yxx: "ok"
    });
    var c2 = /*#__PURE__*/ _react.createElement(OneThing, {
        yy: 100,
        yy1: "hello"
    });
    var c3 = /*#__PURE__*/ _react.createElement(OneThing, {
        yxx: "hello",
        "ignore-prop": true
    });
    var c4 = /*#__PURE__*/ _react.createElement(OneThing, {
        data: "hello",
        "data-prop": true
    });
    var c5 = /*#__PURE__*/ _react.createElement(OneThing, {
        yxx1: "ok"
    }, "Hello");
    // OK
    var d1 = /*#__PURE__*/ _react.createElement(TestingOneThing, {
        y1: true,
        "extra-data": true
    });
    var d2 = /*#__PURE__*/ _react.createElement(TestingOneThing, {
        "extra-data": "hello"
    });
    var d3 = /*#__PURE__*/ _react.createElement(TestingOneThing, {
        "extra-data": "hello",
        yy: "hihi"
    });
    var d4 = /*#__PURE__*/ _react.createElement(TestingOneThing, {
        "extra-data": "hello",
        yy: 9,
        direction: 10
    });
    var d5 = /*#__PURE__*/ _react.createElement(TestingOneThing, {
        "extra-data": "hello",
        yy: "hello",
        name: "Bob"
    });
    // OK
    var e1 = /*#__PURE__*/ _react.createElement(TestingOptional, null);
    var e3 = /*#__PURE__*/ _react.createElement(TestingOptional, {
        y1: "hello"
    });
    var e4 = /*#__PURE__*/ _react.createElement(TestingOptional, {
        y1: "hello",
        y2: 1000
    });
    var e5 = /*#__PURE__*/ _react.createElement(TestingOptional, {
        y1: true,
        y3: true
    });
    var e6 = /*#__PURE__*/ _react.createElement(TestingOptional, {
        y1: true,
        y3: true,
        y2: 10
    });
    var e2 = /*#__PURE__*/ _react.createElement(TestingOptional, {
        y1: true,
        y3: true,
        "extra-prop": true
    });
});
