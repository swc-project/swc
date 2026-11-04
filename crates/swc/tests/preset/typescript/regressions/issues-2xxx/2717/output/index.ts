import { _ as e } from "@swc/helpers/_/_ts_generator";
import { takeLatest as t, select as r } from "redux-saga/effects";
import { CHANGE_THEME as o, CHANGE_THEME_CUSTOM_PALETTE as s, CHANGE_THEME_SWITCH_MODE as a } from "core/actions/changeTheme";
export var selectThemeObject = function(e) {
    return e.theme;
};
export function saveTheme(t) {
    var o, s, n;
    return e(this, function(e) {
        switch(e.label){
            case 0:
                return o = t.type, [
                    4,
                    r(selectThemeObject)
                ];
            case 1:
                return s = e.sent(), window.localStorage.setItem("theme", JSON.stringify({
                    theme: s.theme,
                    mode: s.mode,
                    palette: s.palette
                })), o === a && (n = window.document.querySelector("body")) && (n.classList.add("light" === s.mode ? "light" : "dark"), n.classList.remove("light" === s.mode ? "dark" : "light")), [
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
                        o,
                        s,
                        a
                    ], saveTheme)
                ];
            case 1:
                return e.sent(), [
                    2
                ];
        }
    });
}
