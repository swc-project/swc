import * as swcHelpers from "@swc/helpers";
//@target: ES6
var s = Symbol();
delete Symbol.iterator;
void Symbol.toPrimitive;
swcHelpers.typeOf(Symbol.toStringTag);
++s;
--s;
+Symbol();
-Symbol();
~Symbol();
!Symbol();
+(Symbol() || 0);
