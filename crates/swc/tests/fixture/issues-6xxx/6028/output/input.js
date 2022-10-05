import _create_for_of_iterator_helper_loose from "@swc/helpers/src/_create_for_of_iterator_helper_loose.mjs";
var m = new Map([
    [
        1,
        2
    ]
]);
for(var _iterator = _create_for_of_iterator_helper_loose(m.keys()), _step; !(_step = _iterator()).done;){
    var k = _step.value;
    console.log(k);
}
