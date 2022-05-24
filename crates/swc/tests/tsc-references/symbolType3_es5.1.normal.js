import _type_of from "@swc/helpers/lib/_type_of.js";
//@target: ES6
var s = Symbol();
delete Symbol.iterator;
void Symbol.toPrimitive;
_type_of(Symbol.toStringTag);
++s;
--s;
+Symbol();
-Symbol();
~Symbol();
!Symbol();
+(Symbol() || 0);
