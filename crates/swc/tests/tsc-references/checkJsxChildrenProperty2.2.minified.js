//// [file.tsx]
function Comp(p) {
    return <div>{p.b}</div>;
}
<Comp a={10} b="hi"/>, <Comp a={10} b="hi" children="Random">
        hi hi hi!
    </Comp>, <Comp a={10} b="hi" {...{
    children: "Random"
}}>
        hi hi hi!
    </Comp>, <Comp a={10} b="hi">
        <div> My Div </div>
        {function(name) {
    return <div> My name {name} </div>;
}}
    </Comp>, <Comp a={10} b="hi">
        <div> My Div </div>
        {1000000}
    </Comp>, <Comp a={10} b="hi">
        <div> My Div </div>
        hi hi hi!
    </Comp>, <Comp a={10} b="hi">
        <div> My Div </div>
        <div> My Div </div>
    </Comp>;
