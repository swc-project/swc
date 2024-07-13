var _s = $RefreshSig$();
import { useFancyState } from './hooks';
import useFoo from './foo';
export default function App() {
    _s();
    const bar = useFancyState();
    const foo = useFoo();
    return /*#__PURE__*/ React.createElement("h1", null, bar);
}
_s(App, "useFancyState{bar}\nuseFoo{foo}", false, function() {
    return [
        useFancyState,
        useFoo
    ];
});
_c = App;
var _c;
$RefreshReg$(_c, "App");
