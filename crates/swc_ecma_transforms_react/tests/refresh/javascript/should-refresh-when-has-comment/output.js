var _s = $RefreshSig$(), _s1 = $RefreshSig$();
export function Foo() {
    _s();
    const [foo, setFoo] = useState(0);
    React.useEffect(()=>{});
    return <h1>{foo}</h1>;
}
_s(Foo, "useState{[foo, setFoo](0)}\nuseEffect{}", true);
_c = Foo;
function Bar() {
    _s1();
    const [foo, setFoo] = useState(0);
    React.useEffect(()=>{
    // @refresh reset
    });
    return <h1>{foo}</h1>;
}
_s1(Bar, "useState{[foo, setFoo](0)}\nuseEffect{}", true);
_c1 = Bar;
var _c, _c1;
$RefreshReg$(_c, "Foo");
$RefreshReg$(_c1, "Bar");
