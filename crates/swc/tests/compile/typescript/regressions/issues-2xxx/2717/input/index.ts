import { takeLatest, select } from "redux-saga/effects";
import {
    CHANGE_THEME,
    CHANGE_THEME_CUSTOM_PALETTE,
    CHANGE_THEME_SWITCH_MODE,
} from "core/actions/changeTheme";
import { ReduxAction, ReduxState } from "types";

export const selectThemeObject = (state: ReduxState) => state.theme;

export function* saveTheme({ type }: ReduxAction) {
    // @ts-ignore
    const theme = yield select(selectThemeObject);
    window.localStorage.setItem(
        "theme",
        JSON.stringify({
            theme: theme.theme,
            mode: theme.mode,
            palette: theme.palette,
        })
    );
    if (type === CHANGE_THEME_SWITCH_MODE) {
        const body = window.document.querySelector("body");
        if (body) {
            body.classList.add(theme.mode === "light" ? "light" : "dark");
            body.classList.remove(theme.mode === "light" ? "dark" : "light");
        }
    }
}

export default function* themeSaga() {
    yield takeLatest(
        [CHANGE_THEME, CHANGE_THEME_CUSTOM_PALETTE, CHANGE_THEME_SWITCH_MODE],
        saveTheme
    );
}
