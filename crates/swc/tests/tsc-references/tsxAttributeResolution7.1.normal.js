//// [file.tsx]
// Error
/*#__PURE__*/ React.createElement("test1", {
    "data-foo": 32
});
// OK
/*#__PURE__*/ React.createElement("test1", {
    "data-foo": '32'
});
/*#__PURE__*/ React.createElement("test1", {
    "data-bar": '32'
});
/*#__PURE__*/ React.createElement("test1", {
    "data-bar": 32
});
