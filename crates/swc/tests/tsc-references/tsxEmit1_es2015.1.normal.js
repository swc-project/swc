var p;
var selfClosed1 = /*#__PURE__*/ React.createElement("div", null);
var selfClosed2 = /*#__PURE__*/ React.createElement("div", {
    x: "1"
});
var selfClosed3 = /*#__PURE__*/ React.createElement("div", {
    x: "1"
});
var selfClosed4 = /*#__PURE__*/ React.createElement("div", {
    x: "1",
    y: "0"
});
var selfClosed5 = /*#__PURE__*/ React.createElement("div", {
    x: 0,
    y: "0"
});
var selfClosed6 = /*#__PURE__*/ React.createElement("div", {
    x: "1",
    y: "0"
});
var selfClosed7 = /*#__PURE__*/ React.createElement("div", {
    x: p,
    y: "p"
});
var openClosed1 = /*#__PURE__*/ React.createElement("div", null);
var openClosed2 = /*#__PURE__*/ React.createElement("div", {
    n: "m"
}, "foo");
var openClosed3 = /*#__PURE__*/ React.createElement("div", {
    n: "m"
}, p);
var openClosed4 = /*#__PURE__*/ React.createElement("div", {
    n: "m"
}, p < p);
var openClosed5 = /*#__PURE__*/ React.createElement("div", {
    n: "m"
}, p > p);
class SomeClass {
    f() {
        var rewrites1 = /*#__PURE__*/ React.createElement("div", null, ()=>this);
        var rewrites2 = /*#__PURE__*/ React.createElement("div", null, [
            p,
            ...p,
            p
        ]);
        var rewrites3 = /*#__PURE__*/ React.createElement("div", null, {
            p
        });
        var rewrites4 = /*#__PURE__*/ React.createElement("div", {
            a: ()=>this
        });
        var rewrites5 = /*#__PURE__*/ React.createElement("div", {
            a: [
                p,
                ...p,
                p
            ]
        });
        var rewrites6 = /*#__PURE__*/ React.createElement("div", {
            a: {
                p
            }
        });
    }
}
var whitespace1 = /*#__PURE__*/ React.createElement("div", null, "      ");
var whitespace2 = /*#__PURE__*/ React.createElement("div", null, "  ", p, "    ");
var whitespace3 = /*#__PURE__*/ React.createElement("div", null, p);
