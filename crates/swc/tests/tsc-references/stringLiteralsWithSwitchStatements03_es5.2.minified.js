var x, z;
switch(x){
    case randBool() ? "foo" : "baz":
    case randBool(), "bar":
    case "bar":
    case "baz":
    case "foo":
        break;
    case "bar":
    case z || "baz":
}
