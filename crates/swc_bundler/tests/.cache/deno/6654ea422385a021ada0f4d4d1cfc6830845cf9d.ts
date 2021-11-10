// Loaded from https://deno.land/x/cliffy@v0.18.0/keycode/key_codes.ts


/** Base key mapping. */
export const KeyMap: Record<string, string> = {
  /* xterm/gnome ESC [ letter (with modifier) */
  "[P": "f1",
  "[Q": "f2",
  "[R": "f3",
  "[S": "f4",

  /* xterm/gnome ESC O letter (without modifier) */
  "OP": "f1",
  "OQ": "f2",
  "OR": "f3",
  "OS": "f4",

  /* xterm/rxvt ESC [ number ~ */
  "[11~": "f1",
  "[12~": "f2",
  "[13~": "f3",
  "[14~": "f4",

  /* from Cygwin and used in libuv */
  "[[A": "f1",
  "[[B": "f2",
  "[[C": "f3",
  "[[D": "f4",
  "[[E": "f5",

  /* common */
  "[15~": "f5",
  "[17~": "f6",
  "[18~": "f7",
  "[19~": "f8",
  "[20~": "f9",
  "[21~": "f10",
  "[23~": "f11",
  "[24~": "f12",

  /* xterm ESC [ letter */
  "[A": "up",
  "[B": "down",
  "[C": "right",
  "[D": "left",
  "[E": "clear",
  "[F": "end",
  "[H": "home",

  /* xterm/gnome ESC O letter */
  "OA": "up",
  "OB": "down",
  "OC": "right",
  "OD": "left",
  "OE": "clear",
  "OF": "end",
  "OH": "home",

  /* xterm/rxvt ESC [ number ~ */
  "[1~": "home",
  "[2~": "insert",
  "[3~": "delete",
  "[4~": "end",
  "[5~": "pageup",
  "[6~": "pagedown",

  /* putty */
  "[[5~": "pageup",
  "[[6~": "pagedown",

  /* rxvt */
  "[7~": "home",
  "[8~": "end",
};

/** Shift key mapping. */
export const KeyMapShift: Record<string, string> = {
  /* rxvt keys with modifiers */
  "[a": "up",
  "[b": "down",
  "[c": "right",
  "[d": "left",
  "[e": "clear",

  "[2$": "insert",
  "[3$": "delete",
  "[5$": "pageup",
  "[6$": "pagedown",
  "[7$": "home",
  "[8$": "end",

  "[Z": "tab",
};

/** Ctrl key mapping. */
export const KeyMapCtrl: Record<string, string> = {
  /* rxvt keys with modifiers */
  "Oa": "up",
  "Ob": "down",
  "Oc": "right",
  "Od": "left",
  "Oe": "clear",

  "[2^": "insert",
  "[3^": "delete",
  "[5^": "pageup",
  "[6^": "pagedown",
  "[7^": "home",
  "[8^": "end",
};

/** Special key mapping. */
export const SpecialKeyMap: Record<string, string> = {
  "\r": "return",
  "\n": "enter",
  "\t": "tab",
  "\b": "backspace",
  "\x7f": "backspace",
  " ": "space",
};
