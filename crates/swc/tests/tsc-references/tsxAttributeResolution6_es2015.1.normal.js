//@filename: file.tsx
//@jsx: preserve
// Error
/*#__PURE__*/ React.createElement("test1", {
    s: true
});
/*#__PURE__*/ React.createElement("test1", {
    n: "true"
});
/*#__PURE__*/ React.createElement("test2", null);
// OK
/*#__PURE__*/ React.createElement("test1", {
    n: true
});
/*#__PURE__*/ React.createElement("test1", {
    n: false
});
/*#__PURE__*/ React.createElement("test2", {
    n: true
});
