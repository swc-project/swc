//// [instantiateTemplateTagTypeParameterOnVariableStatement.js]
var seq = function(a) {
    return function(b) {
        return b;
    };
}, text1 = "hello", text2 = "world", text3 = seq(text1)(text2);
