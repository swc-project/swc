//// [typeGuardsInFunction.ts]
var num, var1, strOrNum;
function f(param) {
    var var2;
    num = "string" == typeof var1 && var1.length, num = "string" == typeof var2 && var2.length, num = "string" == typeof param && param.length;
}
function f1(param) {}
function f2(param) {
    var param1, var3, var2;
    param1 = param, num = "string" == typeof var1 && var1.length, num = "string" == typeof var2 && var2.length, num = "string" == typeof param && param.length, num = "string" == typeof var3 && var3.length, num = "string" == typeof param1 && param1.length;
}
function f3(param) {
    var param1, var3, var2;
    param1 = param, num = "string" == typeof var1 && var1.length, num = "string" == typeof var2 && var2.length, num = "string" == typeof param && param.length, num = "string" == typeof var3 && var3.length, num = "string" == typeof param1 && param1.length;
}
function f4() {
    return strOrNum;
}
strOrNum = "string" == typeof f4() && f4();
