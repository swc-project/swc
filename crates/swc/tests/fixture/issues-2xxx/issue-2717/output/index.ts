import a from "regenerator-runtime";
var b = a.mark(saveTheme);
import { takeLatest as c, select as d } from "redux-saga/effects";
import { CHANGE_THEME as e, CHANGE_THEME_CUSTOM_PALETTE as f, CHANGE_THEME_SWITCH_MODE as g } from "core/actions/changeTheme";
export var selectThemeObject = function(a) {
    return a.theme;
};
export function saveTheme(c) {
    var e, f, h;
    return a.wrap(function(a) {
        for(;;)switch(a.prev = a.next){
            case 0:
                return e = c.type, a.next = 3, d(selectThemeObject);
            case 3:
                f = a.sent, window.localStorage.setItem("theme", JSON.stringify({
                    theme: f.theme,
                    mode: f.mode,
                    palette: f.palette
                })), e === g && (h = window.document.querySelector("body")) && (h.classList.add("light" === f.mode ? "light" : "dark"), h.classList.remove("light" === f.mode ? "dark" : "light"));
            case 6:
            case "end":
                return a.stop();
        }
    }, b);
}
export default function h() {
    return a.wrap(function(a) {
        for(;;)switch(a.prev = a.next){
            case 0:
                return a.next = 2, c([
                    e,
                    f,
                    g
                ], saveTheme);
            case 2:
            case "end":
                return a.stop();
        }
    }, h);
};
