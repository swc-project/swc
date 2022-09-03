//// [stringLiteralsWithSwitchStatements03.ts]
var x, y, z;
switch(x){
    case randBool() ? "foo" : "baz":
    case randBool(), "bar":
    case "bar":
    case "baz":
    case "foo":
    case "bar":
    case z || "baz":
    case "baz":
}
