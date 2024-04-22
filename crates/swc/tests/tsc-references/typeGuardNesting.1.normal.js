//// [typeGuardNesting.ts]
var strOrBool;
if (typeof strOrBool === 'boolean' && !strOrBool || typeof strOrBool === 'string') {
    var label = typeof strOrBool === 'string' ? strOrBool : "string";
    var bool = typeof strOrBool === 'boolean' ? strOrBool : false;
    var label2 = typeof strOrBool !== 'boolean' ? strOrBool : "string";
    var bool2 = typeof strOrBool !== 'string' ? strOrBool : false;
}
if (typeof strOrBool !== 'string' && !strOrBool || typeof strOrBool !== 'boolean') {
    var label1 = typeof strOrBool === 'string' ? strOrBool : "string";
    var bool1 = typeof strOrBool === 'boolean' ? strOrBool : false;
    var label21 = typeof strOrBool !== 'boolean' ? strOrBool : "string";
    var bool21 = typeof strOrBool !== 'string' ? strOrBool : false;
}
