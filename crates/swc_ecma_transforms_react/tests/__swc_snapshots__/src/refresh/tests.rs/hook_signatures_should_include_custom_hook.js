var _s = $RefreshSig$(), _s1 = $RefreshSig$(), _s2 = $RefreshSig$();
function useFancyState() {
    _s();
    const [foo, setFoo] = React.useState(0);
    useFancyEffect();
    return foo;
}
_s(useFancyState, "useState{[foo, setFoo](0)}\nuseFancyEffect{}", false, function() {
    return [
        useFancyEffect
    ];
});
const useFancyEffect = ()=>{
    _s1();
    React.useEffect(()=>{});
};
_s1(useFancyEffect, "useEffect{}");
export default function App() {
    _s2();
    const bar = useFancyState();
    return <h1>{bar}</h1>;
}
_s2(App, "useFancyState{bar}", false, function() {
    return [
        useFancyState
    ];
});
_c = App;
var _c;
$RefreshReg$(_c, "App");
