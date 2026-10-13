import { jsx as _jsx } from "react/jsx-runtime";
const loneHigh = /*#__PURE__*/ _jsx("div", {
    children: "\uD800  text"
});
const loneLow = /*#__PURE__*/ _jsx("div", {
    children: "\uDC00  text"
});
const hexPair = /*#__PURE__*/ _jsx("div", {
    children: "🦀  text"
});
const decimalPair = /*#__PURE__*/ _jsx("div", {
    children: "🦀  text"
});
const mixedPair = /*#__PURE__*/ _jsx("div", {
    children: "🦀  text"
});
const repeatedHigh = /*#__PURE__*/ _jsx("div", {
    children: "\uD800\uD801  text"
});
const highBeforePair = /*#__PURE__*/ _jsx("div", {
    children: "\uD800𐐀  text"
});
const reversedPair = /*#__PURE__*/ _jsx("div", {
    children: "\uDC00\uD800  text"
});
const pairBeforeHigh = /*#__PURE__*/ _jsx("div", {
    children: "🦀\uD800  text"
});
const namedBetweenHalves = /*#__PURE__*/ _jsx("div", {
    children: "\uD800&\uDC00  text"
});
const textBetweenHalves = /*#__PURE__*/ _jsx("div", {
    children: "\uD800a\uDC00  text"
});
const beforeOutOfRange = /*#__PURE__*/ _jsx("div", {
    children: "\uD800&#x110000;  text"
});
const beforeEmptyDecimal = /*#__PURE__*/ _jsx("div", {
    children: "\uD800&#;  text"
});
const beforeEmptyHex = /*#__PURE__*/ _jsx("div", {
    children: "\uD800&#x;  text"
});
const longHighPair = /*#__PURE__*/ _jsx("div", {
    children: "🦀  text"
});
const longLowPair = /*#__PURE__*/ _jsx("div", {
    children: "🦀  text"
});
