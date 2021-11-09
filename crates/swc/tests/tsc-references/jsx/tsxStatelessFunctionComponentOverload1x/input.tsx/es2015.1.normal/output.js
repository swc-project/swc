// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
// OK
const c1 = /*#__PURE__*/ React.createElement(OneThing, {
    yxx: "ok"
});
const c2 = /*#__PURE__*/ React.createElement(OneThing, {
    yy: 100,
    yy1: "hello"
});
const c3 = /*#__PURE__*/ React.createElement(OneThing, {
    yxx: "hello",
    "ignore-prop": true
});
const c4 = /*#__PURE__*/ React.createElement(OneThing, {
    data: "hello",
    "data-prop": true
});
const c5 = /*#__PURE__*/ React.createElement(OneThing, {
    yxx1: "ok"
}, "Hello");
// OK
const d1 = /*#__PURE__*/ React.createElement(TestingOneThing, {
    y1: true,
    "extra-data": true
});
const d2 = /*#__PURE__*/ React.createElement(TestingOneThing, {
    "extra-data": "hello"
});
const d3 = /*#__PURE__*/ React.createElement(TestingOneThing, {
    "extra-data": "hello",
    yy: "hihi"
});
const d4 = /*#__PURE__*/ React.createElement(TestingOneThing, {
    "extra-data": "hello",
    yy: 9,
    direction: 10
});
const d5 = /*#__PURE__*/ React.createElement(TestingOneThing, {
    "extra-data": "hello",
    yy: "hello",
    name: "Bob"
});
// OK
const e1 = /*#__PURE__*/ React.createElement(TestingOptional, null);
const e3 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: "hello"
});
const e4 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: "hello",
    y2: 1000
});
const e5 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: true,
    y3: true
});
const e6 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: true,
    y3: true,
    y2: 10
});
const e2 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: true,
    y3: true,
    "extra-prop": true
});
export { };
