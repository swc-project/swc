import * as swcHelpers from "@swc/helpers";
function foobar(_param = {}) {
    var { bar ={}  } = _param;
    swcHelpers.objectWithoutProperties(_param, [
        "bar"
    ]);
}
suddenly((_param)=>{
    var { x: a  } = _param;
    return swcHelpers.objectWithoutProperties(_param, [
        "x"
    ]).y;
}), suddenly((_param = {
    x: {
        z: 1,
        ka: 1
    },
    y: 'noo'
})=>{
    var { x: { z =12  }  } = _param, nested = swcHelpers.objectWithoutProperties(_param.x, [
        "z"
    ]), rest = swcHelpers.objectWithoutProperties(_param, [
        "x"
    ]);
    return rest.y + nested.ka;
}), foobar(), foobar({
    baz: 'hello'
}), foobar({
    bar: {
        greeting: 'hello'
    }
});
