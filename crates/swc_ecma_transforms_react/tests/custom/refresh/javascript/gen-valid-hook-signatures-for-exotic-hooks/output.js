var _s = $RefreshSig$();
import FancyHook from 'fancy';
export default function App() {
    _s();
    var _s1 = $RefreshSig$();
    function useFancyState() {
        _s1();
        const [foo, setFoo] = React.useState(0);
        useFancyEffect();
        return foo;
    }
    _s1(useFancyState, "useState{[foo, setFoo](0)}\nuseFancyEffect{}", true);
    const bar = useFancyState();
    const baz = FancyHook.useThing();
    React.useState();
    useThePlatform();
    return <h1>{bar}{baz}</h1>;
}
_s(App, "useFancyState{bar}\nuseThing{baz}\nuseState{}\nuseThePlatform{}", true, function() {
    return [
        FancyHook.useThing
    ];
});
_c = App;
var _c;
$RefreshReg$(_c, "App");
