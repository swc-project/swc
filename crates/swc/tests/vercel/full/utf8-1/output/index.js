import a from "@swc/helpers/src/_async_to_generator.mjs";
import b from "regenerator-runtime";
import { displayContent as c } from "./fouc";
import d from "./on-demand-entries-client";
import { addMessageListener as e, connectHMR as f } from "./error-overlay/websocket";
var g = JSON.parse(document.getElementById("__NEXT_DATA__").textContent);
window.__NEXT_DATA__ = g;
var h = g.assetPrefix, i = g.page, j = null, k = __webpack_hash__, l = (h = h || "") + (h.endsWith("/") ? "" : "/") + "_next/static/webpack/";
function m() {
    return j !== __webpack_hash__;
}
function n() {
    return "idle" === module.hot.status();
}
function o() {
    return (o = a(b.mark(function a() {
        var c, d, e, f;
        return b.wrap(function(a) {
            for(;;)switch(a.prev = a.next){
                case 0:
                    if (!(!m() || !n())) {
                        a.next = 2;
                        break;
                    }
                    return a.abrupt("return");
                case 2:
                    return a.prev = 2, a.next = 5, fetch("undefined" != typeof __webpack_runtime_id__ ? "".concat(l).concat(k, ".").concat(__webpack_runtime_id__, ".hot-update.json") : "".concat(l).concat(k, ".hot-update.json"));
                case 5:
                    return c = a.sent, a.next = 8, c.json();
                case 8:
                    d = a.sent, e = "/" === i ? "index" : i, (f = (Array.isArray(d.c) ? d.c : Object.keys(d.c)).some(function(a) {
                        return -1 !== a.indexOf("pages".concat(e.startsWith("/") ? e : "/".concat(e))) || -1 !== a.indexOf("pages".concat(e.startsWith("/") ? e : "/".concat(e)).replace(/\//g, "\\"));
                    })) ? document.location.reload(!0) : k = j, a.next = 18;
                    break;
                case 14:
                    a.prev = 14, a.t0 = a.catch(2), console.error("Error occurred checking for update", a.t0), document.location.reload(!0);
                case 18:
                case "end":
                    return a.stop();
            }
        }, a, null, [
            [
                2,
                14
            ]
        ]);
    }))).apply(this, arguments);
}
e(function(a) {
    if ("\uD83D\uDC93" !== a.data) try {
        var b = JSON.parse(a.data);
        if ("sync" === b.action || "built" === b.action) {
            if (!b.hash) return;
            j = b.hash, function() {
                o.apply(this, arguments);
            }();
        } else "reloadPage" === b.action && document.location.reload(!0);
    } catch (c) {
        console.warn("Invalid HMR message: " + a.data + "\n" + c);
    }
}), f({
    assetPrefix: h,
    path: "/_next/webpack-hmr"
}), c(), d(g.page);
