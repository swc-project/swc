var _s = $RefreshSig$(), _s1 = $RefreshSig$(), _s2 = $RefreshSig$();
export function Foo() {
    _s();
    const [foo, setFoo] = useState(0);
    React.useEffect(()=>{});
    return <h1>{foo}</h1>;
}
_s(Foo, "useState{[foo, setFoo](0)}\nuseEffect{}");
_c = Foo;
function Bar() {
    _s1();
    const [foo, setFoo] = useState(0);
    React.useEffect(()=>{});
    return <h1>{foo}</h1>;
}
_s1(Bar, "useState{[foo, setFoo](0)}\nuseEffect{}");
_c1 = Bar;
function baz() {
    _s2();
    return useState(), useState();
}
_s2(baz, "useState{}\nuseState{}");
var _c, _c1;
$RefreshReg$(_c, "Foo");
$RefreshReg$(_c1, "Bar");
