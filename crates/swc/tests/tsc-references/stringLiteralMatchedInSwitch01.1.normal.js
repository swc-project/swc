//// [stringLiteralMatchedInSwitch01.ts]
var foo;
switch(foo){
    case "a":
    case "b":
        break;
    default:
        foo = foo[0];
        break;
}
