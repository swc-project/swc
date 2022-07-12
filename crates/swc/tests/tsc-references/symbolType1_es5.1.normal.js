//@target: ES6
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
_instanceof(Symbol(), Symbol);
_instanceof(Symbol, Symbol());
_instanceof(Symbol() || {}, Object); // This one should be okay, it's a valid way of distinguishing types
_instanceof(Symbol, Symbol() || {});
