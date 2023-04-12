var _create_for_of_iterator_helper_loose = require("@swc/helpers/_/_create_for_of_iterator_helper_loose");
var m = new Map([
    [
        1,
        2
    ]
]);
for(var _iterator = _create_for_of_iterator_helper_loose._(m.keys()), _step; !(_step = _iterator()).done;){
    var k = _step.value;
    console.log(k);
}
