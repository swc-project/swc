import a from "regenerator-runtime";
import { takeLatest as b, select as c } from "redux-saga/effects";
import { CHANGE_THEME as d, CHANGE_THEME_CUSTOM_PALETTE as e, CHANGE_THEME_SWITCH_MODE as f } from "core/actions/changeTheme";
var g = a.mark(saveTheme);
export function saveTheme(b) {
    var d, e, h;
    return a.wrap(function(a) {
        for(;;)switch(a.prev = a.next){
            case 0:
                return d = b.type, a.next = 3, c(function(a) {
                    return a.theme;
                });
            case 3:
                e = a.sent, window.localStorage.setItem("theme", JSON.stringify({
                    theme: e.theme,
                    mode: e.mode,
                    palette: e.palette
                })), d === f && (h = window.document.querySelector("body")) && (h.classList.add("light" === e.mode ? "light" : "dark"), h.classList.remove("light" === e.mode ? "dark" : "light"));
            case 6:
            case "end":
                return a.stop();
        }
    }, g);
}
export default function h() {
    return a.wrap(function(a) {
        for(;;)switch(a.prev = a.next){
            case 0:
                return a.next = 2, b([
                    d,
                    e,
                    f
                ], saveTheme);
            case 2:
            case "end":
                return a.stop();
        }
    }, h);
};
