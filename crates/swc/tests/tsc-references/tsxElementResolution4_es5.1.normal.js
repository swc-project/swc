//@filename: file.tsx
//@jsx: preserve
// OK
/*#__PURE__*/ React.createElement("div", {
    n: "x"
});
// OK
/*#__PURE__*/ React.createElement("span", {
    m: "ok"
});
// Error
/*#__PURE__*/ React.createElement("span", {
    q: ""
});
