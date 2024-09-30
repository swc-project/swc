//// [templateLiteralTypes4.ts]
// infer from number
;
;
;
p.getIndex(0); // ok, 0 is a valid index
p.getIndex(1); // ok, 1 is a valid index
p.getIndex(2); // error, 2 is not a valid index
p.setIndex(0, 0); // ok, 0 is a valid index
p.setIndex(1, 0); // ok, 1 is a valid index
p.setIndex(2, 3); // error, 2 is not a valid index
f1("**123**"); // "123"
f2("**123**"); // 123
f3("**123**"); // 123n
f4("**true**"); // true | "true"
f4("**false**"); // false | "false"
