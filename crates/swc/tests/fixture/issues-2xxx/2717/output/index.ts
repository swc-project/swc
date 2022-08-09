import e from "regenerator-runtime";
var t = e.mark(saveTheme);
import { takeLatest as r, select as o } from "redux-saga/effects";
import { CHANGE_THEME as s, CHANGE_THEME_CUSTOM_PALETTE as a, CHANGE_THEME_SWITCH_MODE as n } from "core/actions/changeTheme";
export var selectThemeObject = function(e) {
    return e.theme;
};
export function saveTheme(r) {
    var s, a, c;
    return e.wrap(function(e) {
        for(;;)switch(e.prev = e.next){
            case 0:
                return s = r.type, e.next = 3, o(selectThemeObject);
            case 3:
                a = e.sent, window.localStorage.setItem("theme", JSON.stringify({
                    theme: a.theme,
                    mode: a.mode,
                    palette: a.palette
                })), s === n && (c = window.document.querySelector("body")) && (c.classList.add("light" === a.mode ? "light" : "dark"), c.classList.remove("light" === a.mode ? "dark" : "light"));
            case 6:
            case "end":
                return e.stop();
        }
    }, t);
}
export default function c() {
    return e.wrap(function(e) {
        for(;;)switch(e.prev = e.next){
            case 0:
                return e.next = 2, r([
                    s,
                    a,
                    n
                ], saveTheme);
            case 2:
            case "end":
                return e.stop();
        }
    }, c);
};
