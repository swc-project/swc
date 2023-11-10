//// [typeGuardsObjectMethods.ts]
var strOrNum, var1, obj1 = {
    method: function(param1) {
        var var2;
        return "string" == typeof var1 && var1.length, "string" == typeof var2 && var2.length, "string" == typeof param1 && param1.length, strOrNum;
    },
    get prop () {
        var var2;
        return "string" == typeof var1 && var1.length, "string" == typeof var2 && var2.length, strOrNum;
    },
    set prop (param){
        var var21;
        "string" == typeof var1 && var1.length, "string" == typeof var21 && var21.length, "string" == typeof param && param.length;
    }
};
strOrNum = "string" == typeof obj1.method(strOrNum) && obj1.method(strOrNum), strOrNum = "string" == typeof obj1.prop && obj1.prop;
