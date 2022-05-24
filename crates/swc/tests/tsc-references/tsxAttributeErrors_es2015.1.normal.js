import _extends from "@swc/helpers/lib/_extends.js";
// Error, number is not assignable to string
/*#__PURE__*/ React.createElement("div", {
    text: 42
});
// Error, string is not assignable to number
/*#__PURE__*/ React.createElement("div", {
    width: 'foo'
});
// Error, number is not assignable to string
var attribs = {
    text: 100
};
/*#__PURE__*/ React.createElement("div", _extends({}, attribs));
// No errors here
/*#__PURE__*/ React.createElement("span", {
    foo: "bar",
    bar: 'foo'
});
