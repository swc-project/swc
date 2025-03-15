//// [stringLiteralsWithSwitchStatements03.ts]
switch(void 0){
    case randBool() ? "foo" : "baz":
    case randBool() ? "bar" : 1 ? "bar" : "baz":
}
