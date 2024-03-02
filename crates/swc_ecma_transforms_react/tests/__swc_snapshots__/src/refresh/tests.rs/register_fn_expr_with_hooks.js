var _s = $RefreshSig$(), _s1 = $RefreshSig$();
export const A = _s(React.memo(_c1 = _s(React.forwardRef(_c = _s((props, ref1)=>{
    _s();
    const [foo, setFoo] = useState(0);
    React.useEffect(()=>{});
    return <h1 ref={ref1}>{foo}</h1>;
}, "useState{[foo, setFoo](0)}\nuseEffect{}")), "useState{[foo, setFoo](0)}\nuseEffect{}")), "useState{[foo, setFoo](0)}\nuseEffect{}");
_c2 = A;
export const B = _s1(React.memo(_c4 = _s1(React.forwardRef(_c3 = _s1(function(props, ref1) {
    _s1();
    const [foo, setFoo] = useState(0);
    React.useEffect(()=>{});
    return <h1 ref={ref1}>{foo}</h1>;
}, "useState{[foo, setFoo](0)}\nuseEffect{}")), "useState{[foo, setFoo](0)}\nuseEffect{}")), "useState{[foo, setFoo](0)}\nuseEffect{}");
_c5 = B;
function hoc() {
    var _s = $RefreshSig$();
    return _s(function Inner() {
        _s();
        const [foo, setFoo] = useState(0);
        React.useEffect(()=>{});
        return <h1 ref={ref}>{foo}</h1>;
    }, "useState{[foo, setFoo](0)}\nuseEffect{}");
}
export let C = hoc();
var _c, _c1, _c2, _c3, _c4, _c5;
$RefreshReg$(_c, "A$React.memo$React.forwardRef");
$RefreshReg$(_c1, "A$React.memo");
$RefreshReg$(_c2, "A");
$RefreshReg$(_c3, "B$React.memo$React.forwardRef");
$RefreshReg$(_c4, "B$React.memo");
$RefreshReg$(_c5, "B");
