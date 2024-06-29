import { _ as e } from "@swc/helpers/_/_ts_generator";
import { takeLatest as t } from "redux-saga/effects";
import { CHANGE_THEME as r } from "core/actions/changeTheme";
import { CHANGE_THEME_CUSTOM_PALETTE as o } from "core/actions/changeTheme";
import { CHANGE_THEME_SWITCH_MODE as a } from "core/actions/changeTheme";
export default function s() {
    return e(this, function(e) {
        switch(e.label){
            case 0:
                return [
                    4,
                    t([
                        r,
                        o,
                        a
                    ], n)
                ];
            case 1:
                return e.sent(), [
                    2
                ];
        }
    });
}
import "@swc/helpers/_/_ts_generator";
import "redux-saga/effects";
import "core/actions/changeTheme";
var c = function(e) {
    return e.theme;
};
import { _ as e } from "@swc/helpers/_/_ts_generator";
import { select as m } from "redux-saga/effects";
import { CHANGE_THEME_SWITCH_MODE as a } from "core/actions/changeTheme";
function n(t) {
    var r, o, s;
    return e(this, function(e) {
        switch(e.label){
            case 0:
                return r = t.type, [
                    4,
                    m(c)
                ];
            case 1:
                return o = e.sent(), window.localStorage.setItem("theme", JSON.stringify({
                    theme: o.theme,
                    mode: o.mode,
                    palette: o.palette
                })), r === a && (s = window.document.querySelector("body")) && (s.classList.add("light" === o.mode ? "light" : "dark"), s.classList.remove("light" === o.mode ? "dark" : "light")), [
                    2
                ];
        }
    });
}
export { c as selectThemeObject, n as saveTheme, s as default };
