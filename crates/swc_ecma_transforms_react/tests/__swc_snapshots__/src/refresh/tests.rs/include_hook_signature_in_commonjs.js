var _s = $RefreshSig$();
import { jsx as _jsx } from "react/jsx-runtime";
import { useFancyState } from './hooks';
import useFoo from './foo';
export default function App() {
    _s();
    const bar = useFancyState();
    const foo = useFoo();
    return /*#__PURE__*/ _jsx("h1", {
        children: bar
    });
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
