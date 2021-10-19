const FooComponent = (props)=>React.createElement("span", null, props.foo)
;
React.createElement(FooComponent, {
    foo: "A"
}), React.createElement(FooComponent, {
    foo: "A"
}), React.createElement(FooComponent, {
    foo: "f"
}), React.createElement(FooComponent, {
    foo: "f"
});
