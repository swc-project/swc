import "@swc/helpers/_/_async_to_generator";
import { _ as e } from "@swc/helpers/_/_async_to_generator";
import "@swc/helpers/_/_ts_generator";
import { _ as t } from "@swc/helpers/_/_ts_generator";
import './fouc';
import { displayContent as r } from './fouc';
import './on-demand-entries-client';
import o from './on-demand-entries-client';
import './error-overlay/websocket';
import { addMessageListener as a } from './error-overlay/websocket';
import { connectHMR as n } from './error-overlay/websocket';
var c = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
window.__NEXT_DATA__ = c;
var s = c.assetPrefix, i = c.page, _ = null, p = __webpack_hash__, u = (s = s || '') + (s.endsWith('/') ? '' : '/') + '_next/static/webpack/';
function l() {
    return (l = e(function() {
        var e, r;
        return t(this, function(t) {
            switch(t.label){
                case 0:
                    if (!(_ !== __webpack_hash__) || 'idle' !== module.hot.status()) return [
                        2
                    ];
                    t.label = 1;
                case 1:
                    return t.trys.push([
                        1,
                        4,
                        ,
                        5
                    ]), [
                        4,
                        fetch('undefined' != typeof __webpack_runtime_id__ ? "".concat(u).concat(p, ".").concat(__webpack_runtime_id__, ".hot-update.json") : "".concat(u).concat(p, ".hot-update.json"))
                    ];
                case 2:
                    return [
                        4,
                        t.sent().json()
                    ];
                case 3:
                    return e = t.sent(), r = '/' === i ? 'index' : i, (Array.isArray(e.c) ? e.c : Object.keys(e.c)).some(function(e) {
                        return -1 !== e.indexOf("pages".concat(r.startsWith('/') ? r : "/".concat(r))) || -1 !== e.indexOf("pages".concat(r.startsWith('/') ? r : "/".concat(r)).replace(/\//g, '\\'));
                    }) ? document.location.reload(!0) : p = _, [
                        3,
                        5
                    ];
                case 4:
                    return console.error('Error occurred checking for update', t.sent()), document.location.reload(!0), [
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
a(function(e) {
    if ('\uD83D\uDC93' !== e.data) try {
        var t = JSON.parse(e.data);
        if ('sync' === t.action || 'built' === t.action) {
            if (!t.hash) return;
            _ = t.hash, function() {
                l.apply(this, arguments);
            }();
        } else 'reloadPage' === t.action && document.location.reload(!0);
    } catch (t) {
        console.warn('Invalid HMR message: ' + e.data + '\n' + t);
    }
}), n({
    assetPrefix: s,
    path: '/_next/webpack-hmr'
}), r(), o(c.page);
