import t from "@swc/helpers/src/_async_to_generator.mjs";
import r from "regenerator-runtime";
import { displayContent as a } from "./fouc";
import n from "./on-demand-entries-client";
import { addMessageListener as e, connectHMR as c } from "./error-overlay/websocket";
var o = JSON.parse(document.getElementById("__NEXT_DATA__").textContent);
window.__NEXT_DATA__ = o;
var i = o.assetPrefix, s = o.page, f = null, p = __webpack_hash__, u = (i = i || "") + (i.endsWith("/") ? "" : "/") + "_next/static/webpack/";
function l() {
    return f !== __webpack_hash__;
}
function h() {
    return "idle" === module.hot.status();
}
function m() {
    return (m = t(r.mark(function t() {
        var a, n, e, c;
        return r.wrap(function(t) {
            for(;;)switch(t.prev = t.next){
                case 0:
                    if (!(!l() || !h())) {
                        t.next = 2;
                        break;
                    }
                    return t.abrupt("return");
                case 2:
                    return t.prev = 2, t.next = 5, fetch("undefined" != typeof __webpack_runtime_id__ ? "".concat(u).concat(p, ".").concat(__webpack_runtime_id__, ".hot-update.json") : "".concat(u).concat(p, ".hot-update.json"));
                case 5:
                    return a = t.sent, t.next = 8, a.json();
                case 8:
                    n = t.sent, e = "/" === s ? "index" : s, (c = (Array.isArray(n.c) ? n.c : Object.keys(n.c)).some(function(t) {
                        return -1 !== t.indexOf("pages".concat(e.startsWith("/") ? e : "/".concat(e))) || -1 !== t.indexOf("pages".concat(e.startsWith("/") ? e : "/".concat(e)).replace(/\//g, "\\"));
                    })) ? document.location.reload(!0) : p = f, t.next = 18;
                    break;
                case 14:
                    t.prev = 14, t.t0 = t.catch(2), console.error("Error occurred checking for update", t.t0), document.location.reload(!0);
                case 18:
                case "end":
                    return t.stop();
            }
        }, t, null, [
            [
                2,
                14
            ]
        ]);
    }))).apply(this, arguments);
}
e(function(t) {
    if ("\uD83D\uDC93" !== t.data) try {
        var r = JSON.parse(t.data);
        if ("sync" === r.action || "built" === r.action) {
            if (!r.hash) return;
            f = r.hash, function() {
                m.apply(this, arguments);
            }();
        } else "reloadPage" === r.action && document.location.reload(!0);
    } catch (a) {
        console.warn("Invalid HMR message: " + t.data + "\n" + a);
    }
}), c({
    assetPrefix: i,
    path: "/_next/webpack-hmr"
}), a(), n(o.page);
