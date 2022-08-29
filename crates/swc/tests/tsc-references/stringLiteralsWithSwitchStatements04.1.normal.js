//// [stringLiteralsWithSwitchStatements04.ts]
var x;
var y;
switch(y){
    case "foo", x:
        break;
    case x, "foo":
        break;
    case x, "baz":
        break;
    case "baz", x:
        break;
    case "baz" && "bar":
        break;
    case "baz" && ("foo" || "bar"):
        break;
    case "bar" && ("baz" || "bar"):
        break;
}
