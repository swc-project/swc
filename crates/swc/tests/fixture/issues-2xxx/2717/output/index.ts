import e from "@swc/helpers/src/_ts_generator.mjs";
import { takeLatest as t, select as r } from "redux-saga/effects";
import { CHANGE_THEME as s, CHANGE_THEME_CUSTOM_PALETTE as o, CHANGE_THEME_SWITCH_MODE as c } from "core/actions/changeTheme";
export var selectThemeObject = function(e) {
    return e.theme;
};
export function saveTheme(t) {
    var s, o, a, n;
    return e(this, function(e) {
        switch(e.label){
            case 0:
                return s = t.type, [
                    4,
                    r(selectThemeObject)
                ];
            case 1:
                return o = e.sent(), a = {}, window.localStorage.setItem("theme", JSON.stringify((a.theme = o.theme, a.mode = o.mode, a.palette = o.palette, a))), s === c && (n = window.document.querySelector("body")) && (n.classList.add("light" === o.mode ? "light" : "dark"), n.classList.remove("light" === o.mode ? "dark" : "light")), [
                    2
                ];
        }
    });
}
export default function a() {
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
};
