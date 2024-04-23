//// [file.tsx]
// OK
/*#__PURE__*/ React.createElement("test1", {
    x: 0
}); // OK
/*#__PURE__*/ React.createElement("test1", null); // OK
/*#__PURE__*/ React.createElement("test1", {
    "data-x": true
}); // OK
/*#__PURE__*/ React.createElement("test2", {
    reqd: "true"
}); // OK
/*#__PURE__*/ React.createElement("test2", {
    reqd: 'true'
}); // OK
// Errors
/*#__PURE__*/ React.createElement("test1", {
    x: '0'
}); // Error, '0' is not number
/*#__PURE__*/ React.createElement("test1", {
    y: 0
}); // Error, no property "y"
/*#__PURE__*/ React.createElement("test1", {
    y: "foo"
}); // Error, no property "y"
/*#__PURE__*/ React.createElement("test1", {
    x: "32"
}); // Error, "32" is not number
/*#__PURE__*/ React.createElement("test1", {
    var: "10"
}); // Error, no 'var' property
/*#__PURE__*/ React.createElement("test2", null); // Error, missing reqd
/*#__PURE__*/ React.createElement("test2", {
    reqd: 10
}); // Error, reqd is not string
// Should be OK
/*#__PURE__*/ React.createElement("var", {
    var: "var"
});
