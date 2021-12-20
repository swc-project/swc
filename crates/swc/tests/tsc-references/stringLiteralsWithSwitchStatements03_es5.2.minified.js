var x, z;
switch(x){
    case randBool() ? "foo" : "baz":
        break;
    case randBool(), "bar":
        break;
    case "bar":
        break;
    case "baz":
        break;
    case "foo":
        break;
    case "bar":
        break;
    case z || "baz":
    case "baz":
        break;
}
