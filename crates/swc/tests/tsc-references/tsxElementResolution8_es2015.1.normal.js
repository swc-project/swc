//@filename: file.tsx
//@jsx: preserve
// Error
var Div = 3;
/*#__PURE__*/ React.createElement(Div, null);
// OK
function Fact() {
    return null;
}
/*#__PURE__*/ React.createElement(Fact, null);
// Error
function Fnum() {
    return 42;
}
/*#__PURE__*/ React.createElement(Fnum, null);
var Obj1;
/*#__PURE__*/ React.createElement(Obj1, null); // OK, prefer construct signatures
var Obj2;
/*#__PURE__*/ React.createElement(Obj2, null); // Error
var Obj3;
/*#__PURE__*/ React.createElement(Obj3, null); // Error
