//// [symbolType3.ts]
var s = Symbol();
delete Symbol.iterator;
void Symbol.toPrimitive;
typeof Symbol.toStringTag;
++s;
--s;
+Symbol();
-Symbol();
~Symbol();
!Symbol();
+(Symbol() || 0);
