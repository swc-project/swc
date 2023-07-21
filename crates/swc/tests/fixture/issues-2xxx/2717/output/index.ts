import { _ as e } from "@swc/helpers/_/_ts_generator";
import { takeLatest as t, select as r } from "redux-saga/effects";
import { CHANGE_THEME as o, CHANGE_THEME_CUSTOM_PALETTE as s, CHANGE_THEME_SWITCH_MODE as a } from "core/actions/changeTheme";
export var selectThemeObject = function(n) {
    return n.theme;
};
export function saveTheme(n) {
    var c, i, m;
    return e(this, function(e) {
        switch(e.label){
            case 0:
                return c = n.type, [
                    4,
                    r(selectThemeObject)
                ];
            case 1:
                return i = e.sent(), window.localStorage.setItem("theme", JSON.stringify({
                    theme: i.theme,
                    mode: i.mode,
                    palette: i.palette
                })), c === a && (m = window.document.querySelector("body")) && (m.classList.add("light" === i.mode ? "light" : "dark"), m.classList.remove("light" === i.mode ? "dark" : "light")), [
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
