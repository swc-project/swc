import { jsx as _jsx } from "react/jsx-runtime";
const emptyDecimal = /*#__PURE__*/ _jsx("div", {
    children: "&#;  text"
});
const emptyHex = /*#__PURE__*/ _jsx("div", {
    children: "&#x;  text"
});
const outOfRangeDecimal = /*#__PURE__*/ _jsx("div", {
    children: "&#1114112;  text"
});
const outOfRangeHex = /*#__PURE__*/ _jsx("div", {
    children: "&#x110000;  text"
});
const uppercaseHexPrefix = /*#__PURE__*/ _jsx("div", {
    children: "&#X20;  text"
});
const signedDecimal = /*#__PURE__*/ _jsx("div", {
    children: "&#+32;  text"
});
const invalidLongDigits = /*#__PURE__*/ _jsx("div", {
    children: "&#000000000000000000000000000000G;  text"
});
const strayAmpersand = /*#__PURE__*/ _jsx("div", {
    children: "& &  text"
});
const nonAsciiReference = /*#__PURE__*/ _jsx("div", {
    children: "&é;&  text"
});
