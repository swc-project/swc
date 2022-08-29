//// [stringLiteralsWithSwitchStatements01.ts]
var x;
var y;
switch(x){
    case "foo":
        break;
    case "bar":
        break;
    case y:
        y;
        break;
}
