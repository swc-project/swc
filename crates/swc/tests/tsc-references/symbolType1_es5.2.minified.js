import _instanceof from "@swc/helpers/src/_instanceof.mjs";
_instanceof(Symbol(), Symbol), _instanceof(Symbol, Symbol()), _instanceof(Symbol() || {}, Object), _instanceof(Symbol, Symbol() || {});
