import e from "@swc/helpers/src/_ts_generator.mjs";
import { takeLatest as t, select as r } from "redux-saga/effects";
import { CHANGE_THEME as o, CHANGE_THEME_CUSTOM_PALETTE as s, CHANGE_THEME_SWITCH_MODE as n } from "core/actions/changeTheme";
export var selectThemeObject = function(e) {
    return e.theme;
};
export function saveTheme(t) {
    var o, s, c, m;
    return e(this, function(e) {
        switch(e.label){
            case 0:
                return o = t.type, [
                    4,
                    r(selectThemeObject)
                ];
            case 1:
                return s = e.sent(), c = {}, window.localStorage.setItem("theme", JSON.stringify((c.theme = s.theme, c.mode = s.mode, c.palette = s.palette, c))), o === n && (m = window.document.querySelector("body")) && (m.classList.add("light" === s.mode ? "light" : "dark"), m.classList.remove("light" === s.mode ? "dark" : "light")), [
                    2
                ];
        }
    });
}
export default function c() {
    return e(this, function(e) {
        switch(e.label){
            case 0:
                return [
                    4,
                    t([
                        o,
                        s,
                        n
                    ], saveTheme)
                ];
            case 1:
                return e.sent(), [
                    2
                ];
        }
    });
};
