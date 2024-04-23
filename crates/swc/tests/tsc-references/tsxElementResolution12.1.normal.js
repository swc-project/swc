//// [file.tsx]
var Obj1;
/*#__PURE__*/ React.createElement(Obj1, {
    x: 10
}); // OK
var Obj2;
/*#__PURE__*/ React.createElement(Obj2, {
    x: 10
}); // OK
var Obj3;
/*#__PURE__*/ React.createElement(Obj3, {
    x: 10
}); // Error
var attributes;
/*#__PURE__*/ React.createElement(Obj3, attributes); // Error
/*#__PURE__*/ React.createElement(Obj3, {}); // OK
var Obj4;
/*#__PURE__*/ React.createElement(Obj4, {
    x: 10
}); // OK
/*#__PURE__*/ React.createElement(Obj4, {
    x: '10'
}); // Error
