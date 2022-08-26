import t from "@swc/helpers/src/_async_to_generator.mjs";
import e from "@swc/helpers/src/_ts_generator.mjs";
import { displayContent as r } from "./fouc";
import a from "./on-demand-entries-client";
import { addMessageListener as n, connectHMR as c } from "./error-overlay/websocket";
var o = JSON.parse(document.getElementById("__NEXT_DATA__").textContent);
window.__NEXT_DATA__ = o;
var s = o.assetPrefix, i = o.page, u = null, p = __webpack_hash__, l = (s = s || "") + (s.endsWith("/") ? "" : "/") + "_next/static/webpack/";
function f() {
    return (f = t(function() {
        var t, r, a, n, c;
        return e(this, function(e) {
            switch(e.label){
                case 0:
                    if (!(u !== __webpack_hash__) || "idle" !== module.hot.status()) return [
                        2
                    ];
                    e.label = 1;
                case 1:
                    return e.trys.push([
                        1,
                        4,
                        ,
                        5
                    ]), [
                        4,
                        fetch("undefined" != typeof __webpack_runtime_id__ ? "".concat(l).concat(p, ".").concat(__webpack_runtime_id__, ".hot-update.json") : "".concat(l).concat(p, ".hot-update.json"))
                    ];
                case 2:
                    return [
                        4,
                        (t = e.sent()).json()
                    ];
                case 3:
                    return r = e.sent(), a = "/" === i ? "index" : i, (n = (Array.isArray(r.c) ? r.c : Object.keys(r.c)).some(function(t) {
                        return -1 !== t.indexOf("pages".concat(a.startsWith("/") ? a : "/".concat(a))) || -1 !== t.indexOf("pages".concat(a.startsWith("/") ? a : "/".concat(a)).replace(/\//g, "\\"));
                    })) ? document.location.reload(!0) : p = u, [
                        3,
                        5
                    ];
                case 4:
                    return c = e.sent(), console.error("Error occurred checking for update", c), document.location.reload(!0), [
                        3,
                        5
                    ];
                case 5:
                    return [
                        2
                    ];
            }
        });
    })).apply(this, arguments);
}
n(function(t) {
    if ("\uD83D\uDC93" !== t.data) try {
        var e = JSON.parse(t.data);
        if ("sync" === e.action || "built" === e.action) {
            if (!e.hash) return;
            u = e.hash, function() {
                f.apply(this, arguments);
            }();
        } else "reloadPage" === e.action && document.location.reload(!0);
    } catch (r) {
        console.warn("Invalid HMR message: " + t.data + "\n" + r);
    }
}), c({
    assetPrefix: s,
    path: "/_next/webpack-hmr"
}), r(), a(o.page);
