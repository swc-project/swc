//// [file.tsx]
function Comp(p) {
    return <div>{p.b}</div>;
}
<Comp a={10} b="hi" children="lol"/>, <Comp a={10} b="hi">
        hi hi hi!
    </Comp>, <Comp a={10} b="hi">
        <div>hi hi hi!</div>
    </Comp>;
