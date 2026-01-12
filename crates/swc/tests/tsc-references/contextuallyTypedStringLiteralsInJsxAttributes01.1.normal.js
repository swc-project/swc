//// [contextuallyTypedStringLiteralsInJsxAttributes01.tsx]
(function(JSX) {})(JSX || (JSX = {}));
var FooComponent = function(props) {
    return /*#__PURE__*/ React.createElement("span", null, props.foo);
};
/*#__PURE__*/ React.createElement(FooComponent, {
    foo: "A"
});
/*#__PURE__*/ React.createElement(FooComponent, {
    foo: "A"
});
/*#__PURE__*/ React.createElement(FooComponent, {
    foo: "f"
});
/*#__PURE__*/ React.createElement(FooComponent, {
    foo: "f"
});
var JSX;
