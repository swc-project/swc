import _instanceof from "@swc/helpers/src/_instanceof.mjs";
//@target: ES6
_instanceof(Symbol(), Symbol);
_instanceof(Symbol, Symbol());
_instanceof(Symbol() || {}, Object); // This one should be okay, it's a valid way of distinguishing types
_instanceof(Symbol, Symbol() || {});
