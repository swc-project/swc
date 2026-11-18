require("core-js/modules/es.object.create.js");
require("core-js/modules/esnext.object.group-by.js");
var data = [
    {
        name: 'a',
        type: 'a'
    },
    {
        name: 'b',
        type: 'a'
    },
    {
        name: 'c',
        type: 'b'
    }
];
var result = Object.groupBy(data, function(param) {
    var type = param.type;
    return type;
});
