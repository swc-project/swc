var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
//@target: ES6
var s = Symbol();
delete Symbol.iterator;
void Symbol.toPrimitive;
_typeof(Symbol.toStringTag);
++s;
--s;
+Symbol();
-Symbol();
~Symbol();
!Symbol();
+(Symbol() || 0);
