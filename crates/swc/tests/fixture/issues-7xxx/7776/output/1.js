var _object_without_properties_loose = require("@swc/helpers/_/_object_without_properties_loose");
function fn(_param) {
    var foo = _param[0].foo, bar = _param[1].bar, flags = _object_without_properties_loose._(_param[0], [
        "foo"
    ]);
    console.log(flags.rangeChanged);
}
