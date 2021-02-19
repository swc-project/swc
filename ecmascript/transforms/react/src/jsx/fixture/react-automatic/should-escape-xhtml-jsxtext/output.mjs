import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
_jsx("div", {
    children: "wow"
});
_jsx("div", {
    children: "w\xf4w"
});
_jsx("div", {
    children: "w & w"
});
_jsx("div", {
    children: "w & w"
});
_jsx("div", {
    children: "w \xa0 w"
});
_jsx("div", {
    children: "this should not parse as unicode: \\u00a0"
});
_jsx("div", {
    children: "this should parse as nbsp: \xa0 "
});
_jsxs("div", {
    children: [
        "this should parse as unicode: ",
        "\xa0\xa0"
    ]
});
_jsx("div", {
    children: "w < w"
});
