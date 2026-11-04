var _s = $RefreshSig$(), _s1 = $RefreshSig$(), _s2 = $RefreshSig$(), _s3 = $RefreshSig$(), _s4 = $RefreshSig$(), _s5 = $RefreshSig$();
export default _s(()=>{
    _s();
    return useContext(X);
}, "useContext{}");
export const Foo = ()=>{
    _s1();
    return useContext(X);
};
_s1(Foo, "useContext{}");
_c = Foo;
module.exports = _s2(()=>{
    _s2();
    return useContext(X);
}, "useContext{}");
const Bar = ()=>{
    _s3();
    return useContext(X);
};
_s3(Bar, "useContext{}");
_c1 = Bar;
const Baz = _s4(memo(_c2 = _s4(()=>{
    _s4();
    return useContext(X);
}, "useContext{}")), "useContext{}");
_c3 = Baz;
const Qux = ()=>{
    _s5();
    return 0, useContext(X);
};
_s5(Qux, "useContext{}");
_c4 = Qux;
var _c, _c1, _c2, _c3, _c4;
$RefreshReg$(_c, "Foo");
$RefreshReg$(_c1, "Bar");
$RefreshReg$(_c2, "Baz$memo");
$RefreshReg$(_c3, "Baz");
$RefreshReg$(_c4, "Qux");
