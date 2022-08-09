//@filename: file.tsx
//@jsx: preserve
var Obj1;
/*#__PURE__*/ React.createElement(Obj1, {
    x: 10
}); // Error, no render member
var Obj2;
/*#__PURE__*/ React.createElement(Obj2, {
    x: 32,
    render: 100
}); // OK
