import _instanceof from "@swc/helpers/lib/_instanceof.js";
//@target: ES6
_instanceof(Symbol(), Symbol);
_instanceof(Symbol, Symbol());
_instanceof(Symbol() || {}, Object); // This one should be okay, it's a valid way of distinguishing types
_instanceof(Symbol, Symbol() || {});
