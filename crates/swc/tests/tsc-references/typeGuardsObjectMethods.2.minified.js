//// [typeGuardsObjectMethods.ts]
var strOrNum, obj1 = {
    method: function(param) {
        return "string" == typeof param && param.length, strOrNum;
    },
    get prop () {
        return strOrNum;
    },
    set prop (param){
        "string" == typeof param && param.length;
    }
};
strOrNum = "string" == typeof obj1.method(strOrNum) && obj1.method(strOrNum), strOrNum = "string" == typeof obj1.prop && obj1.prop;
