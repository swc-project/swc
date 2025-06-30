//// [contextuallyTypedStringLiteralsInJsxAttributes01.tsx]
var FooComponent = function(props) {
    return <span>{props.foo}</span>;
};
<FooComponent foo={"A"}/>;
<FooComponent foo="A"/>;
<FooComponent foo={"f"}/>;
<FooComponent foo="f"/>;
