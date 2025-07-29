//// [file.tsx]
var props = {
    a: 1,
    b: 1
}, Foo = function(props) {
    return <div>{props.a}</div>;
};
<Foo {...props}></Foo>, <Foo d={1} {...props}></Foo>, <Foo a={1} {...props}></Foo>, <Foo a={1} b={2} {...props}></Foo>, <Foo a={1} d={1} {...props} {...{
    d: 1
}}></Foo>, <Foo a={1} d={1} {...props} {...{
    a: 1,
    d: 1
}}></Foo>;
