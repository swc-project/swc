// Loaded from https://deno.land/x/cliffy@v0.18.0/prompt/figures.ts


const main = {
  ARROW_UP: "↑",
  ARROW_DOWN: "↓",
  ARROW_LEFT: "←",
  ARROW_RIGHT: "→",
  ARROW_UP_LEFT: "↖",
  ARROW_UP_RIGHT: "↗",
  ARROW_DOWN_RIGHT: "↘",
  ARROW_DOWN_LEFT: "↙",
  RADIO_ON: "◉",
  RADIO_OFF: "◯",
  TICK: "✔",
  CROSS: "✘",
  ELLIPSIS: "…",
  POINTER_SMALL: "›",
  LINE: "─",
  POINTER: "❯",
  INFO: "ℹ",
  TAB_LEFT: "⇤",
  TAB_RIGHT: "⇥",
  ESCAPE: "⎋",
  BACKSPACE: "⌫",
  PAGE_UP: "⇞",
  PAGE_DOWN: "⇟",
  ENTER: "↵",
  SEARCH: "⌕",
};

const win = {
  ...main,
  RADIO_ON: "(*)",
  RADIO_OFF: "( )",
  TICK: "√",
  CROSS: "×",
  POINTER_SMALL: "»",
};

/** Prompt icons. */
export const Figures = Deno.build.os === "windows" ? win : main;
