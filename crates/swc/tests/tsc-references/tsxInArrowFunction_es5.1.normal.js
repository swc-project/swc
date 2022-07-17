// @jsx: preserve
// didn't work
/*#__PURE__*/ React.createElement("div", null, function() {
    return /*#__PURE__*/ React.createElement("div", {
        text: "wat"
    });
});
// didn't work
/*#__PURE__*/ React.createElement("div", null, function(x) {
    return /*#__PURE__*/ React.createElement("div", {
        text: "wat"
    });
});
// worked
/*#__PURE__*/ React.createElement("div", null, function() {
    return /*#__PURE__*/ React.createElement("div", {
        text: "wat"
    });
});
// worked (!)
/*#__PURE__*/ React.createElement("div", null, function() {
    return /*#__PURE__*/ React.createElement("div", {
        text: "wat"
    });
});
