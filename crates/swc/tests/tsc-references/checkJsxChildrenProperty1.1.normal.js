//// [file.tsx]
function Comp(p) {
    return <div>{p.b}</div>;
}
// OK
var k = <Comp a={10} b="hi" children="lol"/>;
var k1 = <Comp a={10} b="hi">
        hi hi hi!
    </Comp>;
var k2 = <Comp a={10} b="hi">
        <div>hi hi hi!</div>
    </Comp>;
