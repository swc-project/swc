var _s = $RefreshSig$(), _s1 = $RefreshSig$();
const A = function() {
    _s();
    const [foo, setFoo] = useState(0);
}, B = ()=>{
    _s1();
    const [foo, setFoo] = useState(0);
};
_s(A, "useState{[foo, setFoo](0)}");
_s1(B, "useState{[foo, setFoo](0)}");
