const { c: _c } = require("react/compiler-runtime");
function App() {
    const $ = _c(1);
    let t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = <div data-kind="types"/>;
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    return t0;
}
module.exports = App;
