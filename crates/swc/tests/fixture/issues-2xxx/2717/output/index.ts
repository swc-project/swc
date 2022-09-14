import e from "@swc/helpers/src/_ts_generator.mjs";
import { takeLatest as t, select as r } from "redux-saga/effects";
import { CHANGE_THEME as s, CHANGE_THEME_CUSTOM_PALETTE as o, CHANGE_THEME_SWITCH_MODE as c } from "core/actions/changeTheme";
export var selectThemeObject = function(e) {
    return e.theme;
};
export function saveTheme(t) {
    var s, o, n, a;
    return e(this, function(e) {
        switch(e.label){
            case 0:
                return s = t.type, [
                    4,
                    r(selectThemeObject)
                ];
            case 1:
                return o = e.sent(), n = {}, window.localStorage.setItem("theme", JSON.stringify((n.theme = o.theme, n.mode = o.mode, n.palette = o.palette, n))), s === c && (a = window.document.querySelector("body")) && (a.classList.add("light" === o.mode ? "light" : "dark"), a.classList.remove("light" === o.mode ? "dark" : "light")), [
                    2
                ];
        }
    });
}
export default function n() {
    return e(this, function(e) {
        switch(e.label){
            case 0:
                return [
                    4,
                    t([
                        s,
                        o,
                        c
                    ], saveTheme)
                ];
            case 1:
                return e.sent(), [
                    2
                ];
        }
    });
}
