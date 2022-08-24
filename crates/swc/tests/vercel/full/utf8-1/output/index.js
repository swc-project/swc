import t from "@swc/helpers/src/_async_to_generator.mjs";
import a from "@swc/helpers/src/_ts_generator.mjs";
import { displayContent as r } from "./fouc";
import n from "./on-demand-entries-client";
import { addMessageListener as e, connectHMR as c } from "./error-overlay/websocket";
var o = JSON.parse(document.getElementById("__NEXT_DATA__").textContent);
window.__NEXT_DATA__ = o;
var s = o.assetPrefix, i = o.page, f = null, u = __webpack_hash__, l = (s = s || "") + (s.endsWith("/") ? "" : "/") + "_next/static/webpack/";
function p() {
    return (p = t(function() {
        var t, r, n, e, c;
        return a(this, function(a) {
            switch(a.label){
                case 0:
                    if (!(f !== __webpack_hash__) || "idle" !== module.hot.status()) return [
                        2
                    ];
                    a.label = 1;
                case 1:
                    return a.trys.push([
                        1,
                        4,
                        ,
                        5
                    ]), [
                        4,
                        fetch("undefined" != typeof __webpack_runtime_id__ ? "".concat(l).concat(u, ".").concat(__webpack_runtime_id__, ".hot-update.json") : "".concat(l).concat(u, ".hot-update.json"))
                    ];
                case 2:
                    return [
                        4,
                        (t = a.sent()).json()
                    ];
                case 3:
                    return r = a.sent(), n = "/" === i ? "index" : i, (e = (Array.isArray(r.c) ? r.c : Object.keys(r.c)).some(function(t) {
                        return -1 !== t.indexOf("pages".concat(n.startsWith("/") ? n : "/".concat(n))) || -1 !== t.indexOf("pages".concat(n.startsWith("/") ? n : "/".concat(n)).replace(/\//g, "\\"));
                    })) ? document.location.reload(!0) : u = f, [
                        3,
                        5
                    ];
                case 4:
                    return c = a.sent(), console.error("Error occurred checking for update", c), document.location.reload(!0), [
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
e(function(t) {
    if ("\uD83D\uDC93" !== t.data) try {
        var a = JSON.parse(t.data);
        if ("sync" === a.action || "built" === a.action) {
            if (!a.hash) return;
            f = a.hash, function() {
                p.apply(this, arguments);
            }();
        } else "reloadPage" === a.action && document.location.reload(!0);
    } catch (r) {
        console.warn("Invalid HMR message: " + t.data + "\n" + r);
    }
}), c({
    assetPrefix: s,
    path: "/_next/webpack-hmr"
}), r(), n(o.page);
