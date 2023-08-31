//// [typeGuardsObjectMethods.ts]
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// variables in global
var strOrNum, var1, obj1 = {
    // Inside method
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
// return expression of the method
strOrNum = "string" == typeof obj1.method(strOrNum) && obj1.method(strOrNum), // accessing getter property
strOrNum = "string" == typeof obj1.prop && obj1.prop;
