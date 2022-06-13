import _type_of from "@swc/helpers/src/_type_of.mjs";
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
